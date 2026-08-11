import React, { useState, useRef, useEffect } from 'react';
import { Eye, Send, Sparkles, Shield, AlertTriangle, Zap, Bot, RefreshCw, Layers, X } from 'lucide-react';
import { ChatMessage } from '../types';
import { useAuth } from '../context/AuthContext';

interface LoreChatbotProps {
  onClose?: () => void;
}

export const LoreChatbot: React.FC<LoreChatbotProps> = ({ onClose }) => {
  const { updateNexusPoints } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'uatu',
      text: 'Saludos, mortal. Soy Uatu El Observador. Veo todo lo que ha sido, lo que es y lo que podría ser en el Multiverso. Formula tu hipótesis o duda sobre el MCU, los cómics o la Sagrada Línea del Tiempo.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nexusRiskLevel: 'Estable',
      nexusProbability: 100,
      evidencePoints: [
        'Registro de la Sagrada Línea del Tiempo Tierra-616',
        'Archivos Históricos de la TVA',
        'Crónicas Multiversales de los Observadores'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '¿Qué pasaría si Iron Man hubiera sobrevivido a Endgame?',
    '¿Cuál es el verdadero origen de la TVA y Miss Minutes?',
    '¿Cómo influirá Doctor Doom (RDJ) en Secret Wars?',
    '¿Qué pasaría si Wanda nunca hubiera creado el Hex de Westview?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      const data = await res.json();

      const uatuMsg: ChatMessage = {
        id: 'uatu-' + Date.now(),
        sender: 'uatu',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        nexusRiskLevel: data.nexusRiskLevel || 'Onda Nexus Menor',
        nexusProbability: data.nexusProbability ?? 80,
        evidencePoints: data.evidencePoints || [],
        timelineImpact: data.timelineImpact
      };

      setMessages(prev => [...prev, uatuMsg]);
      // Reward user with 10 Nexus points for interacting with Uatu
      updateNexusPoints(10);

    } catch (err) {
      console.error('Error enviando consulta a Uatu Bot:', err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'uatu',
          text: 'Las fluctuaciones del Telar del Tiempo interfieren con la transmisión. Sin embargo, en la mayoría de universos observables, tu hipótesis desataría una divergencia notable.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          nexusRiskLevel: 'Onda Nexus Menor',
          nexusProbability: 60
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="tva-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-gradient-to-br from-amber-500/10 to-red-600/20 blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-950 via-slate-900 to-red-950 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-xl relative group">
              <Eye className="w-8 h-8 group-hover:scale-110 transition-transform text-amber-300" />
              <div className="absolute inset-0 rounded-2xl border border-amber-400/30 animate-pulse pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel text-2xl font-bold text-amber-200">
                  UATU BOT • CONSULTOR DEL CANON
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/80 border border-red-500/50 text-red-300 uppercase tracking-wider">
                  IA GEMINI 3.6
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Haz preguntas de Lore, explora escenarios <span className="text-amber-400 font-medium">"¿Qué pasaría si...?"</span> y detecta Eventos Nexus que amenacen la Sagrada Línea del Tiempo.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-xs font-mono text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>+10 Pts por consulta</span>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-red-950/80 border border-red-600 text-white hover:bg-red-800 transition-colors"
                title="Cerrar Chat"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Chat Console */}
      <div className="tva-card rounded-2xl border border-amber-500/20 overflow-hidden flex flex-col h-[580px] shadow-2xl">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUatu = msg.sender === 'uatu';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUatu ? 'items-start' : 'items-start justify-end'}`}
              >
                {isUatu && (
                  <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 flex-shrink-0 mt-1">
                    <Eye className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-3 ${isUatu ? 'text-slate-200' : 'text-amber-100'}`}>
                  
                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl border text-sm leading-relaxed shadow-lg ${
                      isUatu
                        ? 'bg-[#15121b] border-amber-500/30 rounded-tl-none'
                        : 'bg-gradient-to-r from-red-900/80 to-amber-950/80 border-red-500/40 rounded-tr-none text-right'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5 font-mono text-[10px] text-slate-400">
                      <span className="font-bold tracking-wider uppercase text-amber-400">
                        {isUatu ? 'UATU EL OBSERVADOR' : 'TÚ (AGENTE TVA)'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="whitespace-pre-line text-slate-200">{msg.text}</p>

                    {/* Uatu Metrics & Nexus Event Detection Badge */}
                    {isUatu && msg.nexusRiskLevel && (
                      <div className="mt-4 pt-3 border-t border-amber-500/20 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          
                          {/* Risk Badge */}
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider font-mono border ${
                              msg.nexusRiskLevel === 'Evento Nexus Crítico'
                                ? 'bg-red-950/90 border-red-500 text-red-400 animate-pulse'
                                : msg.nexusRiskLevel === 'Onda Nexus Menor'
                                ? 'bg-amber-950/90 border-amber-500 text-amber-300'
                                : 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Riesgo: {msg.nexusRiskLevel}</span>
                          </div>

                          {/* Probability Indicator */}
                          {msg.nexusProbability !== undefined && (
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                              <span>Ocurrencia:</span>
                              <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                                <div
                                  className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all"
                                  style={{ width: `${msg.nexusProbability}%` }}
                                />
                              </div>
                              <span className="font-bold text-amber-400">{msg.nexusProbability}%</span>
                            </div>
                          )}
                        </div>

                        {/* Timeline Impact Statement */}
                        {msg.timelineImpact && (
                          <p className="text-xs text-amber-200/90 italic bg-amber-950/30 p-2 rounded-lg border border-amber-500/10">
                            ⚡ <span className="font-semibold text-amber-300">Impacto en el Tiempo:</span> {msg.timelineImpact}
                          </p>
                        )}

                        {/* Evidence Points list */}
                        {msg.evidencePoints && msg.evidencePoints.length > 0 && (
                          <div className="text-[11px] text-slate-400 space-y-1">
                            <span className="font-bold text-slate-300 uppercase font-mono tracking-wider">Evidencia del Canon:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                              {msg.evidencePoints.map((pt, idx) => (
                                <li key={idx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                </div>

                {!isUatu && (
                  <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 flex-shrink-0 mt-1 font-bold text-xs">
                    TVA
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-amber-400 text-xs font-mono p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 max-w-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Sintonizando frecuencias del Multiverso...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions Row */}
        <div className="p-3 bg-slate-950/90 border-t border-amber-500/10 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Sugerencias:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-amber-500/20 text-slate-300 hover:text-amber-200 hover:border-amber-400 whitespace-nowrap transition-all flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 bg-[#0d0d12] border-t border-amber-500/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta a Uatu sobre el lore, la TVA o un escenario What If..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-red-950/40 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Consultar</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
