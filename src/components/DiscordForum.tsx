import React, { useState, useEffect, useRef } from 'react';
import { 
  Hash, 
  Send, 
  Image as ImageIcon, 
  Users, 
  ShieldCheck, 
  MessageSquare, 
  Palette, 
  Lightbulb,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  Laugh
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export interface ForumMessage {
  id: string;
  channel: string; // 'general' | 'fan-arts' | 'teorias'
  authorName: string;
  authorHandle: string;
  avatarUrl?: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  reactions: Record<string, number>;
  userReactions?: Record<string, boolean>;
}

export interface RegisteredMember {
  id: string;
  username: string;
  agentHandle: string;
  lastActive: string;
  isOnline: boolean;
}

const EMOJIS = ['🔥', '❤️', '🚀', '🧠', '🎨', '👑', '🌌', '👍'];

interface DiscordForumProps {
  searchQuery?: string;
}

export const DiscordForum: React.FC<DiscordForumProps> = ({ searchQuery = '' }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeChannel, setActiveChannel] = useState<'general' | 'fan-arts' | 'teorias' | 'memes'>('general');
  const [inputText, setInputText] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showImageField, setShowImageField] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  
  // Mobile Drawers
  const [showChannelsMobile, setShowChannelsMobile] = useState(false);
  const [showMembersMobile, setShowMembersMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Elige una de menos de 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrlInput(reader.result);
        setShowImageField(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const channels = [
    { id: 'general', name: t('forum.ch_general'), icon: MessageSquare, label: t('forum.ch_general_label'), desc: t('forum.ch_general_desc') },
    { id: 'memes', name: t('forum.ch_memes'), icon: Laugh, label: t('forum.ch_memes_label'), desc: t('forum.ch_memes_desc') },
    { id: 'fan-arts', name: 'fan-arts', icon: Palette, label: t('forum.ch_fanarts_label'), desc: t('forum.ch_fanarts_desc') },
    { id: 'teorias', name: 'teorias', icon: Lightbulb, label: t('forum.ch_theories_label'), desc: t('forum.ch_theories_desc') }
  ];

  // Store registered community members in localStorage
  const [registeredMembers, setRegisteredMembers] = useState<RegisteredMember[]>(() => {
    try {
      const saved = localStorage.getItem('mcu_community_registered_members');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load community members', e);
    }
    return [];
  });

  // Track user login and update registered members list
  useEffect(() => {
    if (!user) return;

    setRegisteredMembers(prev => {
      const exists = prev.some(m => m.id === user.id || m.username === user.username);
      const updatedList = prev.map(m => {
        if (m.id === user.id || m.username === user.username) {
          return { ...m, isOnline: true, lastActive: 'Ahora mismo' };
        }
        return { ...m, isOnline: false };
      });

      if (!exists) {
        updatedList.push({
          id: user.id,
          username: user.username,
          agentHandle: user.agentHandle || `@${user.username.toLowerCase().replace(/\s+/g, '_')}`,
          lastActive: 'Ahora mismo',
          isOnline: true
        });
      }

      localStorage.setItem('mcu_community_registered_members', JSON.stringify(updatedList));
      return updatedList;
    });
  }, [user]);

  // Load / Store Messages per channel in LocalStorage
  const [channelMessages, setChannelMessages] = useState<Record<string, ForumMessage[]>>(() => {
    const defaultMemes = [
      {
        id: 'meme-1',
        channel: 'memes',
        authorName: 'Deadpool_616',
        authorHandle: '@deadpool',
        content: 'Cuando la TVA intenta explicarme las reglas del sagrado flujo temporal por 10ª vez 🤣',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
        timestamp: 'Hace 1 hora',
        reactions: { '🔥': 15, '🚀': 8, '❤️': 20 }
      },
      {
        id: 'meme-2',
        channel: 'memes',
        authorName: 'SpiderFan_NYC',
        authorHandle: '@spidey',
        content: 'Peter Parker tratando de explicarle a Doctor Strange por qué arruinó el hechizo 🕷️🤣',
        timestamp: 'Hace 30 min',
        reactions: { '🧠': 10, '👍': 12 }
      }
    ];

    try {
      const saved = localStorage.getItem('mcu_discord_forum_messages_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed['memes'] || parsed['memes'].length === 0) {
          parsed['memes'] = defaultMemes;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not load forum messages from storage', e);
    }
    return {
      'general': [],
      'memes': defaultMemes,
      'fan-arts': [],
      'teorias': []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('mcu_discord_forum_messages_v2', JSON.stringify(channelMessages));
    } catch (e) {
      console.warn('Could not save forum messages to storage', e);
    }
  }, [channelMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChannel, channelMessages]);

  const currentMessages = channelMessages[activeChannel] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !imageUrlInput.trim()) return;

    const newMessage: ForumMessage = {
      id: `msg-${Date.now()}`,
      channel: activeChannel,
      authorName: user?.username || 'Agente Multiversal',
      authorHandle: user?.agentHandle || '@agente_tva',
      content: inputText.trim(),
      imageUrl: imageUrlInput.trim() || undefined,
      timestamp: 'Ahora mismo',
      reactions: { '❤️': 1 }
    };

    setChannelMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMessage]
    }));

    setInputText('');
    setImageUrlInput('');
    setShowImageField(false);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setChannelMessages(prev => {
      const list = prev[activeChannel] || [];
      const updated = list.map(msg => {
        if (msg.id !== messageId) return msg;

        const userReacted = msg.userReactions?.[emoji];
        const currentCnt = Number(msg.reactions[emoji]) || 0;
        const newCount = currentCnt + (userReacted ? -1 : 1);
        const newReactions = { ...msg.reactions, [emoji]: Math.max(0, newCount) };

        return {
          ...msg,
          reactions: newReactions,
          userReactions: {
            ...msg.userReactions,
            [emoji]: !userReacted
          }
        };
      });

      return {
        ...prev,
        [activeChannel]: updated
      };
    });
  };

  const currentChannelObj = channels.find(c => c.id === activeChannel)!;

  // Filter messages by search query if present
  const filteredMessages = currentMessages.filter(m => 
    !searchQuery || 
    m.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Online members list vs Offline members list
  const onlineMembers = registeredMembers.filter(m => m.isOnline || (user && m.id === user.id));
  const offlineMembers = registeredMembers.filter(m => !m.isOnline && (!user || m.id !== user.id));

  const selectChannelMobile = (channelId: 'general' | 'fan-arts' | 'teorias' | 'memes') => {
    setActiveChannel(channelId);
    setShowChannelsMobile(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-2 sm:py-6">
      
      {/* Discord Window Main Container */}
      <div className="w-full bg-[#0e0709] border border-[#2d0a0a] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] min-h-[520px] max-h-[850px] relative">
        
        {/* DESKTOP LEFT CHANNELS SIDEBAR */}
        <div className="hidden md:flex md:w-64 bg-[#080304] border-r border-[#220708] flex-col flex-shrink-0">
          
          {/* Server Title Header */}
          <div className="p-4 border-b border-[#220708] bg-[#0c0406] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-bold text-white shadow-md text-xs font-mono">
                MCU
              </div>
              <div>
                <h2 className="font-cinzel text-sm font-black text-white leading-none tracking-wide">
                  {t('forum.title')}
                </h2>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  {onlineMembers.length > 0 ? onlineMembers.length : 1} {t('forum.online_count')}
                </span>
              </div>
            </div>
          </div>

          {/* Channels List */}
          <div className="p-3 space-y-4 flex-1 overflow-y-auto">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-2 block mb-2">
                {t('forum.channels_title')}
              </span>

              <div className="space-y-1">
                {channels.map(ch => {
                  const isActive = activeChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id as any)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left group ${
                        isActive
                          ? 'bg-red-950/80 text-white border border-red-700/60 shadow-md'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#140608]'
                      }`}
                    >
                      <Hash className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <div className="truncate flex-1">
                        <span className="block truncate">{ch.name}</span>
                        <span className="text-[9px] font-mono text-slate-500 font-normal block truncate">
                          {ch.label}
                        </span>
                      </div>
                      {ch.id === 'memes' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                          MEMES
                        </span>
                      )}
                      {ch.id === 'fan-arts' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold">
                          ARTS
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TVA Lounge Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-b from-[#140507] to-[#080203] border border-red-900/40 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Normas de la Comunidad</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Respeta las opiniones multiversales y comparte tus Fan Arts sin copyright.
              </p>
            </div>
          </div>

          {/* User Profile Bar at Bottom */}
          <div className="p-3 border-t border-[#220708] bg-[#0a0305] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-900/80 border border-red-500/60 flex items-center justify-center font-bold text-amber-300 font-mono text-xs">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-200 block truncate">
                  {user?.username || 'Agente_MCU'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 block truncate">
                  ● {user ? t('forum.status_online') : t('forum.status_offline')}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* MAIN CHAT AREA (Discord Mobile & Desktop View) */}
        <div className="flex-1 flex flex-col bg-[#0b0506] relative overflow-hidden h-full">
          
          {/* Top Discord App Header Bar */}
          <div className="p-3 border-b border-[#220708] bg-[#0c0406] flex items-center justify-between z-10 shadow-md">
            
            {/* Left: Mobile Menu Trigger or Hash Icon */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowChannelsMobile(true)}
                className="md:hidden p-2 rounded-xl bg-[#16070a] border border-[#2d0a0a] text-slate-200 hover:text-white flex items-center justify-center active:scale-95 transition-transform"
                aria-label="Abrir canales"
              >
                <Menu className="w-5 h-5 text-red-500" />
              </button>

              <div 
                onClick={() => setShowChannelsMobile(true)}
                className="flex items-center gap-2 cursor-pointer md:cursor-default"
              >
                <Hash className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5 leading-none">
                    <span>{currentChannelObj.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 md:hidden" />
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[180px] sm:max-w-none">
                    {currentChannelObj.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Members Toggle Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMembersMobile(!showMembersMobile)}
                className="p-2 rounded-xl bg-[#16070a] border border-[#2d0a0a] text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-mono active:scale-95 transition-transform"
                title="Miembros"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold hidden xs:inline">
                  {onlineMembers.length > 0 ? onlineMembers.length : 1}
                </span>
              </button>
            </div>
          </div>

          {/* Chat Messages Feed Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 font-sans scroll-smooth">
            
            {/* Welcome banner for channel */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#080203] border border-[#220708] space-y-1.5 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-red-950/90 border border-red-700/60 flex items-center justify-center text-red-400 shadow-md">
                <Hash className="w-5 h-5" />
              </div>
              <h1 className="font-cinzel text-sm sm:text-lg font-black text-white">
                {t('forum.welcome_prefix')}{currentChannelObj.name}{t('forum.welcome_suffix')}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {t('forum.welcome_desc')}
              </p>
            </div>

            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                {t('forum.no_messages')}
              </div>
            ) : (
              filteredMessages.map(msg => (
                <div 
                  key={msg.id} 
                  className="flex gap-2.5 p-2 rounded-2xl hover:bg-[#140608] transition-colors group relative"
                >
                  {/* Author Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-950 to-slate-900 border border-red-800/80 flex-shrink-0 flex items-center justify-center text-xs font-bold text-amber-300 font-mono shadow-md">
                    {msg.authorName.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 space-y-1 overflow-hidden">
                    {/* Header line */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-200">
                        {msg.authorName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Text content */}
                    {msg.content && (
                      <p className="text-xs text-slate-200 leading-relaxed break-words">
                        {msg.content}
                      </p>
                    )}

                    {/* Image Embed (For Fan Arts or images) */}
                    {msg.imageUrl && (
                      <div className="mt-2 max-w-xs sm:max-w-md rounded-2xl overflow-hidden border border-red-900/40 bg-black/60 shadow-xl group/img relative">
                        <img 
                          src={msg.imageUrl} 
                          alt="Fan Art"
                          className="w-full max-h-56 sm:max-h-80 object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <a 
                          href={msg.imageUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur border border-white/20 text-white text-[10px] font-mono font-bold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Ver Imagen</span>
                        </a>
                      </div>
                    )}

                    {/* Reactions Bar */}
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {Object.entries(msg.reactions).map(([emoji, count]) => {
                        const cnt = Number(count) || 0;
                        if (cnt <= 0) return null;
                        const isUserReacted = msg.userReactions?.[emoji];
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(msg.id, emoji)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-mono transition-all ${
                              isUserReacted
                                ? 'bg-red-950/90 border-red-600 text-amber-300 font-bold scale-105'
                                : 'bg-[#150709] border-[#220708] text-slate-400 hover:text-white hover:bg-[#1e0a0d]'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span>{cnt}</span>
                          </button>
                        );
                      })}

                      {/* Quick reaction button */}
                      <div className="relative group/emoji">
                        <button 
                          className="p-1 rounded-lg bg-[#120608] border border-[#220708] text-slate-400 hover:text-slate-200 text-xs"
                          title="Reaccionar"
                        >
                          +
                        </button>
                        <div className="hidden group-hover/emoji:flex absolute bottom-full left-0 mb-1 bg-[#16070a] border border-red-900 p-1 rounded-xl shadow-2xl gap-1 z-20">
                          {EMOJIS.slice(0, 5).map(e => (
                            <button
                              key={e}
                              onClick={() => handleAddReaction(msg.id, e)}
                              className="p-1 hover:bg-red-950 rounded text-sm transition-transform hover:scale-125"
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM (Discord Mobile Style) */}
          <div className="p-2.5 sm:p-4 bg-[#0c0406] border-t border-[#220708] space-y-2">
            
            {/* Hidden native file input for picking images from phone/device gallery */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />

            {/* Selected Image Thumbnail Preview */}
            {imageUrlInput ? (
              <div className="flex items-center justify-between bg-[#150709] p-2 rounded-xl border border-emerald-600/60 animate-fade-in">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img 
                    src={imageUrlInput} 
                    alt="Vista previa" 
                    className="w-10 h-10 object-cover rounded-lg border border-emerald-500/50 flex-shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-xs font-bold text-emerald-400 block truncate">
                      ✓ Imagen lista para enviar
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block truncate">
                      De tu galería o enlace
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrlInput('');
                    setShowImageField(false);
                  }}
                  className="p-1.5 rounded-lg bg-red-950/80 border border-red-700/60 text-red-300 hover:text-white text-xs font-bold transition-all ml-2 flex-shrink-0"
                  title="Eliminar imagen"
                >
                  ✕
                </button>
              </div>
            ) : showImageField ? (
              <div className="bg-[#150709] p-2.5 rounded-xl border border-red-900/60 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-red-400" />
                    Adjuntar Imagen o Fan Art
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowImageField(false);
                      setShowUrlField(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white px-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Button 1: Open native device library / gallery */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-white font-mono text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t('forum.upload_from_gallery')}</span>
                  </button>

                  {/* Button 2: Paste URL */}
                  <button
                    type="button"
                    onClick={() => setShowUrlField(!showUrlField)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#200a0d] border border-red-900/60 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{t('forum.attach_url_option')}</span>
                  </button>
                </div>

                {showUrlField && (
                  <div className="flex items-center gap-2 bg-[#0c0406] p-1.5 rounded-lg border border-[#2d0a0a] pt-2">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={e => setImageUrlInput(e.target.value)}
                      placeholder={t('forum.attach_img_placeholder')}
                      className="w-full bg-transparent text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                )}
              </div>
            ) : null}

            <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  if (imageUrlInput) {
                    setImageUrlInput('');
                    setShowImageField(false);
                  } else if (!showImageField) {
                    setShowImageField(true);
                  } else {
                    setShowImageField(false);
                  }
                }}
                className={`p-2 sm:p-2.5 rounded-xl border transition-all flex-shrink-0 ${
                  showImageField || imageUrlInput
                    ? 'bg-emerald-950 border-emerald-600 text-emerald-400'
                    : 'bg-[#150709] border-[#220708] text-slate-400 hover:text-white hover:border-red-900'
                }`}
                title="Adjuntar Imagen (Galería o URL)"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={`${t('forum.placeholder')}${currentChannelObj.name}...`}
                className="flex-1 bg-[#150709] border border-[#220708] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-600 transition-colors"
              />

              <button
                type="submit"
                disabled={!inputText.trim() && !imageUrlInput.trim()}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-mono text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-lg active:scale-95 flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('forum.send')}</span>
              </button>
            </form>
          </div>

        </div>

        {/* DESKTOP RIGHT MEMBERS SIDEBAR */}
        <div className="hidden md:flex md:w-56 bg-[#080304] border-l border-[#220708] p-3 flex-col flex-shrink-0 space-y-4">
          <div className="space-y-4 overflow-y-auto flex-1 text-xs font-sans">
            
            {/* Category: ONLINE MEMBERS */}
            <div>
              <div className="border-b border-[#220708] pb-1.5 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                  ● {t('forum.members_online')} ({user ? 1 : 0})
                </span>
              </div>

              <div className="space-y-1.5">
                {user ? (
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
                    <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center font-bold text-[10px] text-emerald-200 font-mono">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-white block leading-tight truncate">
                        {user.username}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 block">
                        ● {t('forum.status_online')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-slate-500 p-1">
                    Inicia sesión para aparecer en línea.
                  </div>
                )}
              </div>
            </div>

            {/* Category: OFFLINE MEMBERS */}
            <div>
              <div className="border-b border-[#220708] pb-1.5 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  ○ {t('forum.members_offline')} ({offlineMembers.length})
                </span>
              </div>

              <div className="space-y-1.5">
                {offlineMembers.length === 0 ? (
                  <div className="text-[10px] font-mono text-slate-600 p-1">
                    No hay otros usuarios registrados aún.
                  </div>
                ) : (
                  offlineMembers.map(m => (
                    <div key={m.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#120608]">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-400 font-mono">
                        {m.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-400 block leading-tight truncate">
                          {m.username}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 block">
                          ○ {t('forum.status_offline')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* MOBILE LEFT CHANNELS DRAWER (Discord Native Feel) */}
      {showChannelsMobile && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start animate-fade-in">
          <div className="w-72 bg-[#080304] border-r border-red-900/60 h-full p-4 flex flex-col justify-between shadow-2xl">
            
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#220708] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-bold text-white text-xs font-mono">
                    MCU
                  </div>
                  <div>
                    <h3 className="font-cinzel text-xs font-black text-white leading-none">
                      {t('forum.title')}
                    </h3>
                    <span className="text-[9px] text-emerald-400 font-mono">
                      ● {onlineMembers.length > 0 ? onlineMembers.length : 1} {t('forum.online_count')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowChannelsMobile(false)}
                  className="p-1.5 rounded-xl bg-[#150709] text-slate-400 hover:text-white border border-[#220708]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Channels List */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-2 block mb-2">
                  {t('forum.channels_title')}
                </span>

                {channels.map(ch => {
                  const isActive = activeChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => selectChannelMobile(ch.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        isActive
                          ? 'bg-red-700 text-white shadow-lg'
                          : 'text-slate-300 bg-[#120608] hover:bg-[#1a080b]'
                      }`}
                    >
                      <Hash className={`w-4 h-4 ${isActive ? 'text-white' : 'text-red-400'}`} />
                      <div className="truncate flex-1">
                        <span className="block">{ch.name}</span>
                        <span className="text-[9px] font-mono text-slate-400 font-normal block truncate">
                          {ch.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* TVA Lounge Rules Banner */}
              <div className="p-3 rounded-xl bg-[#120507] border border-red-900/40 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Comunidad TVA</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  Respeta las opiniones multiversales y comparte tus Fan Arts sin copyright.
                </p>
              </div>
            </div>

            {/* Bottom Mobile User Status */}
            <div className="p-2.5 rounded-xl bg-[#120507] border border-[#220708] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-900 border border-red-500 flex items-center justify-center text-amber-300 font-mono text-xs font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{user?.username || 'Agente_MCU'}</span>
                  <span className="text-[9px] font-mono text-emerald-400">● {t('forum.status_online')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MOBILE RIGHT MEMBERS DRAWER */}
      {showMembersMobile && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-72 bg-[#080304] border-l border-red-900/60 h-full p-4 flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#220708] pb-2">
              <span className="text-xs font-mono font-bold text-white uppercase">
                {t('forum.members_online')}
              </span>
              <button
                onClick={() => setShowMembersMobile(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-[#140608]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 text-xs font-sans">
              {/* ONLINE */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 block mb-2">
                  ● {t('forum.members_online')} ({user ? 1 : 0})
                </span>
                {user ? (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                    <div className="w-7 h-7 rounded-full bg-emerald-900 flex items-center justify-center font-bold text-xs text-emerald-200 font-mono">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-white block text-xs">{user.username}</span>
                      <span className="text-[10px] font-mono text-emerald-400">● {t('forum.status_online')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 font-mono">Inicia sesión para aparecer en línea.</div>
                )}
              </div>

              {/* OFFLINE */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-2">
                  ○ {t('forum.members_offline')} ({offlineMembers.length})
                </span>
                {offlineMembers.length === 0 ? (
                  <div className="text-[11px] text-slate-600 font-mono">No hay otros miembros.</div>
                ) : (
                  offlineMembers.map(m => (
                    <div key={m.id} className="flex items-center gap-2 p-2 rounded-xl bg-[#100507] border border-[#220708] mb-1">
                      <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs text-slate-400 font-mono">
                        {m.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-300 block text-xs">{m.username}</span>
                        <span className="text-[10px] font-mono text-slate-500">○ {t('forum.status_offline')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
