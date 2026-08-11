import React, { useState } from 'react';
import { Zap, Sparkles, Shield, AlertTriangle, Send, Share2, Check, RefreshCw, Layers } from 'lucide-react';
import { Theory, MCUPhase } from '../types';
import { useAuth } from '../context/AuthContext';

interface TheoryAnalyzerProps {
  onPublishTheory: (theory: Theory) => void;
}

export const TheoryAnalyzer: React.FC<TheoryAnalyzerProps> = ({ onPublishTheory }) => {
  const { user, updateNexusPoints } = useAuth();
  const [character, setCharacter] = useState('');
  const [artifact, setArtifact] = useState('');
  const [scenario, setScenario] = useState('');
  const [phase, setPhase] = useState<MCUPhase>('Fase 6');
  
  const [loading, setLoading] = useState(false);
  const [generatedTheory, setGeneratedTheory] = useState<Theory | null>(null);
  const [published, setPublished] = useState(false);

  const presets = [
    { char: 'Doctor Strange', art: 'El Cero Absoluto', phase: 'Fase 6' as MCUPhase },
    { char: 'Loki God of Stories', art: 'El Ojo de Agamotto', phase: 'Fase 5' as MCUPhase },
    { char: 'Scarlet Witch', art: 'El Telar del Tiempo', phase: 'Fase 6' as MCUPhase },
    { char: 'Deadpool & Wolverine', art: 'La Silla de Tiempo de Mobius', phase: 'Fase 5' as MCUPhase }
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!character.trim() && !artifact.trim()) return;

    setLoading(true);
    setPublished(false);
    setGeneratedTheory(null);

    try {
      const res = await fetch('/api/gemini/theory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character, artifact, scenario, phase })
      });

      const data = await res.json();

      const newTheory: Theory = {
        id: 'theory-ai-' + Date.now(),
        title: data.title || `Teoría Multiversal de ${character} y ${artifact}`,
        premise: data.premise || 'Una teoría generada por el Motor Multiversal de la TVA.',
        fullContent: data.fullContent || 'Contenido detallado de la teoría...',
        authorName: user?.username || 'Agente de la TVA',
        authorHandle: user?.agentHandle || '@agente_tva',
        authorAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        phase: phase,
        category: 'Películas',
        tags: data.tags || [character, artifact, 'IA Generated', phase],
        nexusProbability: data.nexusProbability ?? 85,
        nexusRisk: data.nexusRisk || 'Crítico / Colapso Temporal',
        nexusPoints: 1,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        character,
        artifact,
        isAiGenerated: true,
        isNexusEvent: data.isNexusEvent ?? true
      };

      setGeneratedTheory(newTheory);

    } catch (err) {
      console.error("Error generando teoría:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (!generatedTheory) return;
    onPublishTheory(generatedTheory);
    setPublished(true);
    updateNexusPoints(25); // Reward user with +25 Nexus points
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> GENERADOR DE TEORÍAS CON IA GEMINI
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-red-500">
          FORJA UNA TEORÍA MULTIVERSAL
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Combina un personaje con un artefacto o elemento del MCU. El Motor Multiversal analizará las probabilidades canon y redactará una hipótesis cinemática completa.
        </p>
      </div>

      {/* Input Form */}
      <div className="tva-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Quick Preset Selector */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-amber-400/90 mb-2 font-bold">
            ⚡ Combinaciones Populares Rápidas:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCharacter(p.char);
                  setArtifact(p.art);
                  setPhase(p.phase);
                }}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-400 text-left text-xs transition-all flex items-center justify-between group"
              >
                <span className="text-slate-200 group-hover:text-amber-200 font-medium">
                  {p.char} + {p.art}
                </span>
                <span className="text-[10px] text-amber-500 font-mono">{p.phase}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 pt-2 border-t border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Personaje del MCU / Cómics
              </label>
              <input
                type="text"
                required
                value={character}
                onChange={e => setCharacter(e.target.value)}
                placeholder="Ej. Doctor Strange, Wanda, Victor Von Doom"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Artefacto, Objeto o Evento
              </label>
              <input
                type="text"
                required
                value={artifact}
                onChange={e => setArtifact(e.target.value)}
                placeholder="Ej. El Ojo de Agamotto, Darkhold, Incursión"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Premisa Adicional u Holo-Escenario (Opcional)
              </label>
              <input
                type="text"
                value={scenario}
                onChange={e => setScenario(e.target.value)}
                placeholder="Ej. ¿Qué ocurriría si intentan reescribir la caída de Sokovia?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fase MCU Target</label>
              <select
                value={phase}
                onChange={e => setPhase(e.target.value as MCUPhase)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="Fase 4">Fase 4</option>
                <option value="Fase 5">Fase 5</option>
                <option value="Fase 6">Fase 6</option>
                <option value="Multiverse Saga">Multiverse Saga</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!character.trim() && !artifact.trim())}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 text-white font-bold text-sm shadow-xl shadow-red-950/50 hover:brightness-110 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
                <span>Calculando Variación de la Línea Temporal...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generar Teoría con IA (+25 Pts)</span>
              </>
            )}
          </button>
        </form>

      </div>

      {/* Generated Theory Card Preview */}
      {generatedTheory && (
        <div className="tva-card rounded-2xl p-6 sm:p-8 space-y-6 border-amber-500/50 animate-fadeIn relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-gradient-to-l from-red-600 to-amber-600 text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-white" /> TEORÍA GENERADA POR GEMINI
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              {generatedTheory.phase} • {generatedTheory.category}
            </span>
            <h2 className="font-cinzel text-2xl font-bold text-amber-100">
              {generatedTheory.title}
            </h2>
            <p className="text-sm font-medium text-amber-300/90 italic bg-amber-950/30 p-3 rounded-xl border border-amber-500/20">
              "{generatedTheory.premise}"
            </p>
          </div>

          {/* Metrics bar */}
          <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Riesgo Nexus:</span>
              <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-500/40">
                {generatedTheory.nexusRisk}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Probabilidad:</span>
              <span className="text-amber-400 font-bold">{generatedTheory.nexusProbability}%</span>
            </div>
          </div>

          {/* Full content */}
          <div className="text-sm text-slate-300 space-y-3 leading-relaxed whitespace-pre-line border-t border-slate-800 pt-4">
            {generatedTheory.fullContent}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {generatedTheory.tags.map((tag, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-300/80">
                #{tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {published ? '✅ ¡Teoría publicada en el Feed principal!' : 'Publica esta teoría para que la comunidad vote y comente.'}
            </p>
            <button
              onClick={handlePublish}
              disabled={published}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                published
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 cursor-default'
                  : 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:brightness-110 shadow-lg'
              }`}
            >
              {published ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Publicada (+25 Pts Ganados)</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Publicar en el Feed de Teorías</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
