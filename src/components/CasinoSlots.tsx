import React, { useState } from 'react';
import { Dices, Volume2, VolumeX, Coins, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface SlotSymbol {
  id: string;
  name: string;
  icon: string;
  mult3: number;
  mult2: number;
}

export const SYMBOLS: SlotSymbol[] = [
  { id: 'crown', name: 'Corona de Loki', icon: '👑', mult3: 50, mult2: 5 },
  { id: 'gem', name: 'Gema del Infinito', icon: '💎', mult3: 25, mult2: 3 },
  { id: 'mjolnir', name: 'Mjolnir de Thor', icon: '⚡', mult3: 15, mult2: 2 },
  { id: 'shield', name: 'Escudo del Cáp', icon: '🛡️', mult3: 10, mult2: 2 },
  { id: 'eye', name: 'Ojo de Agamotto', icon: '👁️', mult3: 8, mult2: 2 },
  { id: 'loom', name: 'Telar Temporal', icon: '⏳', mult3: 5, mult2: 1.5 },
  { id: 'cherry', name: 'Cereza Cuántica', icon: '🍒', mult3: 3, mult2: 1.2 }
];

interface CasinoSlotsProps {
  userBalance: number;
  setUserBalance: React.Dispatch<React.SetStateAction<number>>;
  onOpenAuth: () => void;
}

export const CasinoSlots: React.FC<CasinoSlotsProps> = ({
  userBalance,
  setUserBalance,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const [selectedBet, setSelectedBet] = useState<number>(25);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [reel1, setReel1] = useState<SlotSymbol>(SYMBOLS[0]);
  const [reel2, setReel2] = useState<SlotSymbol>(SYMBOLS[1]);
  const [reel3, setReel3] = useState<SlotSymbol>(SYMBOLS[2]);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    if (userBalance < selectedBet) {
      setWinMessage(`⚠️ Saldo insuficiente (${userBalance} MN). Ajusta tu apuesta.`);
      return;
    }

    // Deduct bet
    setUserBalance(prev => prev - selectedBet);
    setIsSpinning(true);
    setWinMessage(null);

    // Simulate reel rotation
    let spins = 0;
    const interval = setInterval(() => {
      setReel1(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      setReel2(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      setReel3(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      spins++;

      if (spins > 15) {
        clearInterval(interval);
        
        // Final outcome
        const final1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const final2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const final3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

        setReel1(final1);
        setReel2(final2);
        setReel3(final3);
        setIsSpinning(false);

        // Calculate wins
        if (final1.id === final2.id && final2.id === final3.id) {
          const reward = selectedBet * final1.mult3;
          setUserBalance(prev => prev + reward);
          setWinMessage(`🎉 ¡JACKPOT MULTIVERSAL! 3x ${final1.icon} ${final1.name}! Ganaste ${reward} MN (${final1.mult3}x)`);
        } else if (final1.id === final2.id || final2.id === final3.id || final1.id === final3.id) {
          const matchSym = final1.id === final2.id ? final1 : (final2.id === final3.id ? final2 : final1);
          const reward = Math.floor(selectedBet * matchSym.mult2);
          setUserBalance(prev => prev + reward);
          setWinMessage(`✨ ¡PAR DE RELIQUIAS! 2x ${matchSym.icon} ${matchSym.name}! Ganaste ${reward} MN (${matchSym.mult2}x)`);
        } else {
          setWinMessage(`❌ No hubo alineación esta vez. ¡Inténtalo de nuevo!`);
        }
      }
    }, 80);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header Banner */}
      <div className="tva-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-red-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c0709] border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              <Dices className="w-3.5 h-3.5 text-amber-400" /> Casino Nexus • Tragamonedas del Multiverso
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-white">
              TRAGAMONEDAS <span className="text-[#DC2626]">MULTIVERSAL</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Prueba tu suerte alineando las gemas y reliquias de la Sagrada Línea Temporal. ¡Gana multiplicadores de hasta 50x tu apuesta!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-2xl bg-[#120708] border border-[#2d0a0a] text-slate-300 hover:text-white transition-colors"
              title="Sonido"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            </button>

            {!user && (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-full bg-[#DC2626] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-red-700 transition-all"
              >
                👤 Registrarme para Guardar MN
              </button>
            )}

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#18080a] border border-[#D4AF37]/50 text-xs font-mono font-bold">
              <Coins className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37]">TU SALDO: {userBalance} MN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Slot Machine & Paytable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Interactive Slot Machine */}
        <div className="lg:col-span-2 tva-card rounded-3xl p-6 sm:p-8 space-y-6">
          
          {/* Machine Header Status */}
          <div className="flex items-center justify-between border-b border-[#2d0a0a] pb-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 font-bold">SLOT AVT-9000</span>
            </div>
            <div className="text-amber-400 font-bold">
              MAX WIN: 50x (👑 👑 👑)
            </div>
          </div>

          {/* Slot Reels Container */}
          <div className="bg-[#080203] p-6 sm:p-10 rounded-3xl border-2 border-[#2d0b0d] shadow-2xl relative">
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
              
              {/* Reel 1 */}
              <div className={`p-4 sm:p-8 rounded-2xl bg-[#120608] border-2 border-[#D4AF37]/30 flex flex-col items-center justify-center space-y-3 transition-transform ${isSpinning ? 'animate-pulse scale-95' : ''}`}>
                <span className="text-5xl sm:text-7xl select-none">{reel1.icon}</span>
                <span className="text-[11px] font-mono font-bold text-amber-200 line-clamp-1">{reel1.name}</span>
              </div>

              {/* Reel 2 */}
              <div className={`p-4 sm:p-8 rounded-2xl bg-[#120608] border-2 border-[#D4AF37]/30 flex flex-col items-center justify-center space-y-3 transition-transform ${isSpinning ? 'animate-pulse scale-95' : ''}`}>
                <span className="text-5xl sm:text-7xl select-none">{reel2.icon}</span>
                <span className="text-[11px] font-mono font-bold text-amber-200 line-clamp-1">{reel2.name}</span>
              </div>

              {/* Reel 3 */}
              <div className={`p-4 sm:p-8 rounded-2xl bg-[#120608] border-2 border-[#D4AF37]/30 flex flex-col items-center justify-center space-y-3 transition-transform ${isSpinning ? 'animate-pulse scale-95' : ''}`}>
                <span className="text-5xl sm:text-7xl select-none">{reel3.icon}</span>
                <span className="text-[11px] font-mono font-bold text-amber-200 line-clamp-1">{reel3.name}</span>
              </div>

            </div>

            {/* Win Message Banner */}
            {winMessage && (
              <div className="mt-6 p-4 rounded-2xl bg-[#1b080a] border border-[#DC2626] text-center font-mono text-xs font-bold text-amber-300 animate-fade-in">
                {winMessage}
              </div>
            )}
          </div>

          {/* Bet Amount Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">Monto de Apuesta (MN):</span>
              <span className="text-amber-400 font-bold">{selectedBet} MN</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[10, 25, 50, 100, 250, 500].map(amt => (
                <button
                  key={amt}
                  onClick={() => setSelectedBet(amt)}
                  className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                    selectedBet === amt
                      ? 'bg-[#D4AF37] text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-[#120708] border border-[#2d0a0a] text-slate-300 hover:text-white'
                  }`}
                >
                  {amt} MN
                </button>
              ))}
              <button
                onClick={() => setSelectedBet(Math.min(userBalance, 1000))}
                className="px-4 py-2 rounded-xl bg-red-950 border border-red-700 text-red-300 font-mono text-xs font-bold hover:bg-red-900 transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Big Spin Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 via-[#DC2626] to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-red-950/80 active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Dices className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'GIRANDO REBOLES...' : `GIRAR TRAGAMONEDAS (${selectedBet} MN)`}</span>
          </button>

        </div>

        {/* Right: Paytable Panel */}
        <div className="tva-card rounded-3xl p-6 space-y-4">
          <h2 className="font-cinzel text-lg font-bold text-white flex items-center gap-2 border-b border-[#2d0a0a] pb-3">
            <Trophy className="w-5 h-5 text-[#D4AF37]" />
            <span>Tabla de Pagos Multiversales</span>
          </h2>

          <div className="space-y-2.5">
            {SYMBOLS.map(sym => (
              <div key={sym.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#090304] border border-[#230809] text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{sym.icon}</span>
                  <span className="text-slate-200 font-bold">{sym.name}</span>
                </div>
                <div className="text-right space-y-0.5">
                  <div className="text-amber-400 font-bold">3x ➔ {sym.mult3}x</div>
                  <div className="text-slate-500 text-[10px]">2x ➔ {sym.mult2}x</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
