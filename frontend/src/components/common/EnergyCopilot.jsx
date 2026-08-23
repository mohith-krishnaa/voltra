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
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX
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
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: `👋 Hi! I am your **Voltra AI Energy & Voice Copilot**.\n\nYou can **type or speak** with me using the microphone button! Ask me about state utility slabs, rooftop solar sizing, or how to reduce your power bills.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen]);

  // Global listener so any button in navbar/hero can open the Copilot
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-energy-copilot', handleOpenEvent);
    return () => window.removeEventListener('open-energy-copilot', handleOpenEvent);
  }, []);

  // Text to speech helper
  const speakText = (rawText) => {
    if (!voiceOutputEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks and URLs for natural speaking
      const cleanText = rawText
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/—/g, '')
        .replace(/₹/g, 'rupees ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS error:", e);
    }
  };

  // Initialize Speech-to-Text
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English / Hinglish

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsListening(false);
    }
  };

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
        speakText(data.reply);
      } else {
        throw new Error("Backend response error");
      }
    } catch (err) {
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
      speakText(localReply);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button with Pulsing Badge */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] border border-white/15 text-xs font-mono font-bold text-[#A3FF6B] shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#A3FF6B]" />
            <span>Ask AI & Voice Assistant</span>
          </motion.div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[#A3FF6B] text-[#0B0B0B] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-[#0B0B0B]"
          title="Open AI Energy & Voice Copilot"
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
            className="fixed bottom-24 sm:bottom-24 right-3 sm:right-6 z-50 w-[94vw] sm:w-[440px] max-h-[580px] h-[580px] bg-[#111111] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Chat Header */}
            <div className="p-4 bg-[#0B0B0B] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#A3FF6B] text-[#0B0B0B] flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F5F3ED] flex items-center gap-1.5">
                    <span>Voltra AI & Voice Assistant</span>
                    <span className="w-2 h-2 rounded-full bg-[#A3FF6B] animate-pulse" />
                  </h4>
                  <p className="text-[10px] font-mono text-[#8A8A84]">
                    {household?.tariff_zone?.split('-')[0] || 'TGSPDCL'} Energy Intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Voice Output Speaker Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (voiceOutputEnabled) window.speechSynthesis?.cancel();
                    setVoiceOutputEnabled(!voiceOutputEnabled);
                  }}
                  className={`p-1.5 rounded-lg border transition ${
                    voiceOutputEnabled 
                      ? 'bg-[#A3FF6B]/15 text-[#A3FF6B] border-[#A3FF6B]/30' 
                      : 'text-[#8A8A84] border-white/10 hover:text-white'
                  }`}
                  title={voiceOutputEnabled ? "Voice Speech Enabled" : "Voice Speech Muted"}
                >
                  {voiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setIsOpen(false);
                  }}
                  className="text-[#8A8A84] hover:text-[#F5F3ED] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
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

              {isListening && (
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 p-2 bg-red-950/20 border border-red-500/30 rounded-xl animate-pulse">
                  <Mic className="w-4 h-4 text-red-400 animate-bounce" />
                  <span>Listening to your voice... Speak now!</span>
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

            {/* Message Input Box with Microphone Voice Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#0B0B0B] border-t border-white/10 flex items-center gap-2"
            >
              {/* Voice Microphone Input Button */}
              <button
                type="button"
                onClick={startListening}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white border-red-500 animate-pulse'
                    : 'bg-[#181818] text-[#A3FF6B] border-white/10 hover:border-[#A3FF6B]'
                }`}
                title={isListening ? "Listening..." : "Click to speak via Microphone"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                placeholder={isListening ? "Listening... Speak now..." : "Ask in English, Hindi, Telugu..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#181818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] placeholder-[#8A8A84] focus:outline-none focus:border-[#A3FF6B]"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-[#A3FF6B] text-[#0B0B0B] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                title="Send message"
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
