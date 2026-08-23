import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Zap, 
  Sun, 
  Sliders, 
  ArrowRight,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_QUERIES = [
  "How to stay under 200 units for Gruha Jyothi?",
  "Calculate 3kW solar rooftop savings",
  "How much does increasing AC from 18°C to 24°C save?",
  "What is the cheapest time of day to charge an EV?"
];

export default function EnergyCopilot({ 
  household, 
  predictionResult, 
  onNavigateTab,
  currencySymbol = "₹"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: `👋 Hi! I am your **Voltra AI Energy Copilot**.\n\nI can analyze your household's progressive electricity slabs, recommend solar rooftop sizing, or suggest how to reduce your power bills. Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen]);

  const handleSendMessage = async (msgToSend = inputMessage) => {
    const text = (msgToSend || '').trim();
    if (!text || loading) return;

    const userEntry = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userEntry]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          household: household,
          predicted_units: predictionResult?.predicted_units || 324.3,
          predicted_bill: predictionResult?.bill?.total_bill || 2108.16
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [
          ...prev, 
          {
            sender: 'bot',
            text: data.reply,
            action_chip: data.action_chip,
            action_tab: data.action_tab,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error("Backend response error");
      }
    } catch (err) {
      // Fallback local smart response
      let localReply = `⚡ For **${household?.tariff_zone || 'Telangana'}**, shifting AC set temperature to 24°C and running high-wattage loads during 10 AM – 4 PM solar hours will cut your monthly invoice by up to 25%.`;
      if (text.toLowerCase().includes('solar')) {
        localReply = `☀️ For your ~${Math.round(predictionResult?.predicted_units || 320)} units monthly consumption, a **3kW Rooftop Solar System** qualifies for ₹78,000 direct PM Surya Ghar subsidy and pays for itself in ~3.4 years.`;
      }

      setChatHistory(prev => [
        ...prev,
        {
          sender: 'bot',
          text: localReply,
          action_chip: "Explore Simulator",
          action_tab: "whatif",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[#A3FF6B] text-[#0B0B0B] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[#0B0B0B]/20"
          title="Open AI Energy Copilot"
        >
          {isOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Bot className="w-7 h-7 stroke-[2.2]" />}
        </button>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[580px] h-[580px] bg-[#111111] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Chat Header */}
            <div className="p-4 bg-[#0B0B0B] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#A3FF6B] text-[#0B0B0B] flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F5F3ED] flex items-center gap-1.5">
                    <span>Voltra AI Copilot</span>
                    <span className="w-2 h-2 rounded-full bg-[#A3FF6B] animate-pulse" />
                  </h4>
                  <p className="text-[10px] font-mono text-[#8A8A84]">
                    {household?.tariff_zone?.split('-')[0] || 'TGSPDCL'} Energy Intelligence
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#8A8A84] hover:text-[#F5F3ED] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#A3FF6B] text-[#0B0B0B] font-medium rounded-br-none'
                        : 'bg-[#181818] text-[#F5F3ED] border border-white/5 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    
                    {msg.action_chip && onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateTab(msg.action_tab || 'whatif');
                          setIsOpen(false);
                        }}
                        className="mt-2.5 px-3 py-1.5 rounded-lg bg-[#0B0B0B] text-[#A3FF6B] border border-[#A3FF6B]/30 hover:bg-[#A3FF6B] hover:text-[#0B0B0B] text-[11px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{msg.action_chip}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <span className="text-[9px] font-mono text-[#8A8A84] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A84] p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#A3FF6B]" />
                  <span>Analyzing state tariff slabs & appliances...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            {chatHistory.length <= 2 && (
              <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
                {SUGGESTED_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 rounded-full bg-[#181818] hover:bg-[#222222] border border-white/10 text-[10px] text-[#8A8A84] hover:text-[#F5F3ED] whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Message Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#0B0B0B] border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about electricity bills, solar, Gruha Jyothi..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] placeholder-[#8A8A84] focus:outline-none focus:border-[#A3FF6B]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2 rounded-xl bg-[#A3FF6B] text-[#0B0B0B] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
