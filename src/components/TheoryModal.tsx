import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, MessageSquare, Bookmark, Shield, AlertTriangle, Eye, Send, Lock, User } from 'lucide-react';
import { Theory, Comment } from '../types';
import { useAuth } from '../context/AuthContext';

interface TheoryModalProps {
  theory: Theory | null;
  onClose: () => void;
  onVote: (theoryId: string, type: 'up' | 'down') => void;
  onAddComment: (theoryId: string, commentText: string, isSpoiler: boolean) => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  theory,
  onClose,
  onVote,
  onAddComment
}) => {
  const { user, toggleBookmark } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});

  if (!theory) return null;

  const isBookmarked = user?.bookmarks.includes(theory.id);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(theory.id, commentText, isSpoiler);
    setCommentText('');
    setIsSpoiler(false);
  };

  const toggleSpoilerReveal = (commentId: string) => {
    setRevealedSpoilers(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#120808] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Close & Bookmark Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
            <Shield className="w-4 h-4 text-red-500" />
            <span>ID TEORÍA: #{theory.id}</span>
            <span className="text-slate-600">•</span>
            <span>{theory.phase}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(theory.id)}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? 'border-amber-400 bg-amber-950/80 text-amber-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title={isBookmarked ? 'Guardada en Favoritos' : 'Guardar Teoría'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-red-950/90 border border-red-600 text-red-200 hover:text-white hover:bg-red-800 transition-colors flex items-center gap-1.5 text-xs font-mono font-bold shadow-md"
              title="Cerrar Teoría"
            >
              <X className="w-4 h-4 text-red-400" />
              <span>Cerrar</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
          
          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={theory.authorAvatar}
                alt={theory.authorName}
                className="w-10 h-10 rounded-full border border-amber-500/50 object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-amber-200">{theory.authorName}</h4>
                <p className="text-xs text-slate-400 font-mono">{theory.authorHandle}</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {new Date(theory.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Title and Premise */}
          <div className="space-y-3">
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100">
              {theory.title}
            </h1>
            <p className="text-sm font-medium text-amber-300/90 italic bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/20">
              "{theory.premise}"
            </p>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Riesgo Nexus</span>
              <span className="font-bold text-red-400 flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" /> {theory.nexusRisk}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Probabilidad Canon</span>
              <span className="font-bold text-amber-400 mt-0.5 block">{theory.nexusProbability}%</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px]">Categoría</span>
              <span className="font-bold text-slate-200 mt-0.5 block">{theory.category}</span>
            </div>
          </div>

          {/* Main Full Text */}
          <div className="text-sm text-slate-200 leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-800/80 pt-4">
            {theory.fullContent}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {theory.tags.map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-400/80">
                #{tag}
              </span>
            ))}
          </div>

          {/* Upvote / Downvote Section */}
          <div className="flex items-center gap-4 py-4 border-t border-b border-slate-800">
            <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Puntos Nexus ({theory.nexusPoints}):
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onVote(theory.id, 'up')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  theory.userVoted === 'up'
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/50'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Apoyar Teoría (+1)</span>
              </button>

              <button
                onClick={() => onVote(theory.id, 'down')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  theory.userVoted === 'down'
                    ? 'bg-red-950 border border-red-500 text-red-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-red-500/50'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Podar / Refutar (-1)</span>
              </button>
            </div>
          </div>

          {/* Nested Comments Section */}
          <div className="space-y-4 pt-2">
            <h3 className="font-cinzel text-lg font-bold text-amber-200 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              Comentarios de Agentes ({theory.comments?.length || 0})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Escribe tu opinión o teoría complementaria..."
                rows={2}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSpoiler}
                    onChange={e => setIsSpoiler(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Marcar como Spoiler de la Saga MCU</span>
                </label>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Comentar</span>
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-3">
              {theory.comments && theory.comments.length > 0 ? (
                theory.comments.map((comment) => {
                  const isRevealed = revealedSpoilers[comment.id];
                  return (
                    <div key={comment.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-6 h-6 rounded-full border border-amber-500/40 object-cover"
                          />
                          <span className="text-xs font-bold text-amber-200">{comment.authorName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{comment.authorHandle}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Spoiler Masking */}
                      {comment.isSpoiler && !isRevealed ? (
                        <div
                          onClick={() => toggleSpoilerReveal(comment.id)}
                          className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold text-center cursor-pointer hover:bg-red-950/90 transition-colors flex items-center justify-center gap-2 select-none"
                        >
                          <Lock className="w-4 h-4 text-red-400" />
                          <span>ALERTA DE SPOILER • Haz clic para revelar este comentario</span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-300 leading-relaxed pl-1">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">
                  Aún no hay comentarios en esta variante temporal. ¡Sé el primero en aportar!
                </p>
              )}
            </div>

            {/* Bottom Close Button */}
            <div className="pt-4 border-t border-slate-800/80 flex justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <X className="w-4 h-4 text-red-400" />
                <span>✕ Cerrar Teoría</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
