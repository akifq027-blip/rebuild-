/**
 * BHARAT — Build the Civilization
 * AI Acharya Historical Guide Interactive Drawer / Chat Panel
 */

import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Sparkles,
  Send,
  X,
  BookOpen,
  Bot,
  User,
  HelpCircle,
  Clock,
  Compass,
  Landmark,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'acharya';
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface AcharyaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  gameContext: {
    eraTitle: string;
    eraChapter: number;
    civilizationName: string;
    selectedBuilding?: string;
    selectedTech?: string;
    selectedArtifact?: string;
    currentObjective?: string;
    population?: number;
  };
}

export const AcharyaDrawer: React.FC<AcharyaDrawerProps> = ({
  isOpen,
  onClose,
  gameContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'acharya',
      text: `Namaste, noble architect of ${gameContext.civilizationName}! I am Acharya, your historical mentor. You are currently experiencing ${gameContext.eraTitle} (Chapter ${gameContext.eraChapter}). Ask me about ancient technologies, urban architecture, cultural developments, or how to advance your civilization!`,
      timestamp: 'Now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputVal;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputVal('');
    setIsThinking(true);

    try {
      const res = await api.askAcharya(textToSend.trim(), gameContext);

      if (res.success && res.data?.answer) {
        const acharyaMsg: ChatMessage = {
          id: `msg_${Date.now()}_acharya`,
          sender: 'acharya',
          text: res.data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, acharyaMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `msg_${Date.now()}_acharya`,
          sender: 'acharya',
          text: 'Acharya is temporarily consulting historical records. Please try asking again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `msg_${Date.now()}_acharya`,
        sender: 'acharya',
        text: 'Acharya is temporarily unavailable. Let us consult the archaeological archives shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const suggestedQuestions = [
    'What is this era?',
    'Why is this building important?',
    'What does this artifact tell us?',
    'How did trade work in ancient India?',
    'How do I unlock Agriculture?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-110 bg-stone-900 border-l border-amber-900/60 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-600/50 flex items-center justify-center text-amber-400 shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-amber-200 text-sm">ACHARYA</h3>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.2 rounded font-semibold">
                Historical Mentor
              </span>
            </div>
            <p className="text-[11px] text-stone-400 truncate max-w-55">
              Context: {gameContext.eraTitle}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Context Pill Bar */}
      <div className="px-4 py-2 bg-stone-950/70 border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto text-[11px] text-stone-400 shrink-0">
        <span className="font-semibold text-amber-400 uppercase tracking-wider text-[10px] shrink-0">
          Focus:
        </span>
        <span className="bg-stone-800/80 px-2 py-0.5 rounded text-stone-300 shrink-0">
          Ch. {gameContext.eraChapter} {gameContext.eraTitle}
        </span>
        {gameContext.population && (
          <span className="bg-stone-800/80 px-2 py-0.5 rounded text-stone-300 shrink-0">
            Pop: {gameContext.population}
          </span>
        )}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {(messages || []).map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'acharya' && (
              <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 ${
                m.sender === 'user'
                  ? 'bg-amber-600 text-stone-950 font-medium rounded-tr-none'
                  : m.isError
                  ? 'bg-red-950/60 border border-red-800/70 text-red-200 rounded-tl-none'
                  : 'bg-stone-950/90 border border-stone-800 text-stone-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <div
                className={`text-[9px] text-right ${
                  m.sender === 'user' ? 'text-amber-950/70' : 'text-stone-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 shrink-0 mt-1">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0 mt-1">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="bg-stone-950/90 border border-stone-800 text-amber-300/80 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Acharya is contemplating ancient texts & archaeological records...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Quick Chips */}
      <div className="p-3 bg-stone-950/50 border-t border-stone-800 space-y-1.5 shrink-0">
        <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest block">
          Suggested Topics:
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
          {(suggestedQuestions || []).map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(q)}
              disabled={isThinking}
              className="text-[11px] bg-stone-850 hover:bg-stone-800 text-stone-300 hover:text-amber-300 px-2.5 py-1 rounded-full border border-stone-750 hover:border-amber-700/60 transition-colors text-left cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask Acharya about this civilization..."
          disabled={isThinking}
          className="flex-1 bg-stone-900 border border-stone-750 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isThinking}
          className="p-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 rounded-xl transition-colors cursor-pointer shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
