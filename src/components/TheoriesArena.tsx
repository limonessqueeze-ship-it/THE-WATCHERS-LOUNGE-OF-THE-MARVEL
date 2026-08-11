import React, { useState } from 'react';
import { Lightbulb, PlusCircle, Filter, TrendingUp, CheckCircle2, XCircle, Shield, Coins, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface TheoryBetCard {
  id: string;
  category: string;
  title: string;
  evidence: string[];
  totalPoolMN: number;
  yesPercent: number;
  noPercent: number;
  yesMultiplier: number;
  noMultiplier: number;
}

export const INITIAL_BETTING_THEORIES: TheoryBetCard[] = [];

interface TheoriesArenaProps {
  searchQuery: string;
  onOpenGenerator: () => void;
  userBalance: number;
  setUserBalance: React.Dispatch<React.SetStateAction<number>>;
}

export const TheoriesArena: React.FC<TheoriesArenaProps> = ({
  searchQuery,
  onOpenGenerator,
  userBalance,
  setUserBalance
}) => {
  const [selectedBetAmount, setSelectedBetAmount] = useState<number>(50);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [theories, setTheories] = useState<TheoryBetCard[]>(INITIAL_BETTING_THEORIES);
  const [betNotification, setBetNotification] = useState<string | null>(null);

  const categories = ['Todas', 'Spider-Man: Brand New Day', 'Secret Wars', 'Doomsday', 'X-Men', 'Vision Quest'];

  const handlePlaceBet = (theoryId: string, choice: 'yes' | 'no') => {
    if (userBalance < selectedBetAmount) {
      setBetNotification(`⚠️ Saldo insuficiente (${userBalance} MN). Necesitas ${selectedBetAmount} MN.`);
      setTimeout(() => setBetNotification(null), 3000);
      return;
    }

    // Deduct balance & update pool
    setUserBalance(prev => prev - selectedBetAmount);
    setTheories(prev => prev.map(item => {
      if (item.id === theoryId) {
        const newPool = item.totalPoolMN + selectedBetAmount;
        // recalculate slight percent shift
        const yesShift = choice === 'yes' ? 0.8 : -0.8;
        const newYes = Math.min(95, Math.max(5, Number((item.yesPercent + yesShift).toFixed(1))));
        const newNo = Number((100 - newYes).toFixed(1));
        return {
          ...item,
          totalPoolMN: newPool,
          yesPercent: newYes,
          noPercent: newNo,
          yesMultiplier: Number((100 / newYes).toFixed(2)),
          noMultiplier: Number((100 / newNo).toFixed(2))
        };
      }
      return item;
    }));

    setBetNotification(`✅ Apuesta de ${selectedBetAmount} MN registrada en "${choice === 'yes' ? 'SÍ CREO' : 'NO CREO'}". ¡Puntos descontados!`);
    setTimeout(() => setBetNotification(null), 4000);
  };

  const filteredTheories = theories.filter(item => {
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Toast Notification */}
      {betNotification && (
        <div className="fixed top-24 right-6 z-50 bg-[#1a080a] border border-[#DC2626] text-white px-5 py-3 rounded-2xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-bounce">
          <Coins className="w-4 h-4 text-[#D4AF37]" />
          <span>{betNotification}</span>
        </div>
      )}

      {/* Main Banner Header */}
      <div className="tva-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-600/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c0709] border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
            <Coins className="w-3.5 h-3.5 text-amber-400" /> Mercado de Apuestas con Monedas Nexus
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-white">
                Arena de Votación y <span className="text-[#DC2626]">Predicciones de Teorías</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
                Vota SÍ CREO o NO CREO apostando tus Monedas Nexus. ¡A menor porcentaje de la opción, mayor es la ganancia por multiplicador!
              </p>
            </div>

            <button
              onClick={onOpenGenerator}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 active:scale-95 transition-all self-start lg:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Nueva Teoría</span>
            </button>
          </div>

          {/* Bet Amount Selector */}
          <div className="pt-4 border-t border-[#2d0a0a] flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Seleccionar Monto de Apuesta:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {[10, 50, 100, 250, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => setSelectedBetAmount(amount)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    selectedBetAmount === amount
                      ? 'bg-[#D4AF37] text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-[#120708] border border-[#2d0a0a] text-slate-300 hover:text-white'
                  }`}
                >
                  {amount} MN
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#DC2626] text-white shadow-md'
                : 'bg-[#120708] border border-[#2d0a0a] text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Theories Cards Grid */}
      {filteredTheories.length === 0 ? (
        <div className="tva-card rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto border border-[#DC2626]/30">
          <div className="w-14 h-14 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/40 flex items-center justify-center text-[#DC2626] mx-auto shadow-inner">
            <Lightbulb className="w-7 h-7" />
          </div>
          <h2 className="font-cinzel text-xl font-bold text-white">
            No hay teorías registradas
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto font-mono">
            Se han eliminado todas las teorías existentes por solicitud del usuario. ¡Sé el primero en forjar y publicar una nueva teoría con la IA!
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenGenerator}
              className="px-6 py-3 rounded-full bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 active:scale-95 transition-all mx-auto flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Nueva Teoría</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTheories.map((item) => (
          <div key={item.id} className="tva-card rounded-3xl p-6 space-y-5 flex flex-col justify-between">
            
            {/* Card Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/30">
                  💰 Bolsa Total: {item.totalPoolMN.toLocaleString()} MN
                </span>
              </div>

              <h3 className="font-cinzel text-lg font-bold text-white leading-snug">
                {item.title}
              </h3>

              {/* Evidence Section */}
              <div className="bg-[#080304] p-3.5 rounded-xl border border-[#250809] space-y-1.5 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  EVIDENCIAS EN LA SERIE / MCU:
                </span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  {item.evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Betting Bar & Controls */}
            <div className="space-y-3 pt-3 border-t border-[#250809]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Cuotas de Apuesta en Vivo:</span>
                <span className="text-amber-300 font-bold">Apostando: {selectedBetAmount} MN</span>
              </div>

              {/* Dual Progress Bar */}
              <div className="h-3 rounded-full bg-slate-900 overflow-hidden flex border border-slate-800">
                <div
                  style={{ width: `${item.yesPercent}%` }}
                  className="bg-emerald-500 h-full transition-all duration-500"
                />
                <div
                  style={{ width: `${item.noPercent}%` }}
                  className="bg-red-600 h-full transition-all duration-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePlaceBet(item.id, 'yes')}
                  className="py-3 px-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-900/80 text-emerald-300 font-bold text-xs font-mono flex items-center justify-between transition-all active:scale-95"
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>SÍ CREO: {item.yesPercent}%</span>
                  </div>
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-black">
                    {item.yesMultiplier}x
                  </span>
                </button>

                <button
                  onClick={() => handlePlaceBet(item.id, 'no')}
                  className="py-3 px-4 rounded-2xl bg-red-950/60 border border-red-500/50 hover:bg-red-900/80 text-red-300 font-bold text-xs font-mono flex items-center justify-between transition-all active:scale-95"
                >
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>NO CREO: {item.noPercent}%</span>
                  </div>
                  <span className="bg-red-500/20 px-2 py-0.5 rounded text-[10px] font-black">
                    {item.noMultiplier}x
                  </span>
                </button>
              </div>

              <p className="text-[10px] text-amber-400/80 font-mono text-center">
                ✨ Ganancia Mayor: Opción de menor porcentaje paga hasta {Math.max(item.yesMultiplier, item.noMultiplier)}x
              </p>
            </div>

          </div>
        ))}
      </div>
      )}

    </div>
  );
};
