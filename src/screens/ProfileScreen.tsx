import React, { useMemo, useState } from 'react';
import {
  User,
  Edit3,
  Check,
  Trophy,
  Bookmark,
  MapPin,
  Accessibility,
  ChevronRight,
  RotateCcw,
  Award,
  Shield,
  Landmark,
  Compass,
  BookOpen,
  Camera,
} from 'lucide-react';
import { ACHIEVEMENT_BADGES, HERITAGE_DESTINATIONS, HERITAGE_QUESTS } from '../data/heritageData';
import { getLevelTitle } from '../hooks/useExplorerStore';
import { ExplorerProfileState, ScreenId } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface ProfileScreenProps {
  profile: ExplorerProfileState;
  onUpdateName: (name: string) => void;
  onResetProgress: () => void;
  onNavigate: (screen: ScreenId, destinationId?: string) => void;
}

const BADGE_ICONS = {
  shield: Shield,
  landmark: Landmark,
  compass: Compass,
  book: BookOpen,
  award: Award,
  camera: Camera,
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateName,
  onResetProgress,
  onNavigate,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(profile.displayName);
  const [resetToast, setResetToast] = useState(false);

  const levelTitle = getLevelTitle(profile.xp);

  const savedDestinations = useMemo(
    () =>
      profile.savedDestinationIds
        .map((id) => HERITAGE_DESTINATIONS.find((d) => d.id === id))
        .filter((d): d is NonNullable<typeof d> => Boolean(d)),
    [profile.savedDestinationIds]
  );

  const visitedDestinations = useMemo(
    () =>
      profile.visitedDestinationIds
        .map((id) => HERITAGE_DESTINATIONS.find((d) => d.id === id))
        .filter((d): d is NonNullable<typeof d> => Boolean(d)),
    [profile.visitedDestinationIds]
  );

  const unlockedBadges = useMemo(
    () => ACHIEVEMENT_BADGES.filter((b) => profile.unlockedBadgeIds.includes(b.id)),
    [profile.unlockedBadgeIds]
  );

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (draftName.trim()) {
      onUpdateName(draftName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8 space-y-6">
      {/* Profile Hero Header */}
      <section className="bg-[#0D3447] text-[#FFF4E3] rounded-3xl p-5 sm:p-6 shadow-md space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-2xl bg-[#F5B942] text-[#0D3447] flex items-center justify-center shrink-0 shadow-sm font-heading font-bold text-2xl">
              {profile.displayName.charAt(0).toUpperCase() || <User className="w-7 h-7" />}
            </div>

            <div className="min-w-0">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    maxLength={24}
                    aria-label="Display name"
                    autoFocus
                    className="min-h-[40px] px-3 py-1 rounded-xl bg-white text-[#0D3447] text-sm font-semibold w-40 sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#F5B942]"
                  />
                  <button
                    type="submit"
                    aria-label="Save profile name"
                    className="min-h-[40px] min-w-[40px] rounded-xl bg-[#16A34A] text-white flex items-center justify-center"
                  >
                    <Check className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-bold text-xl sm:text-2xl text-white truncate">
                    {profile.displayName}
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      setDraftName(profile.displayName);
                      setIsEditingName(true);
                    }}
                    aria-label="Edit profile name"
                    className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-medium inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#F5B942]" aria-hidden="true" />
                    <span>Edit</span>
                  </button>
                </div>
              )}
              <p className="text-xs sm:text-sm text-[#FFF4E3]/80 mt-0.5">{levelTitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('accessibility')}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-[#FFF4E3] text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <Accessibility className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
            <span>Accessibility Settings</span>
          </button>
        </div>

        {/* 4 Progress Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/10 rounded-2xl p-3">
            <p className="text-[11px] text-[#FFF4E3]/75">Total XP</p>
            <p className="font-heading font-bold text-xl text-[#F5B942] tabular-nums">
              {profile.xp}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <p className="text-[11px] text-[#FFF4E3]/75">Quests Done</p>
            <p className="font-heading font-bold text-xl text-white tabular-nums">
              {profile.completedQuestIds.length}/{HERITAGE_QUESTS.length}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <p className="text-[11px] text-[#FFF4E3]/75">Saved Sites</p>
            <p className="font-heading font-bold text-xl text-white tabular-nums">
              {profile.savedDestinationIds.length}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3">
            <p className="text-[11px] text-[#FFF4E3]/75">Visited Sites</p>
            <p className="font-heading font-bold text-xl text-white tabular-nums">
              {profile.visitedDestinationIds.length}
            </p>
          </div>
        </div>
      </section>

      {/* Unlocked Achievement Badges */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-lg text-[#0D3447] hc-heading flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#F5B942]" aria-hidden="true" />
            <span>Unlocked Badges ({unlockedBadges.length})</span>
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('quests')}
            className="min-h-[40px] text-xs font-semibold text-[#0D3447] hc-heading hover:underline"
          >
            Earn more XP
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {unlockedBadges.map((badge) => {
            const Icon = BADGE_ICONS[badge.iconName];
            return (
              <div
                key={badge.id}
                className="bg-white hc-surface rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-[#FFF4E3] text-[#0D3447] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-semibold text-sm text-[#0D3447] hc-heading truncate">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-600 hc-muted line-clamp-2">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Saved & Visited Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-base text-[#0D3447] hc-heading flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#0D3447]" aria-hidden="true" />
            <span>Saved Destinations</span>
          </h2>
          {savedDestinations.length === 0 ? (
            <div className="bg-white hc-surface rounded-2xl border border-slate-200 p-5 text-sm text-slate-500">
              No saved destinations yet. Tap the heart icon on any landmark page to save it.
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedDestinations.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => onNavigate('detail', dest.id)}
                  className="w-full min-h-[64px] bg-white hc-surface rounded-2xl border border-slate-200 p-3 flex items-center gap-3 text-left hover:border-[#0D3447]/40 transition-colors"
                >
                  <ImageWithFallback
                    src={dest.image}
                    alt={dest.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-sm text-[#0D3447] hc-heading truncate">
                      {dest.name}
                    </p>
                    <p className="text-xs text-slate-500 hc-muted truncate">{dest.era}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-semibold text-base text-[#0D3447] hc-heading flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#16A34A]" aria-hidden="true" />
            <span>Visited Locations</span>
          </h2>
          <div className="space-y-2.5">
            {visitedDestinations.map((dest) => (
              <button
                key={dest.id}
                type="button"
                onClick={() => onNavigate('detail', dest.id)}
                className="w-full min-h-[64px] bg-white hc-surface rounded-2xl border border-slate-200 p-3 flex items-center gap-3 text-left hover:border-[#0D3447]/40 transition-colors"
              >
                <ImageWithFallback
                  src={dest.image}
                  alt={dest.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm text-[#0D3447] hc-heading truncate">
                    {dest.name}
                  </p>
                  <p className="text-xs text-slate-500 hc-muted truncate">{dest.location}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Prototype Reset Utility */}
      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500 hc-muted">
          All XP, badges, itinerary stops, and accessibility settings persist in LocalStorage.
        </p>
        <button
          type="button"
          onClick={() => {
            onResetProgress();
            setResetToast(true);
            window.setTimeout(() => setResetToast(false), 2600);
          }}
          className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white hc-surface text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>{resetToast ? 'Demo Progress Reset!' : 'Reset Demo State'}</span>
        </button>
      </div>
    </div>
  );
};
