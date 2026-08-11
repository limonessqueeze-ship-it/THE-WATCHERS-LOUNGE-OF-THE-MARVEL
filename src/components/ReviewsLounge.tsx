import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Shield, AlertTriangle, Send, Film, Sparkles, Zap } from 'lucide-react';
import { MCURelease, Review } from '../types';
import { useAuth } from '../context/AuthContext';

interface ReviewsLoungeProps {
  releases: MCURelease[];
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export const ReviewsLounge: React.FC<ReviewsLoungeProps> = ({
  releases,
  reviews,
  onAddReview
}) => {
  const { user, updateNexusPoints } = useAuth();
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>(releases[0]?.id || '');
  
  // Review Form state
  const [rating, setRating] = useState<number>(5);
  const [hypeScore, setHypeScore] = useState<number>(95);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedRelease = releases.find(r => r.id === selectedReleaseId) || releases[0];
  const releaseReviews = reviews.filter(r => r.releaseId === selectedReleaseId);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      releaseId: selectedRelease.id,
      releaseTitle: selectedRelease.title,
      userId: user?.id || 'guest',
      username: user?.username || 'Agente TVA',
      agentHandle: user?.agentHandle || '@agente_tva',
      userAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      rating,
      hypeScore,
      title,
      content,
      containsSpoilers,
      createdAt: new Date().toISOString()
    };

    onAddReview(newReview);
    updateNexusPoints(15); // Reward +15 Nexus points
    setTitle('');
    setContent('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> CRÍTICA Y EVALUACIÓN DEL MULTIVERSO
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-red-500">
          CENTRO DE RESEÑAS MCU
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Califica cada título del MCU, analiza el impacto de las escenas post-créditos y comparte tu veredicto con la comunidad de agentes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Film Selector Sidebar */}
        <div className="space-y-4">
          <h3 className="font-cinzel text-lg font-bold text-amber-200 flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" /> Selecciona Película o Serie
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {releases.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedReleaseId(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  selectedReleaseId === item.id
                    ? 'bg-amber-950/80 border-amber-400 shadow-xl'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="overflow-hidden leading-tight">
                  <span className="text-[10px] font-mono text-amber-400 font-bold block">
                    {item.phase} • {item.releaseYear}
                  </span>
                  <h4 className="text-sm font-bold text-slate-100 truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-amber-400 mt-1 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.userRating} / 5</span>
                    <span className="text-slate-500 font-normal">({item.totalRatings})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Release Review Lounge & Submission */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Selected Film Header & Metrics Card */}
          <div className="tva-card rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  {selectedRelease.phase} • {selectedRelease.type === 'movie' ? 'Película' : 'Serie'}
                </span>
                <h2 className="font-cinzel text-2xl font-bold text-slate-100">
                  {selectedRelease.title}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dir: {selectedRelease.directorOrCreator} • Año Universo: {selectedRelease.universeYear}
                </p>
              </div>

              {/* Score Badges */}
              <div className="flex items-center gap-3">
                <div className="text-center bg-slate-900 p-2.5 rounded-xl border border-amber-500/30">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Hype Score</span>
                  <span className="text-lg font-bold text-amber-400">{selectedRelease.hypeScore}%</span>
                </div>
                <div className="text-center bg-slate-900 p-2.5 rounded-xl border border-red-500/30">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Comunidad</span>
                  <span className="text-lg font-bold text-red-400">{selectedRelease.userRating} ★</span>
                </div>
              </div>
            </div>

            {/* Post Credits Feature */}
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 space-y-1 text-xs">
              <span className="font-bold text-red-400 uppercase font-mono block">
                ⚡ Análisis de Escena Post-Créditos ({selectedRelease.postCreditsImportance}):
              </span>
              <p className="text-slate-300 italic">
                "{selectedRelease.postCreditsScene}"
              </p>
            </div>
          </div>

          {/* Submit New Review Form */}
          <div className="tva-card rounded-2xl p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-amber-200 flex items-center justify-between">
              <span>Escribir Crítica de Agente</span>
              <span className="text-xs font-mono text-amber-400 font-normal">+15 Pts Nexus</span>
            </h3>

            {submitted && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold">
                ✅ ¡Crítica publicada exitosamente! (+15 Puntos Nexus acreditados)
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Puntuación (1 a 5 Estrellas)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1.5 rounded-lg transition-all ${
                          rating >= star ? 'text-amber-400 scale-110' : 'text-slate-600'
                        }`}
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-400' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Título de tu Reseña</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ej. Una obra maestra del multiverso..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Opinión Detallada</label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Detalla lo que te pareció la dirección, personajes y relevancia futura..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={containsSpoilers}
                    onChange={e => setContainsSpoilers(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-amber-500"
                  />
                  <span>Contiene Spoilers</span>
                </label>

                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold text-xs shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publicar Reseña (+15 Pts)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-slate-200">
              Reseñas de la Comunidad ({releaseReviews.length})
            </h3>

            {releaseReviews.length > 0 ? (
              releaseReviews.map(rev => (
                <div key={rev.id} className="tva-card rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar}
                        alt={rev.username}
                        className="w-9 h-9 rounded-full border border-amber-500/40 object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-amber-200">{rev.username}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">{rev.agentHandle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-cinzel text-base font-bold text-slate-100">
                    "{rev.title}"
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rev.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6 bg-slate-900/50 rounded-xl border border-slate-800">
                Aún no hay críticas escritas para este título. ¡Sé el primero!
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
