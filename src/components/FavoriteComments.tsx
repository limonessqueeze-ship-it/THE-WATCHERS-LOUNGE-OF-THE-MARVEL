import React, { useState } from 'react';
import { MessageSquare, Star, Send, Heart, Flame, Sparkles, User, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface FavoriteComment {
  id: string;
  authorName: string;
  authorHandle: string;
  itemTitle: string; // Movie or Series title
  type: 'movie' | 'series';
  rating: number; // 1 to 5
  comment: string;
  likes: number;
  createdAt: string;
}

const INITIAL_COMMENTS: FavoriteComment[] = [
  {
    id: 'fc-1',
    authorName: 'Capitán_Lore',
    authorHandle: '@cap_lore',
    itemTitle: 'Avengers: Endgame',
    type: 'movie',
    rating: 5,
    comment: '¡Mi película favorita indiscutible de todo el UCM! La escena de "Avengers... Assemble" y el sacrificio de Tony Stark me eriza la piel cada vez que la veo.',
    likes: 24,
    createdAt: 'Hace 2 horas'
  },
  {
    id: 'fc-2',
    authorName: 'Sylvie_Multiversal',
    authorHandle: '@sylvie_tva',
    itemTitle: 'Loki',
    type: 'series',
    rating: 5,
    comment: 'Loki es la mejor serie del UCM por lejos. El final de la temporada 2 con el árbol del tiempo sosteniendo el Multiverso es arte puro.',
    likes: 19,
    createdAt: 'Hace 5 horas'
  },
  {
    id: 'fc-3',
    authorName: 'Peter_Parker_616',
    authorHandle: '@spidey_fan',
    itemTitle: 'Spider-Man: No Way Home',
    type: 'movie',
    rating: 5,
    comment: 'Reunir a Tobey, Andrew y Tom en una sola película fue el momento más épico de mi vida en el cine.',
    likes: 31,
    createdAt: 'Ayer'
  }
];

interface FavoriteCommentsProps {
  catalogType: 'movie' | 'series';
  itemList: string[]; // List of titles for dropdown
  preselectedTitle?: string;
}

export const FavoriteComments: React.FC<FavoriteCommentsProps> = ({
  catalogType,
  itemList,
  preselectedTitle
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<FavoriteComment[]>(INITIAL_COMMENTS);
  const [selectedTitle, setSelectedTitle] = useState<string>(preselectedTitle || itemList[0] || '');
  const [rating, setRating] = useState<number>(5);
  const [commentText, setCommentText] = useState<string>('');
  const [filterTitle, setFilterTitle] = useState<string>('Todas');
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: FavoriteComment = {
      id: 'fc-' + Date.now(),
      authorName: user?.username || 'Agente de la TVA',
      authorHandle: user?.agentHandle || '@agente_multiverse',
      itemTitle: selectedTitle || (catalogType === 'movie' ? 'Iron Man' : 'Loki'),
      type: catalogType,
      rating,
      comment: commentText.trim(),
      likes: 1,
      createdAt: 'Justo ahora'
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleToggleLike = (id: string) => {
    const isLiked = likedComments[id];
    setLikedComments(prev => ({ ...prev, [id]: !isLiked }));
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, likes: c.likes + (isLiked ? -1 : 1) } : c))
    );
  };

  const filteredComments = comments.filter(c => {
    if (filterTitle === 'Todas') return true;
    return c.itemTitle === filterTitle;
  });

  return (
    <div className="tva-card rounded-3xl p-6 sm:p-8 space-y-6 border border-[#DC2626]/40 bg-[#0c0506]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d0a0a] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-mono font-bold mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-red-400" />
            <span>Comunidad Multiversal</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Comentarios sobre tus {catalogType === 'movie' ? 'Películas' : 'Series'} Favoritas</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Comparte tu opinión, momentos favoritos y valoración con otros agentes del Multiverso.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <select
            value={filterTitle}
            onChange={e => setFilterTitle(e.target.value)}
            className="bg-[#18080a] border border-[#2d0a0a] text-xs font-mono text-amber-300 font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-red-600"
          >
            <option value="Todas">Ver Todas ({comments.length})</option>
            {itemList.map(title => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Post Comment Form */}
      <form onSubmit={handlePostComment} className="bg-[#140708] p-4 sm:p-5 rounded-2xl border border-[#2d0b0d] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Select Title */}
          <div className="flex-1 space-y-1">
            <label className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              Selecciona tu {catalogType === 'movie' ? 'Película' : 'Serie'} Favorita:
            </label>
            <select
              value={selectedTitle}
              onChange={e => setSelectedTitle(e.target.value)}
              className="w-full bg-[#080203] border border-[#2d0a0a] text-xs font-mono text-white font-bold px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-red-600"
            >
              {itemList.map(title => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {/* Star Rating */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              Tu Calificación:
            </label>
            <div className="flex items-center gap-1.5 bg-[#080203] p-2 rounded-xl border border-[#2d0a0a]">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-transform ${star <= rating ? 'text-amber-400 scale-110' : 'text-slate-600'}`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <textarea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder={`¿Por qué es tu ${catalogType === 'movie' ? 'película' : 'serie'} favorita? Cuéntanos tu escena o personaje preferido...`}
            rows={3}
            className="w-full bg-[#080203] border border-[#2d0a0a] rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-600 resize-none font-mono"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>Comentando como <strong className="text-amber-300">{user?.username || 'Agente'}</strong></span>
          </div>

          <button
            type="submit"
            disabled={!commentText.trim()}
            className="px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar Comentario</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3.5">
        {filteredComments.length === 0 ? (
          <div className="p-8 text-center bg-[#080203] rounded-2xl border border-[#2d0a0a] text-slate-400 text-xs font-mono">
            Aún no hay comentarios sobre esta opción. ¡Sé el primero en compartir por qué es tu favorita!
          </div>
        ) : (
          filteredComments.map(c => (
            <div key={c.id} className="p-4 rounded-2xl bg-[#090304] border border-[#230809] hover:border-red-900/50 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-950 border border-red-700/60 flex items-center justify-center font-bold text-amber-300 font-mono text-xs">
                    {c.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{c.authorName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.authorHandle}</span>
                    </div>
                    <span className="text-[10px] text-[#D4AF37] font-mono font-bold block">
                      ❤️ Favorita: {c.itemTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-500/30">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{c.rating}/5</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans pl-1">
                "{c.comment}"
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#1a0708]">
                <span>{c.createdAt}</span>
                <button
                  onClick={() => handleToggleLike(c.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
                    likedComments[c.id]
                      ? 'bg-red-950 border-red-600 text-red-400'
                      : 'bg-[#120608] border-[#2d0a0a] text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${likedComments[c.id] ? 'fill-current text-red-500' : ''}`} />
                  <span>{c.likes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
