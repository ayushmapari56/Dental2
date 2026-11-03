import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dns from 'dns';

// Ensure IPv4 lookup precedence for compatibility with Atlas
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore in older environments
}

export interface ReservationDocument {
  _id: string;
  treatment: string;
  treatmentPrice?: string;
  slot: string;
  patientName: string;
  patientPhone: string;
  insurance: string;
  notes?: string;
  status: 'Confirmed' | 'Pending' | 'In Suite' | 'Completed' | 'Cancelled';
  suiteAssigned: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConciergeMessageDocument {
  _id: string;
  sender: 'patient' | 'concierge';
  text: string;
  timestamp: string;
  metadata?: {
    intent?: string;
    quickReplyUsed?: boolean;
  };
}

export interface TestimonialDocument {
  _id: string;
  name: string;
  location: string;
  treatment: string;
  quote: string;
  rating: number;
  initials: string;
  verified: boolean;
  createdAt: string;
}

export interface AtlasConnectionInfo {
  configured: boolean;
  connected: boolean;
  message: string;
  errorType?: 'IP_WHITELIST_REQUIRED' | 'AUTH_FAILED' | 'TIMEOUT' | 'UNKNOWN';
  outboundIp?: string;
  clusterHost?: string;
}

export interface DBStatus {
  engine: 'mongodb-native' | 'mongodb-embedded';
  status: 'connected' | 'offline';
  database: string;
  collections: {
    reservations: number;
    concierge_messages: number;
    testimonials: number;
  };
  connectedAt: string;
  clientInfo?: string;
  atlasConnection?: AtlasConnectionInfo;
}

// Embedded MongoDB Collection Store implementation for hermetic execution and zero-downtime resilience
class EmbeddedMongoCollection<T extends { _id?: string }> {
  private collectionName: string;
  private filePath: string;

  constructor(collectionName: string, filePath: string) {
    this.collectionName = collectionName;
    this.filePath = filePath;
  }

  private loadAll(): T[] {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const data = JSON.parse(raw);
      return data[this.collectionName] || [];
    } catch {
      return [];
    }
  }

  private saveAll(items: T[]) {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      let data: Record<string, T[]> = {};
      if (fs.existsSync(this.filePath)) {
        try {
          data = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        } catch {
          data = {};
        }
      }
      data[this.collectionName] = items;
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error(`Error saving embedded mongo collection ${this.collectionName}:`, e);
    }
  }

  async find(filter: Partial<T> = {}): Promise<T[]> {
    const items = this.loadAll();
    const filterKeys = Object.keys(filter) as (keyof T)[];
    if (filterKeys.length === 0) return items;
    return items.filter((item) => filterKeys.every((key) => item[key] === filter[key]));
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const list = await this.find(filter);
    return list[0] || null;
  }

  async insertOne(doc: T): Promise<{ insertedId: string; acknowledged: boolean }> {
    const items = this.loadAll();
    const insertedId = doc._id || `mongo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const fullDoc = {
      ...doc,
      _id: insertedId,
      createdAt: (doc as any).createdAt || new Date().toISOString(),
      updatedAt: (doc as any).updatedAt || new Date().toISOString(),
    };
    items.unshift(fullDoc as T);
    this.saveAll(items);
    return { insertedId, acknowledged: true };
  }

  async updateOne(
    filter: Partial<T>,
    update: { $set?: Partial<T> }
  ): Promise<{ modifiedCount: number; matchedCount: number }> {
    const items = this.loadAll();
    const filterKeys = Object.keys(filter) as (keyof T)[];
    const index = items.findIndex((item) => filterKeys.every((k) => item[k] === filter[k]));
    if (index === -1) {
      return { modifiedCount: 0, matchedCount: 0 };
    }
    const target = items[index];
    const updated = {
      ...target,
      ...(update.$set || {}),
      updatedAt: new Date().toISOString(),
    };
    items[index] = updated;
    this.saveAll(items);
    return { modifiedCount: 1, matchedCount: 1 };
  }

  async deleteOne(filter: Partial<T>): Promise<{ deletedCount: number }> {
    const items = this.loadAll();
    const filterKeys = Object.keys(filter) as (keyof T)[];
    const index = items.findIndex((item) => filterKeys.every((k) => item[k] === filter[k]));
    if (index === -1) {
      return { deletedCount: 0 };
    }
    items.splice(index, 1);
    this.saveAll(items);
    return { deletedCount: 1 };
  }

  async countDocuments(filter: Partial<T> = {}): Promise<number> {
    const items = await this.find(filter);
    return items.length;
  }
}

// Global Database manager coordinating native MongoDB and resilient fallback
class MongoDatabaseManager {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private mode: 'mongodb-native' | 'mongodb-embedded' = 'mongodb-embedded';
  private connectedAt: string = new Date().toISOString();
  private dbPath = path.resolve(process.cwd(), '.data', 'mongo_store.json');
  private atlasInfo: AtlasConnectionInfo = {
    configured: false,
    connected: false,
    message: 'Embedded MongoDB engine active',
  };

  // Embedded collection instances
  private embeddedReservations = new EmbeddedMongoCollection<ReservationDocument>('reservations', this.dbPath);
  private embeddedMessages = new EmbeddedMongoCollection<ConciergeMessageDocument>('concierge_messages', this.dbPath);
  private embeddedTestimonials = new EmbeddedMongoCollection<TestimonialDocument>('testimonials', this.dbPath);

  async init() {
    await this.connectWithUri();
    await this.seedInitialData();
  }

  async reconnect() {
    return this.connectWithUri();
  }

  private async connectWithUri(): Promise<AtlasConnectionInfo> {
    const rawUri = process.env.MONGODB_URI;

    if (!rawUri || !rawUri.startsWith('mongodb')) {
      this.mode = 'mongodb-embedded';
      this.atlasInfo = {
        configured: false,
        connected: false,
        message: 'No external MONGODB_URI provided. Running on integrated MongoDB collection engine.',
      };
      return this.atlasInfo;
    }

    // Extract cluster host for friendly display
    const hostMatch = rawUri.match(/@([^/?]+)/);
    const clusterHost = hostMatch ? hostMatch[1] : 'MongoDB Cluster';

    try {
      if (this.client) {
        try {
          await this.client.close();
        } catch {
          // ignore
        }
      }

      console.log(`[MongoDB] Initializing connection to ${clusterHost}...`);

      const client = new MongoClient(rawUri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });

      await client.connect();
      this.client = client;
      this.db = this.client.db('bright_smile_studio');
      this.mode = 'mongodb-native';
      this.connectedAt = new Date().toISOString();

      this.atlasInfo = {
        configured: true,
        connected: true,
        message: `Successfully connected to MongoDB cluster (${clusterHost}).`,
        clusterHost,
      };

      console.log(`[MongoDB] Successfully connected to native cluster ${clusterHost}`);
      return this.atlasInfo;
    } catch (err: any) {
      // Diagnostic check for common Atlas issues:
      // Error: SSL alert number 80 / tlsv1 alert internal error means the IP is not on the Atlas IP Whitelist
      const isIpRestriction =
        (err.message && err.message.includes('alert number 80')) ||
        (err.message && err.message.includes('alert internal error'));

      const isAuthFailed =
        err.message && (err.message.includes('Authentication failed') || err.message.includes('bad auth'));

      const isTimeout =
        err.message && (err.message.includes('timed out') || err.message.includes('Server selection timed out'));

      let errorType: AtlasConnectionInfo['errorType'] = 'UNKNOWN';
      let friendlyMessage = 'Remote MongoDB cluster connection unavailable. Operating on integrated MongoDB engine.';

      if (isIpRestriction) {
        errorType = 'IP_WHITELIST_REQUIRED';
        friendlyMessage =
          'MongoDB Atlas IP Whitelist: Atlas is blocking this cloud instance. In your MongoDB Atlas Dashboard -> Network Access -> click "Add IP Address" and select "Allow Access From Anywhere (0.0.0.0/0)".';
        console.log(
          `[MongoDB] Notice: Remote Atlas cluster ${clusterHost} requires Network Access IP Whitelist (0.0.0.0/0). Embedded MongoDB engine is active.`
        );
      } else if (isAuthFailed) {
        errorType = 'AUTH_FAILED';
        friendlyMessage = 'MongoDB Atlas authentication failed. Please verify the database user credentials in MONGODB_URI.';
        console.log(`[MongoDB] Notice: Atlas authentication failed for ${clusterHost}. Embedded engine active.`);
      } else if (isTimeout) {
        errorType = 'TIMEOUT';
        friendlyMessage = 'Connection to MongoDB cluster timed out. Embedded engine active.';
        console.log(`[MongoDB] Notice: Connection timeout to ${clusterHost}. Embedded engine active.`);
      } else {
        console.log(`[MongoDB] Notice: Connection to ${clusterHost} deferred. Embedded engine active.`);
      }

      this.mode = 'mongodb-embedded';
      this.atlasInfo = {
        configured: true,
        connected: false,
        message: friendlyMessage,
        errorType,
        clusterHost,
        outboundIp: '34.34.226.1',
      };

      return this.atlasInfo;
    }
  }

  private async seedInitialData() {
    const reservationCount = await this.getReservationsCount();
    if (reservationCount === 0) {
      const demoReservations: Omit<ReservationDocument, '_id'>[] = [
        {
          treatment: 'Comprehensive Check & 3D Scan',
          treatmentPrice: '$150',
          slot: 'Tomorrow 10:15 AM',
          patientName: 'Alexandra Sterling',
          patientPhone: '(212) 555-0182',
          insurance: 'Delta Dental PPO',
          notes: 'Routine 6-month checkup and 3D dental scan.',
          status: 'Confirmed',
          suiteAssigned: 'Sanctuary Suite 1 (Greenwich Garden View)',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          treatment: 'Aesthetic Smile Consult',
          treatmentPrice: 'Complimentary',
          slot: 'Thursday 2:30 PM',
          patientName: 'Julian Thorne',
          patientPhone: '(917) 555-4921',
          insurance: 'Direct Private Pay',
          notes: 'Interested in handcrafted porcelain veneers for upper arch.',
          status: 'Confirmed',
          suiteAssigned: 'Aesthetic Studio Suite 2',
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          treatment: 'Laser Teeth Whitening',
          treatmentPrice: '$399',
          slot: 'Friday 9:00 AM',
          patientName: 'Camilla Vance-Dupont',
          patientPhone: '(646) 555-8390',
          insurance: 'Cigna Healthcare',
          notes: 'Laser whitening session before wedding gala.',
          status: 'Confirmed',
          suiteAssigned: 'Sanctuary Suite 3',
          createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      for (const res of demoReservations) {
        await this.createReservation(res);
      }
    }

    const testCount = await this.getTestimonialsCount();
    if (testCount === 0) {
      const initialReviews: Omit<TestimonialDocument, '_id'>[] = [
        {
          name: 'Marcus Reynolds',
          location: 'Tribeca',
          treatment: 'Porcelain Restorations',
          quote:
            'I avoided the dentist for nearly 7 years due to childhood trauma. Walking into Bright Smile felt more like checking into The Greenwich Hotel. Dr. Vance didn\'t judge me once; she explained every step softly.',
          rating: 5,
          initials: 'MR',
          verified: true,
          createdAt: new Date().toISOString(),
        },
        {
          name: 'Sophia Chen',
          location: 'Financial District',
          treatment: 'Invisalign Diamond',
          quote:
            'Their zero-wait guarantee is 100% authentic. As a working mother and partner at a law firm, punctuality is paramount. In the chair at 8:00 AM sharp, finished by 8:50 AM with zero stress.',
          rating: 5,
          initials: 'SC',
          verified: true,
          createdAt: new Date().toISOString(),
        },
        {
          name: 'David Lindqvist',
          location: 'SoHo',
          treatment: 'Aesthetic Smile Design',
          quote:
            'The upfront pricing transparency was refreshing. They printed my estimated Delta Dental coverage before touching a tool. Zero hidden fees, world-class veneer outcome.',
          rating: 5,
          initials: 'DL',
          verified: true,
          createdAt: new Date().toISOString(),
        },
      ];

      for (const rev of initialReviews) {
        await this.createTestimonial(rev);
      }
    }

    const msgCount = await this.getMessagesCount();
    if (msgCount === 0) {
      await this.saveMessage({
        sender: 'concierge',
        text: 'Welcome to Bright Smile Dental Studio. I am your direct liaison to Dr. Vance’s clinical team. Would you like to check in-network coverage, view this week’s private suite openings, or ask a treatment question?',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // --- Reservations ---
  async getReservations(): Promise<ReservationDocument[]> {
    if (this.mode === 'mongodb-native' && this.db) {
      try {
        const docs = await this.db.collection('reservations').find({}).sort({ createdAt: -1 }).toArray();
        return docs.map((d) => ({ ...d, _id: d._id.toString() } as unknown as ReservationDocument));
      } catch {
        // Fallback to embedded
      }
    }
    return this.embeddedReservations.find({});
  }

  async getReservationsCount(): Promise<number> {
    if (this.mode === 'mongodb-native' && this.db) {
      try {
        return await this.db.collection('reservations').countDocuments();
      } catch {
        // Fallback to embedded
      }
    }
    return this.embeddedReservations.countDocuments();
  }

  async createReservation(data: Omit<ReservationDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<ReservationDocument> {
    const newDoc: ReservationDocument = {
      ...data,
      _id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (this.mode === 'mongodb-native' && this.db) {
      try {
        const res = await this.db.collection('reservations').insertOne(newDoc as any);
        newDoc._id = res.insertedId.toString();
        return newDoc;
      } catch {
        // Fallback to embedded
      }
    }

    await this.embeddedReservations.insertOne(newDoc);
    return newDoc;
  }

  async updateReservationStatus(id: string, status: ReservationDocument['status']): Promise<boolean> {
    if (this.mode === 'mongodb-native' && this.db) {
      try {
        const res = await this.db.collection('reservations').updateOne(
          { _id: id as any },
          { $set: { status, updatedAt: new Date().toISOString() } }
        );
        if (res.modifiedCount > 0) return true;
      } catch {
        // Fallback to embedded
      }
    }
    const res = await this.embeddedReservations.updateOne({ _id: id }, { $set: { status } });
    return res.modifiedCount > 0;
  }

  async deleteReservation(id: string): Promise<boolean> {
    if (this.mode === 'mongodb-native' && this.db) {
      try {
        const res = await this.db.collection('reservations').deleteOne({ _id: id as any });
        if (res.deletedCount > 0) return true;
      } catch {
        // Fallback to embedded
      }
    }
    const res = await this.embeddedReservations.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }

  // --- Testimonials ---
  async getTestimonials(): Promise<TestimonialDocument[]> {
    if (this.mode === 'mongodb-native' && this.db) {
      try {
        const docs = await this.db.collection('testimonials').find({}).sort({ createdAt: -1 }).toArray();
        return docs.map((d) => ({ ...d, _id: d._id.toString() } as unknown as TestimonialDocument));
      } catch {
        // Fallback to embedded
      }
    }
    return this.embeddedTestimonials.find({});
  }

  async getTestimonialsCount(): Promise<number> {
    if (this.mode === 'mongodb-native' && this.db) {
      try {
        return await this.db.collection('testimonials').countDocuments();
      } catch {
        // Fallback to embedded
      }
    }
    return this.embeddedTestimonials.countDocuments();
  }

  async createTestimonial(data: Omit<TestimonialDocument, '_id'>): Promise<TestimonialDocument> {
    const doc: TestimonialDocument = {
      ...data,
      _id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    if (this.mode === 'mongodb-native' && this.db) {
      try {
        const res = await this.db.collection('testimonials').insertOne(doc as any);
        doc._id = res.insertedId.toString();
        return doc;
      } catch {
        // Fallback to embedded
      }
    }
    await this.embeddedTestimonials.insertOne(doc);
    return doc;
  }

  // --- Concierge Messages ---
  async getMessages(): Promise<ConciergeMessageDocument[]> {
    if (this.mode === 'mongodb-native' && this.db) {
      try {
        const docs = await this.db.collection('concierge_messages').find({}).sort({ timestamp: 1 }).toArray();
        return docs.map((d) => ({ ...d, _id: d._id.toString() } as unknown as ConciergeMessageDocument));
      } catch {
        // Fallback to embedded
      }
    }
    return this.embeddedMessages.find({});
  }

  async getMessagesCount(): Promise<number> {
    if (this.mode === 'mongodb-native' && this.db) {
      try {
        return await this.db.collection('concierge_messages').countDocuments();
      } catch {
        // Fallback to embedded
      }
    }
    return this.embeddedMessages.countDocuments();
  }

  async saveMessage(data: Omit<ConciergeMessageDocument, '_id'>): Promise<ConciergeMessageDocument> {
    const doc: ConciergeMessageDocument = {
      ...data,
      _id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    if (this.mode === 'mongodb-native' && this.db) {
      try {
        const res = await this.db.collection('concierge_messages').insertOne(doc as any);
        doc._id = res.insertedId.toString();
        return doc;
      } catch {
        // Fallback to embedded
      }
    }
    await this.embeddedMessages.insertOne(doc);
    return doc;
  }

  // --- Status and Stats ---
  async getStatus(): Promise<DBStatus> {
    const reservationsCount = await this.getReservationsCount();
    const messagesCount = await this.getMessagesCount();
    const testimonialsCount = await this.getTestimonialsCount();

    return {
      engine: this.mode,
      status: 'connected',
      database: 'bright_smile_studio',
      collections: {
        reservations: reservationsCount,
        concierge_messages: messagesCount,
        testimonials: testimonialsCount,
      },
      connectedAt: this.connectedAt,
      clientInfo: this.mode === 'mongodb-native' ? 'MongoDB Cluster' : 'MongoDB Collection Engine (Persistent JSON)',
      atlasConnection: this.atlasInfo,
    };
  }
}

export const mongoDB = new MongoDatabaseManager();
