import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DICTIONARY: Record<Language, Record<string, string>> = {
  es: {
    // Navbar
    'nav.series': 'Series',
    'nav.movies': 'Películas',
    'nav.theories': 'Teorías',
    'nav.forum': 'Foro',
    'nav.casino': 'Casino TVA',
    'nav.ranking': 'Ranking',
    'nav.search_placeholder': 'Buscar en el Multiverso...',
    'nav.nexus_points': 'Puntos Nexus',
    'nav.login': 'Iniciar Sesión',
    'nav.profile': 'Perfil',

    // Discord Forum
    'forum.title': 'FORO MCU',
    'forum.online_count': 'Agentes Conectados',
    'forum.channels_title': 'CANALES DE DISCUSIÓN',
    'forum.ch_general': 'foro-general',
    'forum.ch_general_label': 'Foro General',
    'forum.ch_general_desc': 'Chat global de fans del MCU',
    'forum.ch_fanarts': 'fan-arts',
    'forum.ch_fanarts_label': 'Fan Arts MCU',
    'forum.ch_fanarts_desc': 'Muestra e ilustra tus creaciones de Marvel',
    'forum.ch_theories': 'teorias',
    'forum.ch_theories_label': 'Teorías & Debates',
    'forum.ch_theories_desc': 'Discusión profunda del Multiverso',
    'forum.welcome_prefix': '¡Te damos la bienvenida a #',
    'forum.welcome_suffix': '!',
    'forum.welcome_desc': 'Este es el inicio oficial del canal. ¡Sé el primero en enviar un mensaje!',
    'forum.no_messages': 'Aún no hay mensajes en este canal. ¡Sé el primero en escribir!',
    'forum.placeholder': 'Enviar mensaje en #',
    'forum.attach_img_placeholder': 'Pega el enlace URL de tu imagen (https://...)',
    'forum.upload_from_gallery': 'Subir de la Galería',
    'forum.attach_url_option': 'Usar URL',
    'forum.send': 'Enviar',
    'forum.members_online': 'MIEMBROS EN LÍNEA',
    'forum.members_offline': 'DESCONECTADOS',
    'forum.status_online': 'En Línea',
    'forum.status_offline': 'Desconectado',
    'forum.you': 'TÚ (EN LÍNEA)',

    // Common Buttons
    'btn.close': 'Cerrar',
    'btn.close_summary': '✕ Cerrar Resumen',
    'btn.close_theory': '✕ Cerrar Teoría',
    'btn.comment': 'Comentar',
    'btn.like': 'Me gusta',
    'btn.post': 'Publicar',

    // Comments
    'comments.title': 'Comentarios de la Comunidad MCU',
    'comments.rating': 'Calificación:',
    'comments.what_did_you_think_movie': '¿Qué te pareció esta película?',
    'comments.what_did_you_think_series': '¿Qué te pareció esta serie?',
    'comments.placeholder_movie': 'Escribe tu opinión o momento favorito...',
    'comments.empty': 'Aún no hay comentarios. ¡Sé el primero en opinar!',

    // Catalog & Filters
    'catalog.filter_all': 'Todas',
    'catalog.summary': 'RESUMEN OFICIAL MCU:',
    'catalog.episodes': 'Episodios',
    'catalog.duration': 'Duración',

    // Auth & Profile
    'auth.title': 'Acceso a la TVA',
    'auth.login_guest': 'Entrar como Invitado',
    'auth.logout': 'Cerrar Sesión',

    // Language Toggle
    'lang.es': 'Español',
    'lang.en': 'English'
  },
  en: {
    // Navbar
    'nav.series': 'Series',
    'nav.movies': 'Movies',
    'nav.theories': 'Theories',
    'nav.forum': 'Forum',
    'nav.casino': 'TVA Casino',
    'nav.ranking': 'Ranking',
    'nav.search_placeholder': 'Search the Multiverse...',
    'nav.nexus_points': 'Nexus Points',
    'nav.login': 'Sign In',
    'nav.profile': 'Profile',

    // Discord Forum
    'forum.title': 'MCU FORUM',
    'forum.online_count': 'Agents Online',
    'forum.channels_title': 'DISCUSSION CHANNELS',
    'forum.ch_general': 'general-forum',
    'forum.ch_general_label': 'General Forum',
    'forum.ch_general_desc': 'Global MCU fans chat',
    'forum.ch_fanarts': 'fan-arts',
    'forum.ch_fanarts_label': 'MCU Fan Arts',
    'forum.ch_fanarts_desc': 'Share and showcase your Marvel artwork',
    'forum.ch_theories': 'theories',
    'forum.ch_theories_label': 'Theories & Debates',
    'forum.ch_theories_desc': 'Deep Multiverse discussions',
    'forum.welcome_prefix': 'Welcome to #',
    'forum.welcome_suffix': '!',
    'forum.welcome_desc': 'This is the start of the channel. Be the first to send a message!',
    'forum.no_messages': 'No messages in this channel yet. Be the first to write!',
    'forum.placeholder': 'Send message in #',
    'forum.attach_img_placeholder': 'Paste image URL (https://...)',
    'forum.upload_from_gallery': 'Upload from Gallery',
    'forum.attach_url_option': 'Use URL',
    'forum.send': 'Send',
    'forum.members_online': 'MEMBERS ONLINE',
    'forum.members_offline': 'OFFLINE MEMBERS',
    'forum.status_online': 'Online',
    'forum.status_offline': 'Offline',
    'forum.you': 'YOU (ONLINE)',

    // Common Buttons
    'btn.close': 'Close',
    'btn.close_summary': '✕ Close Summary',
    'btn.close_theory': '✕ Close Theory',
    'btn.comment': 'Comment',
    'btn.like': 'Like',
    'btn.post': 'Post',

    // Comments
    'comments.title': 'MCU Community Comments',
    'comments.rating': 'Rating:',
    'comments.what_did_you_think_movie': 'What did you think of this movie?',
    'comments.what_did_you_think_series': 'What did you think of this series?',
    'comments.placeholder_movie': 'Write your review or favorite moment...',
    'comments.empty': 'No comments yet. Be the first to leave a review!',

    // Catalog & Filters
    'catalog.filter_all': 'All',
    'catalog.summary': 'OFFICIAL MCU SUMMARY:',
    'catalog.episodes': 'Episodes',
    'catalog.duration': 'Duration',

    // Auth & Profile
    'auth.title': 'TVA Access',
    'auth.login_guest': 'Enter as Guest',
    'auth.logout': 'Sign Out',

    // Language Toggle
    'lang.es': 'Español',
    'lang.en': 'English'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('watcher_lounge_lang');
    return (saved === 'en' || saved === 'es') ? saved : 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('watcher_lounge_lang', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
  };

  const t = (key: string): string => {
    return DICTIONARY[language]?.[key] || DICTIONARY['es']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
