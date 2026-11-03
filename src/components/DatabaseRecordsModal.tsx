import React, { useState } from 'react';
import { Database, X, RefreshCw, Trash2, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Reservation, DBStatusResponse, ConciergeMessage, Testimonial } from '../types';

interface DatabaseRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbStatus: DBStatusResponse | null;
  reservations: Reservation[];
  messages: ConciergeMessage[];
  testimonials: Testimonial[];
  onRefresh: () => void;
  onStatusChange: (id: string, status: Reservation['status']) => void;
  onDeleteReservation: (id: string) => void;
}

export const DatabaseRecordsModal: React.FC<DatabaseRecordsModalProps> = ({
  isOpen,
  onClose,
  dbStatus,
  reservations,
  messages,
  testimonials,
  onRefresh,
  onStatusChange,
  onDeleteReservation,
}) => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'messages' | 'testimonials'>('reservations');
  const [filterQuery, setFilterQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectResult, setReconnectResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleReconnectAtlas = async () => {
    setIsReconnecting(true);
    setReconnectResult(null);
    try {
      const res = await fetch('/api/db/reconnect', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.atlasInfo) {
        if (data.atlasInfo.connected) {
          setReconnectResult('Successfully connected to MongoDB Atlas cluster!');
        } else if (data.atlasInfo.errorType === 'IP_WHITELIST_REQUIRED') {
          setReconnectResult(
            'Atlas is still waiting for IP access. Ensure 0.0.0.0/0 is added in MongoDB Atlas -> Network Access and saved.'
          );
        } else {
          setReconnectResult(data.atlasInfo.message || 'Connection attempt processed.');
        }
      }
      await onRefresh();
    } catch {
      setReconnectResult('Error testing Atlas connection. Check network.');
    } finally {
      setIsReconnecting(false);
    }
  };

  const filteredReservations = reservations.filter(
    (r) =>
      r.patientName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.treatment.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.insurance.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const atlas = dbStatus?.atlasConnection;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#122B26] text-white p-5 flex items-center justify-between shrink-0 border-b border-[#15332D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#15332D] border border-[#C5A880]/30 flex items-center justify-center text-[#E6D7C3]">
              <Database className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  MongoDB Clinical Database Explorer
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {dbStatus?.engine === 'mongodb-native' ? 'MongoDB Atlas Native' : 'MongoDB Engine Active'}
                </span>
              </div>
              <p className="text-xs text-[#D5C1A7] mt-0.5 font-mono">
                Database: <span className="text-white font-semibold">bright_smile_studio</span> • Total Records:{' '}
                {reservations.length + messages.length + testimonials.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Refresh Collections"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MongoDB Atlas Status Notice */}
        {atlas?.configured && (
          <div className="p-4 bg-[#F5F3EF] border-b border-stone-200 text-xs">
            {atlas.connected ? (
              <div className="flex items-center justify-between gap-3 text-emerald-900 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Connected to MongoDB Atlas:</strong> {atlas.clusterHost || 'Remote Cluster'} (Database:{' '}
                    <code>bright_smile_studio</code>)
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Live TLS Sync
                </span>
              </div>
            ) : atlas.errorType === 'IP_WHITELIST_REQUIRED' ? (
              <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-amber-950">
                        MongoDB Atlas Cluster Detected: <code>{atlas.clusterHost}</code>
                      </p>
                      <p className="text-amber-800 leading-relaxed text-[11px]">
                        MongoDB Atlas uses Network Access control. To allow this cloud application to connect directly:
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReconnectAtlas}
                    disabled={isReconnecting}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-[#122B26] hover:bg-[#15332D] text-[#E6D7C3] hover:text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isReconnecting ? 'animate-spin' : ''}`} />
                    <span>{isReconnecting ? 'Connecting...' : 'Test Atlas Connection'}</span>
                  </button>
                </div>

                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-[11px] text-stone-700 space-y-1">
                  <p>
                    1. Open{' '}
                    <a
                      href="https://cloud.mongodb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#122B26] underline font-semibold inline-flex items-center gap-1"
                    >
                      MongoDB Atlas Console <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    &rarr; <strong>Network Access</strong> (left sidebar).
                  </p>
                  <p>
                    2. Click <strong>Add IP Address</strong> &rarr; Select{' '}
                    <strong>Allow Access from Anywhere (0.0.0.0/0)</strong> &rarr; Click <strong>Confirm</strong>.
                  </p>
                  <p className="text-stone-500 pt-0.5">
                    ✨ <em>Zero downtime:</em> All clinic reservations and chats are currently preserved in the integrated
                    persistent MongoDB storage engine.
                  </p>
                </div>

                {reconnectResult && (
                  <div className="text-[11px] font-medium text-stone-800 bg-white p-2 rounded-lg border border-stone-200">
                    {reconnectResult}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between text-stone-700 bg-white p-3 rounded-2xl border border-stone-200">
                <span className="text-xs">{atlas.message}</span>
                <button
                  onClick={handleReconnectAtlas}
                  disabled={isReconnecting}
                  className="px-3 py-1 rounded-lg bg-[#122B26] text-[#E6D7C3] text-xs font-medium cursor-pointer"
                >
                  {isReconnecting ? 'Retrying...' : 'Retry Connection'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Collection Selector Tabs */}
        <div className="bg-[#F5F3EF] px-5 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-[#122B26] text-[#E6D7C3] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Reservations Collection ({reservations.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[#122B26] text-[#E6D7C3] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Concierge Chats ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'testimonials'
                  ? 'bg-[#122B26] text-[#E6D7C3] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Patient Reviews ({testimonials.length})
            </button>
          </div>

          {activeTab === 'reservations' && (
            <input
              type="text"
              placeholder="Filter by name, procedure, or insurance..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#122B26] w-64"
            />
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 overflow-y-auto bg-[#FBFBF9]">
          {activeTab === 'reservations' && (
            <div className="space-y-3">
              {filteredReservations.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  No reservation records matched your search in collection <code className="font-mono">reservations</code>.
                </div>
              ) : (
                filteredReservations.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-[#AB8E65]/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#122B26] text-sm">{item.patientName}</span>
                        <span className="text-xs text-stone-500 font-mono">{item.patientPhone}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            item.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'In Suite'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>
                          <strong>Treatment:</strong> {item.treatment} ({item.treatmentPrice || '$150'})
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Window:</strong> {item.slot}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Insurance:</strong> {item.insurance}
                        </span>
                      </div>

                      <div className="text-[11px] text-stone-500 flex items-center gap-3 font-mono">
                        <span>Suite: {item.suiteAssigned}</span>
                        <span>•</span>
                        <span>Mongo ID: {item._id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={item.status}
                        onChange={(e) => onStatusChange(item._id, e.target.value as Reservation['status'])}
                        className="text-xs rounded-lg border border-stone-300 py-1.5 px-2 bg-white text-stone-700 focus:outline-none focus:border-[#122B26]"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Suite">In Suite</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => onDeleteReservation(item._id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete from MongoDB"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed max-w-2xl ${
                    m.sender === 'patient'
                      ? 'ml-auto bg-[#122B26] text-[#E6D7C3] border-[#15332D]'
                      : 'bg-white text-stone-800 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 font-mono">
                    <span>{m.sender === 'patient' ? 'Patient Inquiry' : 'Clinical Concierge Reply'}</span>
                    <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t._id} className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-[#122B26]">{t.name}</h4>
                      <p className="text-[10px] text-stone-400">
                        {t.location} • {t.treatment}
                      </p>
                    </div>
                    <span className="text-amber-500 text-xs">{'★'.repeat(t.rating)}</span>
                  </div>
                  <p className="font-serif italic text-xs text-stone-700 leading-relaxed">"{t.quote}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#F5F3EF] px-5 py-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>MongoDB Active</span>
            <span className="text-stone-300">|</span>
            <span className="font-mono text-[11px]">{dbStatus?.clientInfo || 'MongoDB Collection Driver'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium cursor-pointer"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
