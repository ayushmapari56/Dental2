export interface Reservation {
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

export interface ConciergeMessage {
  _id: string;
  sender: 'patient' | 'concierge';
  text: string;
  timestamp: string;
  metadata?: {
    intent?: string;
    quickReplyUsed?: boolean;
  };
}

export interface Testimonial {
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

export interface DBStatusResponse {
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
