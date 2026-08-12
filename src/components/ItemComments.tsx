import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Send, Heart, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export interface CommentItem {
  id: string;
  itemTitle: string;
  authorName: string;
  authorHandle: string;
  rating: number;
  comment: string;
  likes: number;
  createdAt: string;
}

const DEFAULT_COMMENTS: Record<string, CommentItem[]> = {
  'Avengers: Endgame': [
    {
      id: 'c-endgame-1',
      itemTitle: 'Avengers: Endgame',
      authorName: 'Capitán_Lore',
      authorHandle: '@cap_lore',
      rating: 5,
      comment: '¡Escena épica indiscutible! Cuando Cap levanta el Mjolnir y dice "Avengers... Assemble", el cine entero tembló.',
      likes: 42,
      createdAt: 'Hace 2 horas'
    },
    {
      id: 'c-endgame-2',
      itemTitle: 'Avengers: Endgame',
      authorName: 'Tony_Fan_3000',
      authorHandle: '@stark_tech',
      rating: 5,
      comment: 'El mejor cierre de era para Tony Stark. Te queremos 3000.',
      likes: 28,
      createdAt: 'Ayer'
    }
  ],
  'Loki': [
    {
      id: 'c-loki-1',
      itemTitle: 'Loki',
      authorName: 'Sylvie_Multiversal',
      authorHandle: '@sylvie_tva',
      rating: 5,
      comment: 'El final de la temporada 2 con el Árbol del Tiempo del Multiverso es sin duda de lo mejor que ha producido Marvel.',
      likes: 35,
      createdAt: 'Hace 5 horas'
    }
  ],
  'Spider-Man: No Way Home': [
    {
      id: 'c-spidey-1',
      itemTitle: 'Spider-Man: No Way Home',
      authorName: 'Peter_Parker_616',
      authorHandle: '@spidey_fan',
      rating: 5,
      comment: 'Ver a Tobey, Andrew y Tom juntos luchando en la Estatua de la Libertad fue un sueño hecho realidad.',
      likes: 51,
      createdAt: 'Ayer'
    }
  ]
};

interface ItemCommentsProps {
  itemTitle: string;
  itemType: 'movie' | 'series';
}

export const ItemComments: React.FC<ItemCommentsProps> = ({ itemTitle, itemType }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const storageKey = `mcu_comments_${itemTitle.replace(/\s+/g, '_')}`;

  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load comments from localStorage', e);
    }
    return DEFAULT_COMMENTS[itemTitle] || [];
  });

  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(comments));
    } catch (e) {
      console.warn('Could not save comments to localStorage', e);
    }
  }, [comments, storageKey]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      itemTitle,
      authorName: user?.username || 'Agente Multiversal',
      authorHandle: user?.agentHandle || '@agente_tva',
      rating,
      comment: commentText.trim(),
      likes: 1,
      createdAt: 'Justo ahora'
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleToggleLike = (id: string) => {
    const isLiked = likedMap[id];
    setLikedMap(prev => ({ ...prev, [id]: !isLiked }));
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, likes: c.likes + (isLiked ? -1 : 1) } : c))
    );
  };

  return (
    <div className="pt-6 border-t border-[#2d0a0a] space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-cinzel text-base font-bold">
          <MessageSquare className="w-4 h-4 text-red-500" />
          <span>{t('comments.title')} ({comments.length})</span>
        </div>
        <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MCU Fans</span>
        </div>
      </div>

      {/* Post comment form */}
      <form onSubmit={handlePostComment} className="bg-[#080203] p-3.5 sm:p-4 rounded-2xl border border-[#2d0a0a] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-slate-300 font-bold flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>{itemType === 'movie' ? t('comments.what_did_you_think_movie') : t('comments.what_did_you_think_series')}</span>
          </span>

          {/* Star selector */}
          <div className="flex items-center gap-1 bg-[#120507] px-2.5 py-1 rounded-xl border border-[#2d0a0a]">
            <span className="text-[10px] font-mono text-slate-400 mr-1">{t('comments.rating')}</span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-0.5 transition-transform ${star <= rating ? 'text-amber-400 scale-110' : 'text-slate-600'}`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder={t('comments.placeholder_movie')}
          rows={2}
          className="w-full bg-[#120507] border border-[#2d0a0a] rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-600 resize-none font-sans"
        />

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            Author: <strong className="text-amber-400">{user?.username || 'Agente'}</strong>
          </span>
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 active:scale-95 text-white font-mono text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('btn.comment')}</span>
          </button>
        </div>
      </form>

      {/* List of comments */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="p-4 text-center bg-[#080203] rounded-xl border border-[#2d0a0a] text-slate-400 text-xs font-mono">
            Aún no hay comentarios para {itemTitle}. ¡Sé el primero en opinar!
          </div>
        ) : (
          comments.map(c => (
            <div
              key={c.id}
              className="p-3 rounded-xl bg-[#080203] border border-[#230809] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-[10px] font-bold text-amber-300 font-mono">
                    {c.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200">{c.authorName}</span>
                    <span className="text-[10px] text-slate-500 font-mono ml-1.5">{c.authorHandle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{c.rating}/5</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans pl-1">
                {c.comment}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#1a0708]">
                <span>{c.createdAt}</span>
                <button
                  onClick={() => handleToggleLike(c.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full border transition-all ${
                    likedMap[c.id]
                      ? 'bg-red-950 border-red-600 text-red-400'
                      : 'bg-[#120608] border-[#2d0a0a] text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${likedMap[c.id] ? 'fill-current text-red-500' : ''}`} />
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
