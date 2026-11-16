export type ScreenId =
  | 'home'
  | 'explore'
  | 'ar-lens'
  | 'virtual-tour'
  | 'quests'
  | 'planner'
  | 'accessibility'
  | 'profile'
  | 'detail';

export type LanguageCode = 'en' | 'ms' | 'zh';
export type TextSizeMode = 'small' | 'medium' | 'large';

export interface Hotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  title: string;
  era: string;
  description: string;
}

export interface HeritageDestination {
  id: string;
  name: string;
  shortName: string;
  location: string;
  era: string;
  category: 'Fortress' | 'Colonial Landmark' | 'Cultural Street' | 'Hilltop Ruins' | 'Maritime Heritage';
  visitDuration: string;
  walkMinutesFromCenter: number;
  sampleOpeningHours: string;
  accessibilityNote: string;
  accessibleFriendly: boolean;
  image: string;
  historicalImage?: string;
  historicalYear?: string;
  historicalTitle?: string;
  description: string;
  historicalSummary: string;
  highlights: string[];
  narrationScript: string;
  mapCoords: { x: number; y: number };
  arCallouts: {
    id: string;
    label: string;
    detail: string;
    xPercent: number;
    yPercent: number;
  }[];
  tourHotspots: Hotspot[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface HeritageQuest {
  id: string;
  title: string;
  subtitle: string;
  destinationId: string;
  xpReward: number;
  badgeId: string;
  estimatedMinutes: number;
  questions: QuizQuestion[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: 'shield' | 'landmark' | 'compass' | 'book' | 'award' | 'camera';
  criteria: string;
}

export interface AccessibilitySettings {
  language: LanguageCode;
  textSize: TextSizeMode;
  audioNarration: boolean;
  subtitles: boolean;
  reducedMotion: boolean;
  voiceNavigation: boolean;
  simplifiedUi: boolean;
  highContrast: boolean;
}

export interface ExplorerProfileState {
  displayName: string;
  xp: number;
  completedQuestIds: string[];
  unlockedBadgeIds: string[];
  savedDestinationIds: string[];
  visitedDestinationIds: string[];
  recentlyExploredIds: string[];
  itineraryIds: string[];
  accessibleRoute: boolean;
  capturedMomentsCount: number;
}
