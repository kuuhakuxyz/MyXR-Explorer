import { LanguageCode } from '../types';

export interface TranslationBundle {
  welcome: string;
  tagline: string;
  searchPlaceholder: string;
  featuredLabel: string;
  exploreNow: string;
  featuresTitle: string;
  arLens: string;
  arLensSub: string;
  virtualTours: string;
  virtualToursSub: string;
  heritageQuest: string;
  heritageQuestSub: string;
  smartPlanner: string;
  smartPlannerSub: string;
  recommended: string;
  recentlyExplored: string;
  navHome: string;
  navExplore: string;
  navQuests: string;
  navPlanner: string;
  navProfile: string;
  accessibilityTitle: string;
  saveSettings: string;
  settingsSavedToast: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationBundle> = {
  en: {
    welcome: 'Welcome',
    tagline: 'Explore Malaysia, Beyond Reality',
    searchPlaceholder: 'Search Melaka heritage sites...',
    featuredLabel: 'Featured Heritage Site',
    exploreNow: 'Explore Site',
    featuresTitle: 'XR Discovery Suite',
    arLens: 'AR Heritage Lens',
    arLensSub: 'Reconstruct 1511 Melaka',
    virtualTours: 'Virtual Tours',
    virtualToursSub: '360° panoramic vistas',
    heritageQuest: 'Heritage Quest',
    heritageQuestSub: 'Quizzes & XP rewards',
    smartPlanner: 'Smart Trip Planner',
    smartPlannerSub: 'Accessible heritage routes',
    recommended: 'Recommended Destinations',
    recentlyExplored: 'Recently Explored',
    navHome: 'Home',
    navExplore: 'Explore',
    navQuests: 'Quests',
    navPlanner: 'Planner',
    navProfile: 'Profile',
    accessibilityTitle: 'Inclusive XR Accessibility',
    saveSettings: 'Save Preferences',
    settingsSavedToast: 'Accessibility preferences saved and applied.',
  },
  ms: {
    welcome: 'Selamat Datang',
    tagline: 'Terokai Malaysia, Melangkaui Realiti',
    searchPlaceholder: 'Cari tapak warisan Melaka...',
    featuredLabel: 'Tapak Warisan Pilihan',
    exploreNow: 'Terokai Tapak',
    featuresTitle: 'Rangkaian Penemuan XR',
    arLens: 'Lensa Warisan AR',
    arLensSub: 'Rekonstruksi Melaka 1511',
    virtualTours: 'Lawatan Maya 360°',
    virtualToursSub: 'Panorama sejarah interaktif',
    heritageQuest: 'Misi Warisan',
    heritageQuestSub: 'Kuiz & ganjaran XP',
    smartPlanner: 'Perancang Pintar',
    smartPlannerSub: 'Laluan mesra OKU',
    recommended: 'Destinasi Disyorkan',
    recentlyExplored: 'Baru Diterokai',
    navHome: 'Utama',
    navExplore: 'Teroka',
    navQuests: 'Misi',
    navPlanner: 'Rancang',
    navProfile: 'Profil',
    accessibilityTitle: 'Tetapan Kebolehcapaian XR',
    saveSettings: 'Simpan Tetapan',
    settingsSavedToast: 'Tetapan kebolehcapaian telah disimpan.',
  },
  zh: {
    welcome: '欢迎探索',
    tagline: '探索马来西亚，超越现实体验',
    searchPlaceholder: '搜索马六甲文化遗产景点...',
    featuredLabel: '精选文化遗产',
    exploreNow: '探索详情',
    featuresTitle: 'XR 智慧探索套件',
    arLens: 'AR 实景古迹镜',
    arLensSub: '重现1511年古城堡',
    virtualTours: '360° 虚拟导览',
    virtualToursSub: '全景历史沉浸漫游',
    heritageQuest: '文化寻宝任务',
    heritageQuestSub: '趣味问答赢取经验',
    smartPlanner: '智能行程规划',
    smartPlannerSub: '含无障碍路线切换',
    recommended: '推荐历史景点',
    recentlyExplored: '最近浏览足迹',
    navHome: '首页',
    navExplore: '探索',
    navQuests: '任务',
    navPlanner: '行程',
    navProfile: '我的',
    accessibilityTitle: '无障碍 XR 辅助设置',
    saveSettings: '保存偏好设置',
    settingsSavedToast: '无障碍偏好设置已保存并生效。',
  },
};
