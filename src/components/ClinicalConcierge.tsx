import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X, Send, Sparkles } from 'lucide-react';
import { ConciergeMessage } from '../types';

interface ClinicalConciergeProps {
  initialMessages: ConciergeMessage[];
  onMessageLogged?: () => void;
  onReserveTreatment?: (treatment: string) => void;
}

export const ClinicalConcierge: React.FC<ClinicalConciergeProps> = ({
  initialMessages,
  onMessageLogged,
  onReserveTreatment,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ConciergeMessage[]>(initialMessages);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const quickChips = [
    { label: '💳 Check My Insurance', text: 'How do I check my dental insurance coverage?' },
    { label: '⚡ Next Available Slot', text: 'When is your next private suite opening with Dr. Vance?' },
    { label: '💎 Veneer Cost & Preview', text: 'What is the cost and process for handmade porcelain veneers?' },
    { label: '🚨 Urgent Tooth Care', text: 'I am experiencing tooth pain, do you have emergency appointments?' },
  ];

  const handleSend = async (textToSend: string, quickReply = false) => {
    const text = textToSend.trim();
    if (!text) return;

    // Optimistically append patient message
    const tempPatientMsg: ConciergeMessage = {
      _id: `temp_${Date.now()}`,
      sender: 'patient',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempPatientMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/concierge/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, quickReply }),
      });
      const data = await res.json();

      if (data.success && data.conciergeMessage) {
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, data.conciergeMessage]);
          if (onMessageLogged) onMessageLogged();
        }, 600);
      } else {
        setIsTyping(false);
      }
    } catch {
      setIsTyping(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputVal);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 bg-[#122B26] hover:bg-[#15332D] text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl border border-[#C5A880]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#E6D7C3] font-serif text-base">
                BS
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#122B26] animate-pulse" />
            </div>
            <div className="text-left leading-tight hidden xs:block">
              <span className="block text-xs font-semibold tracking-wide text-[#E6D7C3]">Clinical Concierge</span>
              <span className="block text-[10px] text-stone-300">Live Insurance & Booking</span>
            </div>
          </button>
        </div>
      )}

      {/* Concierge Drawer Panel */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-[420px] z-50 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col transition-all duration-300 animate-scale-up"
          style={{ height: '580px', maxHeight: 'calc(100vh - 48px)' }}
        >
          {/* Header */}
          <div className="bg-[#122B26] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-[#15332D]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#15332D] border border-[#C5A880]/30 flex items-center justify-center font-serif text-[#E6D7C3] text-sm font-semibold">
                  BS
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#122B26] rounded-full" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-white tracking-wide">Tribeca Clinical Desk</h4>
                <p className="text-[11px] text-[#E6D7C3] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Private Concierge Online
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Concierge"
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Chips */}
          <div className="bg-[#F5F3EF]/80 border-b border-stone-200/80 px-3.5 py-2.5 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.text, true)}
                className="whitespace-nowrap bg-white border border-stone-200 text-stone-700 hover:border-[#122B26] hover:text-[#122B26] px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FBFBF9]/90 text-xs">
            <div className="text-center my-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 bg-[#F5F3EF] px-2.5 py-0.5 rounded-full border border-stone-200/60">
                Tribeca Concierge • MongoDB Logged
              </span>
            </div>

            {messages.map((msg) => {
              const isPatient = msg.sender === 'patient';
              return (
                <div
                  key={msg._id}
                  className={`flex items-start gap-2.5 max-w-[90%] ${isPatient ? 'ml-auto justify-end' : ''}`}
                >
                  {!isPatient && (
                    <div className="w-7 h-7 rounded-full bg-[#122B26] text-[#E6D7C3] flex items-center justify-center font-serif text-xs shrink-0 mt-0.5 shadow-xs">
                      BS
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed text-xs ${
                      isPatient
                        ? 'bg-[#122B26] text-[#E6D7C3] rounded-tr-xs shadow-xs'
                        : 'bg-white text-stone-700 rounded-tl-xs border border-stone-200 shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5 max-w-[88%]">
                <div className="w-7 h-7 rounded-full bg-[#122B26] text-[#E6D7C3] flex items-center justify-center font-serif text-xs shrink-0 mt-0.5">
                  BS
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-xs border border-stone-200 shadow-xs text-stone-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form onSubmit={onSubmit} className="p-3 bg-white border-t border-stone-200 shrink-0">
            <div className="flex items-center gap-2 bg-[#F5F3EF]/90 rounded-2xl p-1.5 border border-stone-200 focus-within:border-[#122B26] focus-within:bg-white transition-all">
              <input
                autoComplete="off"
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
                placeholder="Ask about pricing, insurance, or booking..."
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button
                disabled={!inputVal.trim()}
                aria-label="Send Message"
                className="bg-[#122B26] hover:bg-[#15332D] text-[#E6D7C3] hover:text-white p-2.5 rounded-xl transition-colors shrink-0 disabled:opacity-40 cursor-pointer"
                type="submit"
              >
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>
            </div>
            <p className="text-[10px] text-center text-stone-400 mt-1.5">
              Direct encrypted HIPAA transmission • Live clinical coordinator
            </p>
          </form>
        </div>
      )}
    </>
  );
};
