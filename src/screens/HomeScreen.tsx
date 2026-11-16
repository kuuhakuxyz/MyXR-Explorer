import React, { useMemo, useState } from 'react';
import {
  Search,
  Camera,
  Globe,
  Trophy,
  Map as MapIcon,
  ChevronRight,
  MapPin,
  Clock,
  Accessibility,
  User,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { HERITAGE_DESTINATIONS } from '../data/heritageData';
import { AccessibilitySettings, ExplorerProfileState, ScreenId } from '../types';
import { TranslationBundle } from '../i18n/translations';
import { BrandCrest } from '../components/NavigationShell';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface HomeScreenProps {
  profile: ExplorerProfileState;
  accessibility: AccessibilitySettings;
  t: TranslationBundle;
  onNavigate: (screen: ScreenId, destinationId?: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  accessibility,
  t,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredDestination = HERITAGE_DESTINATIONS[0]; // A Famosa, Melaka

  const filteredDestinations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return HERITAGE_DESTINATIONS.filter(
      (dest) =>
        dest.name.toLowerCase().includes(q) ||
        dest.location.toLowerCase().includes(q) ||
        dest.category.toLowerCase().includes(q) ||
        dest.era.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const recommendedDestinations = useMemo(
    () => HERITAGE_DESTINATIONS.filter((d) => d.id !== 'a-famosa'),
    []
  );

  const recentlyExplored = useMemo(
    () =>
      profile.recentlyExploredIds
        .map((id) => HERITAGE_DESTINATIONS.find((d) => d.id === id))
        .filter((d): d is NonNullable<typeof d> => Boolean(d)),
    [profile.recentlyExploredIds]
  );

  const featureCards: {
    id: ScreenId;
    destId?: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    tint: string;
    iconBg: string;
  }[] = [
    {
      id: 'ar-lens',
      destId: 'a-famosa',
      title: t.arLens,
      subtitle: t.arLensSub,
      icon: Camera,
      tint: 'bg-[#0D3447] text-[#FFF4E3]',
      iconBg: 'bg-white/15 text-[#F5B942]',
    },
    {
      id: 'virtual-tour',
      destId: 'a-famosa',
      title: t.virtualTours,
      subtitle: t.virtualToursSub,
      icon: Globe,
      tint: 'bg-[#FFF4E3] text-[#0D3447] border border-[#F5B942]/40',
      iconBg: 'bg-[#0D3447] text-[#F5B942]',
    },
    {
      id: 'quests',
      title: t.heritageQuest,
      subtitle: t.heritageQuestSub,
      icon: Trophy,
      tint: 'bg-white text-[#1E293B] border border-slate-200',
      iconBg: 'bg-[#FFF4E3] text-[#0D3447]',
    },
    {
      id: 'planner',
      title: t.smartPlanner,
      subtitle: t.smartPlannerSub,
      icon: MapIcon,
      tint: 'bg-white text-[#1E293B] border border-slate-200',
      iconBg: 'bg-[#0D3447]/10 text-[#0D3447]',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-6">
      {/* Top App Header */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="lg:hidden">
            <BrandCrest compact />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#0D3447] hc-heading tracking-tight truncate">
              {t.welcome}, {profile.displayName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 hc-muted truncate">{t.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('quests')}
            aria-label={`Experience points: ${profile.xp} XP`}
            className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[#FFF4E3] hc-surface-alt border border-[#F5B942]/40 flex items-center gap-1.5 text-[#0D3447] font-semibold text-xs sm:text-sm transition-transform active:scale-[0.98]"
          >
            <Trophy className="w-4 h-4 text-[#D97706] shrink-0" aria-hidden="true" />
            <span className="tabular-nums whitespace-nowrap">{profile.xp} XP</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('accessibility')}
            aria-label="Open Accessibility Settings"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white hc-surface border border-slate-200 text-[#0D3447] hover:bg-slate-50 transition-colors"
          >
            <Accessibility className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            aria-label="Open Explorer Profile"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#0D3447] text-[#FFF4E3] hover:bg-[#134B66] transition-colors"
          >
            <User className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <section aria-label="Search Heritage Sites" className="relative">
        <div className="relative flex items-center">
          <Search
            className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="w-full min-h-[48px] pl-11 pr-10 py-3 rounded-2xl bg-white hc-surface border border-slate-200 text-sm text-[#1E293B] placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0D3447]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Live Search Results */}
        {searchQuery.trim().length > 0 && (
          <div className="mt-3 bg-white hc-surface border border-slate-200 rounded-2xl shadow-md p-3 space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-medium text-slate-500 hc-muted">
                Search results ({filteredDestinations.length})
              </p>
            </div>
            {filteredDestinations.length === 0 ? (
              <div className="py-6 text-center space-y-1">
                <p className="text-sm font-medium text-[#0D3447] hc-heading">
                  No heritage destinations matched “{searchQuery}”
                </p>
                <p className="text-xs text-slate-500 hc-muted">
                  Try searching for A Famosa, Christ Church, Jonker Street, or Maritime Museum.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredDestinations.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => onNavigate('detail', dest.id)}
                    className="w-full min-h-[56px] py-2.5 px-2 flex items-center gap-3 text-left hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <ImageWithFallback
                      src={dest.image}
                      alt={dest.name}
                      fallbackTitle={dest.shortName}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-[#0D3447] hc-heading truncate">
                        {dest.name}
                      </p>
                      <p className="text-xs text-slate-500 hc-muted truncate">
                        {dest.category} · {dest.era}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Main Responsive Grid: Featured Hero + XR Feature Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Featured Destination Card: A Famosa, Melaka */}
        <section aria-label={t.featuredLabel} className="lg:col-span-7 flex flex-col">
          <div className="relative flex-1 rounded-3xl overflow-hidden shadow-md bg-[#0D3447] min-h-[270px] sm:min-h-[320px] flex flex-col justify-end group">
            <ImageWithFallback
              src={featuredDestination.image}
              alt={featuredDestination.name}
              fallbackTitle={featuredDestination.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0D3447] via-[#0D3447]/60 to-transparent"
              aria-hidden="true"
            />

            <div className="relative z-10 p-5 sm:p-6 space-y-3 text-white">
              <div className="flex items-center gap-2 text-xs text-[#FFF4E3]/90 font-medium">
                <span>{t.featuredLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredDestination.era}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredDestination.visitDuration}</span>
              </div>

              <div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white leading-tight [text-wrap:balance]">
                  {featuredDestination.name}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#FFF4E3]/90 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#F5B942] shrink-0" aria-hidden="true" />
                  <span>{featuredDestination.location}</span>
                </p>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('detail', featuredDestination.id)}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#F5B942] hover:bg-[#eab035] text-[#0D3447] font-semibold text-sm inline-flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
                >
                  <span>{t.exploreNow}</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('ar-lens', featuredDestination.id)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-medium text-sm inline-flex items-center gap-2 border border-white/25 transition-colors whitespace-nowrap"
                >
                  <Camera className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
                  <span>AR Preview</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Four Core Feature Cards */}
        <section aria-label={t.featuresTitle} className="lg:col-span-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-semibold text-base sm:text-lg text-[#0D3447] hc-heading">
              {t.featuresTitle}
            </h2>
            <span className="text-xs text-slate-500 hc-muted">Melaka UNESCO Zone</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 flex-1">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => onNavigate(card.id, card.destId)}
                  className={`min-h-[124px] p-4 rounded-2xl text-left shadow-xs hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between hc-surface ${card.tint}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-heading font-semibold text-sm leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs opacity-80 mt-0.5 line-clamp-2">{card.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Recommended Destinations */}
      <section aria-label={t.recommended} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-base sm:text-lg text-[#0D3447] hc-heading">
            {t.recommended}
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="min-h-[44px] px-2 text-xs sm:text-sm font-semibold text-[#0D3447] hc-heading hover:underline inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-4 lg:overflow-visible">
          {recommendedDestinations.map((dest) => (
            <button
              key={dest.id}
              type="button"
              onClick={() => onNavigate('detail', dest.id)}
              className="w-[235px] lg:w-auto shrink-0 bg-white hc-surface rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all text-left flex flex-col group"
            >
              <div className="relative h-36 w-full overflow-hidden">
                <ImageWithFallback
                  src={dest.image}
                  alt={dest.name}
                  fallbackTitle={dest.shortName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 hc-muted">
                    {dest.category} · {dest.era}
                  </p>
                  <h3 className="font-heading font-semibold text-sm text-[#0D3447] hc-heading mt-0.5 line-clamp-1">
                    {dest.shortName}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 hc-muted pt-1 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#0D3447]" aria-hidden="true" />
                    <span>{dest.visitDuration}</span>
                  </span>
                  <span className="text-[#0D3447] hc-heading font-medium">Details</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recently Explored Locations (Simplified UI hides secondary history strip) */}
      {!accessibility.simplifiedUi && (
        <section aria-label={t.recentlyExplored} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-base sm:text-lg text-[#0D3447] hc-heading">
              {t.recentlyExplored}
            </h2>
            <span className="text-xs text-slate-500 hc-muted tabular-nums">
              {recentlyExplored.length} sites
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentlyExplored.slice(0, 3).map((dest) => (
              <button
                key={dest.id}
                type="button"
                onClick={() => onNavigate('detail', dest.id)}
                className="min-h-[68px] p-3 rounded-2xl bg-white hc-surface border border-slate-200 hover:border-[#0D3447]/40 transition-colors flex items-center gap-3.5 text-left"
              >
                <ImageWithFallback
                  src={dest.image}
                  alt={dest.name}
                  fallbackTitle={dest.shortName}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-sm text-[#0D3447] hc-heading truncate">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-500 hc-muted truncate mt-0.5">
                    {dest.location}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
