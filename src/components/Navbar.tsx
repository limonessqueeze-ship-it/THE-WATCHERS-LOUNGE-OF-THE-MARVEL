import React from 'react';
import { Tv, Film, Lightbulb, Dices, Trophy, Search, User, LogOut, Coins, MessageSquare, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export type TabType = 'series' | 'movies' | 'theories' | 'casino' | 'ranking' | 'forum';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAuth: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userBalance?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  searchQuery,
  setSearchQuery,
  userBalance = 475
}) => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const navItems = [
    { id: 'series' as TabType, label: t('nav.series'), icon: Tv },
    { id: 'movies' as TabType, label: t('nav.movies'), icon: Film },
    { id: 'theories' as TabType, label: t('nav.theories'), icon: Lightbulb },
    { id: 'forum' as TabType, label: t('nav.forum'), icon: MessageSquare },
    { id: 'casino' as TabType, label: t('nav.casino'), icon: Dices },
    { id: 'ranking' as TabType, label: t('nav.ranking'), icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090405] border-b border-[#2d0a0a] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('series')} 
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-[#18080a] shadow-md shadow-red-950/50 group-hover:scale-105 transition-transform">
              <div className="w-6 h-6 bg-[#DC2626] rounded-full flex items-center justify-center text-white font-black text-xs font-serif shadow-inner">
                W
              </div>
            </div>
            <div>
              <div className="font-cinzel text-lg font-black tracking-wider text-white flex items-center gap-1.5 leading-none">
                <span>THE WATCHERS</span>
                <span className="text-[#DC2626]">LOUNGE</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-mono block mt-1">
                MCU VAULT & CASINO NEXUS
              </span>
            </div>
          </div>

          {/* Center Navigation Pill Bar */}
          <nav className="hidden md:flex items-center bg-[#100607] p-1.5 rounded-full border border-[#381010] gap-1 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#DC2626] text-white shadow-lg shadow-red-900/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar (Language, Search & User / Acceder) */}
          <div className="flex items-center gap-2.5">
            
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16080a] border border-[#D4AF37]/50 text-amber-300 font-mono text-xs font-bold hover:bg-amber-950/40 transition-colors shadow-sm"
              title="Cambiar Idioma / Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Search Input */}
            <div className="relative hidden xl:block w-40">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search_placeholder')}
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#120708] border border-[#381010] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>

            {/* User Info or Acceder Button */}
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16080a] border border-[#D4AF37]/40 text-xs font-mono">
                  <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] font-bold">{user.nexusPoints || userBalance} MN</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#140608] border border-slate-800 text-xs font-medium text-slate-200">
                  <span className="font-bold text-amber-200">{user.username}</span>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-full bg-red-950/30 text-red-400 hover:bg-red-900/50 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-900/50 active:scale-95 transition-all"
              >
                <span>➔ ACCEDER</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-[#2d0a0a] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#DC2626] text-white shadow-md'
                    : 'text-slate-300 bg-[#120708] border border-[#2d0a0a]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

