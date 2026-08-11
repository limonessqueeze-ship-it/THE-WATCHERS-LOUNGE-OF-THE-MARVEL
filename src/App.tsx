import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, TabType } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { SeriesCatalog } from './components/SeriesCatalog';
import { MoviesCatalog } from './components/MoviesCatalog';
import { TheoriesArena } from './components/TheoriesArena';
import { CasinoSlots } from './components/CasinoSlots';
import { RankingBoard } from './components/RankingBoard';
import { LoreChatbot } from './components/LoreChatbot';
import { TheoryAnalyzer } from './components/TheoryAnalyzer';
import { Bot, Sparkles } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('series');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoreChatbotOpen, setIsLoreChatbotOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userBalance, setUserBalance] = useState(500);

  // Automatically prompt auth modal if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setIsAuthOpen(true);
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-[#060203] text-slate-100 font-sans flex flex-col relative selection:bg-[#DC2626] selection:text-white">
      
      {/* Radial Mesh Overlay */}
      <div className="absolute inset-0 bg-radial-mesh opacity-20 pointer-events-none z-0" />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        userBalance={userBalance}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Lore Chatbot Modal */}
      {isLoreChatbotOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0d0607] border border-[#DC2626]/40 p-2 sm:p-4 relative shadow-2xl">
            <LoreChatbot onClose={() => setIsLoreChatbotOpen(false)} />
          </div>
        </div>
      )}

      {/* Theory Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0d0607] border border-[#D4AF37]/40 p-4 sm:p-6 relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#2d0a0a] pb-3">
              <h2 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Forjar Teoría con Inteligencia Artificial</span>
              </h2>
              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="px-3 py-1 rounded-full bg-red-950 text-red-300 font-mono text-xs font-bold border border-red-700 hover:bg-red-900 transition-colors"
              >
                ✕ Cerrar
              </button>
            </div>
            <TheoryAnalyzer
              onPublishTheory={() => {
                setIsGeneratorOpen(false);
                setActiveTab('theories');
              }}
            />
          </div>
        </div>
      )}

      {/* Main Views Routing */}
      <main className="flex-1 pb-16 relative z-10">
        {activeTab === 'series' && (
          <SeriesCatalog searchQuery={searchQuery} />
        )}

        {activeTab === 'movies' && (
          <MoviesCatalog searchQuery={searchQuery} />
        )}

        {activeTab === 'theories' && (
          <TheoriesArena
            searchQuery={searchQuery}
            onOpenGenerator={() => setIsGeneratorOpen(true)}
            userBalance={userBalance}
            setUserBalance={setUserBalance}
          />
        )}

        {activeTab === 'casino' && (
          <CasinoSlots
            userBalance={userBalance}
            setUserBalance={setUserBalance}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'ranking' && (
          <RankingBoard
            onOpenAuth={() => setIsAuthOpen(true)}
            userBalance={userBalance}
          />
        )}
      </main>

      {/* Floating IA Cómics & Lore Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsLoreChatbotOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-[#DC2626] via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-2xl shadow-red-950 border border-amber-400/40 active:scale-95 transition-all group"
        >
          <Bot className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span>🤖 IA Cómics & Lore ✨</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2d0a0a] bg-[#080304] py-6 px-6 relative z-10 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 The Watcher's Lounge • Películas, Series & Ranking de Apuestas</p>
          <p className="font-cinzel font-bold text-[#DC2626] tracking-wider text-sm">
            The Watcher's Lounge
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
