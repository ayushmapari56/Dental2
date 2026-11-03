import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { mongoDB } from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize MongoDB Connection & Collections
mongoDB.init().catch((err) => {
  console.error('[Server] Failed to initialize database:', err);
});

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/api/db/status', async (_req: Request, res: Response) => {
  try {
    const status = await mongoDB.getStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/db/reconnect', async (_req: Request, res: Response) => {
  try {
    const atlasInfo = await mongoDB.reconnect();
    const status = await mongoDB.getStatus();
    res.json({ success: true, atlasInfo, status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reservations API
app.get('/api/reservations', async (_req: Request, res: Response) => {
  try {
    const reservations = await mongoDB.getReservations();
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/reservations', async (req: Request, res: Response) => {
  try {
    const { treatment, slot, patientName, patientPhone, insurance, notes, treatmentPrice } = req.body;
    if (!patientName || !patientPhone) {
      return res.status(400).json({ success: false, message: 'Name and Phone number are required' });
    }

    const suiteNames = [
      'Sanctuary Suite 1 (Greenwich Garden View)',
      'Aesthetic Studio Suite 2 (Acoustic Foam)',
      'Restorative Suite 3 (Ceiling Display)',
      'Private Clinical Suite 4',
    ];
    const assignedSuite = suiteNames[Math.floor(Math.random() * suiteNames.length)];

    const newReservation = await mongoDB.createReservation({
      treatment: treatment || 'Comprehensive Check & 3D Scan',
      treatmentPrice: treatmentPrice || '$150',
      slot: slot || 'Tomorrow 10:15 AM',
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      insurance: insurance || 'Delta Dental PPO',
      notes: notes ? notes.trim() : '',
      status: 'Confirmed',
      suiteAssigned: assignedSuite,
    });

    res.status(201).json({
      success: true,
      message: 'Suite reserved successfully in Tribeca Flagship Studio',
      data: newReservation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/reservations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await mongoDB.updateReservationStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.json({ success: true, message: `Reservation status updated to ${status}` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/reservations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await mongoDB.deleteReservation(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.json({ success: true, message: 'Reservation deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Testimonials API
app.get('/api/testimonials', async (_req: Request, res: Response) => {
  try {
    const testimonials = await mongoDB.getTestimonials();
    res.json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/testimonials', async (req: Request, res: Response) => {
  try {
    const { name, location, treatment, quote, rating } = req.body;
    if (!name || !quote) {
      return res.status(400).json({ success: false, message: 'Name and testimonial quote are required' });
    }

    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const created = await mongoDB.createTestimonial({
      name: name.trim(),
      location: location ? location.trim() : 'Tribeca, NYC',
      treatment: treatment || 'Porcelain Restorations',
      quote: quote.trim(),
      rating: rating ? parseInt(rating, 10) : 5,
      initials,
      verified: true,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Concierge Messages API
app.get('/api/concierge/messages', async (_req: Request, res: Response) => {
  try {
    const messages = await mongoDB.getMessages();
    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/concierge/messages', async (req: Request, res: Response) => {
  try {
    const { text, quickReply } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // Save patient message to MongoDB
    const patientMsg = await mongoDB.saveMessage({
      sender: 'patient',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      metadata: { quickReplyUsed: !!quickReply },
    });

    // Generate intelligent clinical concierge response
    const q = text.toLowerCase();
    let reply =
      'Thank you. Our Tribeca practice coordinator will verify your request immediately. Would you like us to confirm this over text message or a brief call?';

    if (q.includes('insurance') || q.includes('coverage') || q.includes('ppo')) {
      reply =
        'We are in-network with Delta Dental, Aetna, Cigna, MetLife, and Guardian PPO plans. If you share your Member ID, our clinical desk can provide an exact complimentary pre-estimate before your visit with zero surprise billing.';
    } else if (q.includes('slot') || q.includes('available') || q.includes('book') || q.includes('reserve') || q.includes('time')) {
      reply =
        'We currently have private suite availability tomorrow at 10:15 AM with Dr. Vance, and Thursday at 2:30 PM. You can also select any window in our Express Studio Reservation above to instantly secure your suite.';
    } else if (q.includes('veneer') || q.includes('cost') || q.includes('price') || q.includes('cosmetic')) {
      reply =
        'Handmade porcelain veneers start at $1,450 per tooth, crafted layer-by-layer to match your facial symmetry. This includes high-resolution 3D facial scans, mockups, and our 10-year warranty. We also offer 0% APR financing starting around $140/mo.';
    } else if (q.includes('pain') || q.includes('emergency') || q.includes('hurt') || q.includes('broken')) {
      reply =
        'For urgent emergencies or acute discomfort, we hold dedicated rapid-access chairs daily. Call our direct Tribeca priority line at (800) 555-3284, or select "Urgent Care" in the reservation card for immediate triage.';
    } else if (q.includes('doctor') || q.includes('vance') || q.includes('elena') || q.includes('credentials')) {
      reply =
        'Dr. Elena Vance, DDS, FICOI completed her surgical doctorate at Columbia University and advanced fellowship honors at the International Congress of Oral Implantologists. She is also a recognized top 1% Invisalign Diamond provider.';
    } else if (q.includes('anxiety') || q.includes('sedation') || q.includes('scared') || q.includes('relax')) {
      reply =
        'Our studio was purposefully architected for deep sensory calm. We feature private soundproof suites, Bowers & Wilkins noise-canceling headsets, ceiling streaming screens, warm aromatherapy, and gentle needle-free numbing protocols.';
    }

    // Save concierge response to MongoDB
    const conciergeMsg = await mongoDB.saveMessage({
      sender: 'concierge',
      text: reply,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      patientMessage: patientMsg,
      conciergeMessage: conciergeMsg,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite Middlewares in Dev or serve Static dist in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Bright Smile Server] Listening on http://0.0.0.0:${port}`);
  });
}

startServer();
