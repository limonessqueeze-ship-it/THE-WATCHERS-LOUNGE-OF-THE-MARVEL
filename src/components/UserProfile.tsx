import React, { useState } from 'react';
import { Shield, Zap, Award, Edit3, Bookmark, Star, Check, UserCheck, Sparkles, AlertTriangle, Upload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Theory, MCUPhase, FanRank } from '../types';

interface UserProfileProps {
  theories: Theory[];
  onSelectTheory: (theory: Theory) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ theories, onSelectTheory }) => {
  const { user, updateProfile, calculateRank } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [agentHandle, setAgentHandle] = useState(user?.agentHandle || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [favoriteCharacter, setFavoriteCharacter] = useState(user?.favoriteCharacter || 'Loki');
  const [favoritePhase, setFavoritePhase] = useState<MCUPhase>(user?.favoritePhase || 'Fase 4');

  if (!user) return null;

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe pesar más de 5 MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarsList = [
    { name: 'Variante de Loki', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' },
    { name: 'Uatu El Observador', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
    { name: 'Scarlet Witch', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop' },
    { name: 'Doctor Strange', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop' },
    { name: 'Spider-Gwen', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { name: 'Miss Minutes', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop' }
  ];


  const bookmarkedTheories = theories.filter(t => user.bookmarks.includes(t.id));

  // Rank thresholds
  const rankMilestones: { rank: FanRank; minPts: number }[] = [
    { rank: 'Variante de Loki', minPts: 0 },
    { rank: 'Fan del Multiverso', minPts: 101 },
    { rank: 'Hechicero Supremo', minPts: 301 },
    { rank: 'Vengador Élite', minPts: 601 },
    { rank: 'El Observador', minPts: 1000 }
  ];

  const currentRankInfo = rankMilestones.find(r => r.rank === user.rank) || rankMilestones[0];
  const nextRankInfo = rankMilestones.find(r => r.minPts > user.nexusPoints) || { rank: 'El Observador', minPts: 1000 };
  
  const progressPercent = Math.min(
    100,
    Math.round((user.nexusPoints / nextRankInfo.minPts) * 100)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      username,
      agentHandle,
      avatarUrl,
      favoriteCharacter,
      favoritePhase
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="tva-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-amber-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-red-600/20 via-amber-500/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar with Glow Badge */}
          <div className="relative group">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-24 h-24 rounded-2xl border-2 border-amber-400 object-cover shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-red-600 border border-amber-300 text-white font-mono font-bold text-[10px] uppercase shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3 fill-amber-300 text-amber-300" /> TVA
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-200">
                  {user.username}
                </h1>
                <span className="text-xs font-mono text-amber-400 font-semibold block">
                  {user.agentHandle}
                </span>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEditing ? 'Cancelar Edición' : 'Editar Credenciales'}</span>
              </button>
            </div>

            {/* Rank Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-red-950 via-amber-950 to-slate-900 border border-amber-500/50 text-xs font-bold text-amber-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Rango: {user.rank}</span>
            </div>

            {/* Progress Bar towards Next Rank */}
            <div className="pt-2 max-w-md space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Puntos Nexus: <strong className="text-amber-400">{user.nexusPoints} Pts</strong></span>
                <span>Próximo Rango: <strong className="text-amber-300">{nextRankInfo.rank}</strong> ({nextRankInfo.minPts} Pts)</span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="bg-gradient-to-r from-red-600 via-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Editing Form Drawer */}
      {isEditing && (
        <div className="tva-card rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeIn border-amber-500">
          <h3 className="font-cinzel text-xl font-bold text-amber-200 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" /> Personalizar Perfil de Agente
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de Agente</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Agente Handle</label>
                <input
                  type="text"
                  required
                  value={agentHandle}
                  onChange={e => setAgentHandle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Avatar Selector Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">Selecciona o Sube tu Foto de Perfil</label>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950 border border-red-600/60 hover:bg-red-900 text-amber-300 text-xs font-bold transition-all">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Subir de Galería</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {avatarsList.map((av, idx) => (
                  <div
                    key={idx}
                    onClick={() => setAvatarUrl(av.url)}
                    className={`p-2 rounded-xl border cursor-pointer transition-all text-center space-y-1.5 ${
                      avatarUrl === av.url ? 'border-amber-400 bg-amber-950/80 scale-105' : 'border-slate-800 bg-slate-900 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={av.url} alt={av.name} className="w-12 h-12 rounded-full mx-auto object-cover" />
                    <span className="text-[10px] font-mono text-slate-300 block truncate">{av.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Personaje Favorito</label>
                <input
                  type="text"
                  value={favoriteCharacter}
                  onChange={e => setFavoriteCharacter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fase MCU Favorita</label>
                <select
                  value={favoritePhase}
                  onChange={e => setFavoritePhase(e.target.value as MCUPhase)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Fase 1">Fase 1</option>
                  <option value="Fase 2">Fase 2</option>
                  <option value="Fase 3">Fase 3</option>
                  <option value="Fase 4">Fase 4</option>
                  <option value="Fase 5">Fase 5</option>
                  <option value="Fase 6">Fase 6</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bookmarked Theories List */}
      <div className="space-y-4">
        <h3 className="font-cinzel text-xl font-bold text-amber-200 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400" /> Teorías Guardadas en Favoritos ({bookmarkedTheories.length})
        </h3>

        {bookmarkedTheories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedTheories.map(t => (
              <div
                key={t.id}
                onClick={() => onSelectTheory(t)}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-2"
              >
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{t.phase}</span>
                <h4 className="font-cinzel text-base font-bold text-slate-100">{t.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{t.premise}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-8 bg-slate-900/40 rounded-2xl border border-slate-800">
            Aún no has guardado teorías en marcadores. Haz clic en el icono de marcador en cualquier teoría para guardarla aquí.
          </p>
        )}
      </div>

    </div>
  );
};
