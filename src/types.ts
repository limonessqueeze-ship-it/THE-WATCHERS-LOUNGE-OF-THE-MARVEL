export type MCUPhase = 'Fase 1' | 'Fase 2' | 'Fase 3' | 'Fase 4' | 'Fase 5' | 'Fase 6' | 'Multiverse Saga';

export type TheoryCategory = 'Películas' | 'Series Disney+' | 'Cómics' | 'Especulación Salvaje' | 'Canon Confirmado';

export type FanRank = 'Variante de Loki' | 'Fan del Multiverso' | 'Hechicero Supremo' | 'Vengador Élite' | 'El Observador';

export interface UserProfile {
  id: string;
  username: string;
  agentHandle: string;
  email: string;
  avatarUrl: string;
  nexusPoints: number;
  rank: FanRank;
  favoriteCharacter: string;
  favoritePhase: MCUPhase;
  bookmarks: string[]; // Theory IDs
  likedTheories: Record<string, 'up' | 'down'>;
  isGuest?: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  theoryId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  isSpoiler: boolean;
  createdAt: string;
  likes: number;
}

export interface Theory {
  id: string;
  title: string;
  premise: string;
  fullContent: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  phase: MCUPhase;
  category: TheoryCategory;
  tags: string[];
  nexusProbability: number; // 0 - 100%
  nexusRisk: 'Bajo' | 'Moderado' | 'Alto' | 'Crítico / Colapso Temporal';
  nexusPoints: number; // votes
  userVoted?: 'up' | 'down' | null;
  commentsCount: number;
  createdAt: string;
  character?: string;
  artifact?: string;
  isAiGenerated?: boolean;
  isNexusEvent?: boolean;
  comments?: Comment[];
}

export interface MCURelease {
  id: string;
  title: string;
  releaseYear: number;
  universeYear: string; // e.g. "2023 - 2024" or "1942"
  type: 'movie' | 'series';
  phase: MCUPhase;
  posterUrl: string;
  overview: string;
  chronologicalOrder: number;
  releaseOrder: number;
  postCreditsScene: string;
  postCreditsImportance: 'Alta (Crucial para la Saga)' | 'Media (Setup de personaje)' | 'Baja (Broma / Comedia)';
  hypeScore: number; // 0-100%
  userRating: number; // 1-5
  totalRatings: number;
  directorOrCreator: string;
  keyCharacters: string[];
}

export interface Review {
  id: string;
  releaseId: string;
  releaseTitle: string;
  userId: string;
  username: string;
  agentHandle: string;
  userAvatar: string;
  rating: number; // 1-5
  hypeScore: number; // 0-100
  title: string;
  content: string;
  containsSpoilers: boolean;
  createdAt: string;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  nexusPointsReward: number;
  difficulty: 'fácil' | 'medio' | 'difícil' | 'multiverso';
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'uatu';
  text: string;
  timestamp: string;
  nexusRiskLevel?: 'Estable' | 'Onda Nexus Menor' | 'Evento Nexus Crítico';
  nexusProbability?: number;
  evidencePoints?: string[];
  timelineImpact?: string;
}
