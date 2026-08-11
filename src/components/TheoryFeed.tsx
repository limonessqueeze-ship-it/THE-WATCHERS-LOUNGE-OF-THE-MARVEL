import React, { useState } from 'react';
import { Search, Sparkles, Filter, ThumbsUp, MessageSquare, Bookmark, Shield, AlertTriangle, Zap, PlusCircle } from 'lucide-react';
import { Theory, MCUPhase, TheoryCategory } from '../types';
import { useAuth } from '../context/AuthContext';

interface TheoryFeedProps {
  theories: Theory[];
  onSelectTheory: (theory: Theory) => void;
  onVote: (theoryId: string, type: 'up' | 'down') => void;
  onOpenGenerator: () => void;
}

export const TheoryFeed: React.FC<TheoryFeedProps> = ({
  theories,
  onSelectTheory,
  onVote,
  onOpenGenerator
}) => {
  const { user, toggleBookmark } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'probability'>('popular');

  const phasesList: string[] = ['Todas', 'Fase 1', 'Fase 2', 'Fase 3', 'Fase 4', 'Fase 5', 'Fase 6', 'Multiverse Saga'];
  const categoriesList: string[] = ['Todas', 'Películas', 'Series Disney+', 'Cómics', 'Especulación Salvaje', 'Canon Confirmado'];

  const filteredTheories = theories.filter(theory => {
    const matchesSearch =
      theory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theory.premise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theory.authorHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theory.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPhase = selectedPhase === 'Todas' || theory.phase === selectedPhase;
    const matchesCategory = selectedCategory === 'Todas' || theory.category === selectedCategory;

    return matchesSearch && matchesPhase && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.nexusPoints - a.nexusPoints;
    if (sortBy === 'probability') return b.nexusProbability - a.nexusProbability;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Hero Banner Header */}
      <div className="tva-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest shadow-inner">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> MONITOR DE BIFURCACIONES TEMPORALES
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-black italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-400 leading-none">
            NEXUS THEORIES
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-amber-400/90 font-mono font-semibold">
            MCU MULTIVERSE • TVA TIMELINE MONITORING
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Explora las teorías más impactantes de la comunidad, vota tus hipótesis favoritas sobre la Fase 5 y Fase 6, y genera nuevas predicciones alimentadas por la Inteligencia Artificial del Multiverso.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenGenerator}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/25"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Forjar Teoría con IA (+25 Pts)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Control */}
      <div className="tva-card rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por personaje, etiqueta, título o agente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-mono w-full md:w-auto overflow-x-auto">
            <span className="text-slate-500 px-2 uppercase text-[10px] hidden sm:inline">Ordenar:</span>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                sortBy === 'popular' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔥 Eventos Nexus Populares
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                sortBy === 'recent' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⏳ Más Recientes
            </button>
            <button
              onClick={() => setSortBy('probability')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                sortBy === 'probability' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Mayor Probabilidad
            </button>
          </div>
        </div>

        {/* Phase Filter Row */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-mono text-amber-400/90 font-bold uppercase tracking-wider whitespace-nowrap mr-1">
              Fase MCU:
            </span>
            {phasesList.map(phase => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedPhase === phase
                    ? 'bg-amber-950 border border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-mono text-amber-400/90 font-bold uppercase tracking-wider whitespace-nowrap mr-1">
              Categoría:
            </span>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-red-950 border border-red-500 text-red-300 font-bold'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Theories Cards Grid */}
      {filteredTheories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTheories.map((theory) => {
            const isBookmarked = user?.bookmarks.includes(theory.id);
            return (
              <div
                key={theory.id}
                className="tva-card tva-card-hover rounded-2xl p-6 flex flex-col justify-between space-y-4 cursor-pointer group relative"
              >
                {/* Card Top Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={theory.authorAvatar}
                        alt={theory.authorName}
                        className="w-7 h-7 rounded-full border border-amber-500/40 object-cover"
                      />
                      <span className="text-xs font-semibold text-amber-200">{theory.authorHandle}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(theory.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isBookmarked
                          ? 'border-amber-400 bg-amber-950 text-amber-300'
                          : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Title and Premise */}
                  <div onClick={() => onSelectTheory(theory)} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/30 text-amber-300">
                        {theory.phase}
                      </span>
                      {theory.isAiGenerated && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950/80 border border-purple-500/30 text-purple-300 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 fill-purple-300" /> IA
                        </span>
                      )}
                    </div>

                    <h3 className="font-cinzel text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                      {theory.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {theory.premise}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Metadata & Voting Bar */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  
                  {/* Probability and Risk Badges */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1 text-red-400 font-bold text-[11px]">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{theory.nexusRisk}</span>
                    </div>
                    <div className="text-amber-400 font-bold">
                      {theory.nexusProbability}% Prob.
                    </div>
                  </div>

                  {/* Upvote & Comment counts */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVote(theory.id, 'up');
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono font-bold transition-all ${
                          theory.userVoted === 'up'
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{theory.nexusPoints}</span>
                      </button>
                    </div>

                    <div 
                      onClick={() => onSelectTheory(theory)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-amber-300 font-mono text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{theory.commentsCount || theory.comments?.length || 0}</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="tva-card rounded-2xl p-12 text-center space-y-4">
          <Shield className="w-12 h-12 text-amber-500/50 mx-auto" />
          <h3 className="font-cinzel text-xl font-bold text-amber-200">
            No se encontraron fluctuaciones temporales
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Prueba ajustando los filtros de Fase o Categoría, o sé el primer agente en forjar una teoría con la IA.
          </p>
        </div>
      )}

    </div>
  );
};
