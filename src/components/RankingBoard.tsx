import React from 'react';
import { Trophy, User, Zap, Shield, Flame, Coins, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RankingBoardProps {
  onOpenAuth: () => void;
  userBalance: number;
}

export const RankingBoard: React.FC<RankingBoardProps> = ({ onOpenAuth, userBalance }) => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header Banner */}
      <div className="tva-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-red-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c0709] border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Tabla de Clasificación General
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-white">
              Ranking de <span className="text-[#DC2626]">Apuestas Multiversales</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Los mejores estrategas y apostadores reales con mayor cantidad de Monedas Nexus acumuladas.
            </p>
          </div>

          {!user && (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-full bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 active:scale-95 transition-all self-start sm:self-auto flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Registrarme para Ranking</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {user ? (
        <div className="tva-card rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-cinzel text-lg font-bold text-white border-b border-[#2d0a0a] pb-3 flex items-center justify-between">
            <span>Tu Posición en el Multiverso</span>
            <span className="text-amber-400 font-mono text-xs font-bold">#1 En Clasificación Local</span>
          </h2>

          <div className="p-4 rounded-2xl bg-[#080203] border border-[#D4AF37]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#18080a] border border-[#D4AF37] flex items-center justify-center font-black text-amber-400 font-mono">
                1
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{user.username}</h3>
                <span className="text-[10px] font-mono text-red-400 font-bold">{user.rank}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono font-bold text-amber-300 text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{userBalance} MN</span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Card matching Screenshot 1 */
        <div className="tva-card rounded-3xl p-10 text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mx-auto shadow-inner">
            <Trophy className="w-7 h-7" />
          </div>

          <h2 className="font-cinzel text-xl font-bold text-white">
            Aún no hay apostadores en el ranking
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            Se han eliminado los usuarios simulados. Inicia sesión, reclama tu bono diario de Monedas Nexus y realiza tu primera apuesta en la sección de Teorías para aparecer en la cima de la clasificación.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 rounded-full bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 active:scale-95 transition-all mx-auto flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Crear Perfil y Entrar al Ranking</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
