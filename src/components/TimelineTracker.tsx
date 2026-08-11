import React, { useState } from 'react';
import { Clock, Calendar, Star, Film, Tv, Shield, AlertTriangle, ChevronRight, Play, Eye } from 'lucide-react';
import { MCURelease, MCUPhase } from '../types';

interface TimelineTrackerProps {
  releases: MCURelease[];
}

export const TimelineTracker: React.FC<TimelineTrackerProps> = ({ releases }) => {
  const [viewOrder, setViewOrder] = useState<'chronological' | 'release'>('chronological');
  const [selectedPhase, setSelectedPhase] = useState<string>('Todas');
  const [expandedId, setExpandedId] = useState<string | null>(releases[0]?.id || null);

  const sortedReleases = [...releases]
    .filter(r => selectedPhase === 'Todas' || r.phase === selectedPhase)
    .sort((a, b) => {
      if (viewOrder === 'chronological') {
        return a.chronologicalOrder - b.chronologicalOrder;
      }
      return a.releaseOrder - b.releaseOrder;
    });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header Banner */}
      <div className="tva-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-bl from-amber-500/10 via-red-600/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> MAPA DE LA SAGRADA LÍNEA DEL TIEMPO
          </div>

          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-amber-100">
            CRONOLOGÍA OFICIAL DEL MCU & MULTIVERSO
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl">
            Explora la secuencia temporal de las películas y series de Disney+. Alterna entre el orden de estreno en cines o el orden cronológico dentro del universo.
          </p>

          {/* Controls Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800">
            
            {/* View Order Toggle */}
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 px-2 uppercase text-[10px]">Modo de Vista:</span>
              <button
                onClick={() => setViewOrder('chronological')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  viewOrder === 'chronological'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⏳ Orden Cronológico Universo
              </button>
              <button
                onClick={() => setViewOrder('release')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  viewOrder === 'release'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎬 Orden de Estreno Cines
              </button>
            </div>

            {/* Phase Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['Todas', 'Fase 1', 'Fase 3', 'Fase 4', 'Fase 5', 'Fase 6'].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPhase(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    selectedPhase === p
                      ? 'bg-red-950 border border-red-500 text-red-300 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Timeline Nodes Chain */}
      <div className="relative pl-6 sm:pl-10 border-l-2 border-amber-500/30 space-y-8 my-8">
        
        {sortedReleases.map((item, index) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="relative group">
              
              {/* Timeline Golden Node Indicator */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#120808] border-2 border-amber-400 flex items-center justify-center text-amber-400 font-mono text-[10px] sm:text-xs font-bold shadow-lg shadow-amber-950/80 group-hover:scale-110 transition-transform">
                {index + 1}
              </div>

              {/* Node Card */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className={`tva-card rounded-2xl p-5 sm:p-6 cursor-pointer transition-all ${
                  isExpanded ? 'border-amber-400/80 bg-slate-900/95 shadow-2xl' : 'hover:border-amber-500/40'
                }`}
              >
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/30 text-amber-300">
                        {item.phase}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 flex items-center gap-1">
                        {item.type === 'movie' ? <Film className="w-3 h-3 text-red-400" /> : <Tv className="w-3 h-3 text-amber-400" />}
                        {item.type === 'movie' ? 'Película' : 'Serie Disney+'}
                      </span>
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        Año Universo: {item.universeYear}
                      </span>
                    </div>

                    <h3 className="font-cinzel text-xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">Hype Score</span>
                      <span className="text-sm font-bold text-amber-400">{item.hypeScore}%</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-amber-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Image Preview */}
                      <div className="relative rounded-xl overflow-hidden h-48 border border-amber-500/30 shadow-lg">
                        <img
                          src={item.posterUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-3">
                          <span className="text-xs font-mono text-amber-200">
                            Estreno: {item.releaseYear} • Dir: {item.directorOrCreator}
                          </span>
                        </div>
                      </div>

                      {/* Details Overview */}
                      <div className="md:col-span-2 space-y-3">
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {item.overview}
                        </p>

                        <div className="space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                            Personajes Clave:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.keyCharacters.map((char, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                                {char}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Post Credits Breakdown */}
                        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono font-bold">
                            <span className="text-red-400 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> ESCENA POST-CRÉDITOS:
                            </span>
                            <span className="text-amber-300">{item.postCreditsImportance}</span>
                          </div>
                          <p className="text-xs text-slate-300 italic">
                            "{item.postCreditsScene}"
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
