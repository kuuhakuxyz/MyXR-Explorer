import { useEffect, useState } from 'react';
import { DEFAULT_PROFILE_STATE } from '../data/heritageData';
import { AccessibilitySettings, ExplorerProfileState } from '../types';

const PROFILE_STORAGE_KEY = 'myxr_explorer_profile_v1';
const ACCESSIBILITY_STORAGE_KEY = 'myxr_explorer_accessibility_v1';

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  language: 'en',
  textSize: 'medium',
  audioNarration: true,
  subtitles: true,
  reducedMotion: false,
  voiceNavigation: false,
  simplifiedUi: false,
  highContrast: false,
};

function safeReadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export function getLevelTitle(xp: number): string {
  if (xp >= 550) return 'Master Heritage Guardian';
  if (xp >= 450) return 'Senior Cultural Chronicler';
  return 'Heritage Explorer';
}

export function useExplorerStore() {
  const [profile, setProfile] = useState<ExplorerProfileState>(() =>
    safeReadStorage<ExplorerProfileState>(PROFILE_STORAGE_KEY, DEFAULT_PROFILE_STATE)
  );

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() =>
    safeReadStorage<AccessibilitySettings>(
      ACCESSIBILITY_STORAGE_KEY,
      DEFAULT_ACCESSIBILITY_SETTINGS
    )
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage quota errors in private mode
    }
  }, [profile]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(accessibility));
    } catch {
      // Ignore storage quota errors
    }

    const root = document.documentElement;
    root.setAttribute('data-text-size', accessibility.textSize);
    root.setAttribute('data-reduced-motion', String(accessibility.reducedMotion));
    root.setAttribute('data-contrast', accessibility.highContrast ? 'high' : 'normal');
    root.lang = accessibility.language;
  }, [accessibility]);

  const updateDisplayName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setProfile((prev) => ({ ...prev, displayName: trimmed }));
  };

  const toggleSavedDestination = (destinationId: string): boolean => {
    let nowSaved = false;
    setProfile((prev) => {
      const exists = prev.savedDestinationIds.includes(destinationId);
      nowSaved = !exists;
      const savedDestinationIds = exists
        ? prev.savedDestinationIds.filter((id) => id !== destinationId)
        : [destinationId, ...prev.savedDestinationIds];
      return { ...prev, savedDestinationIds };
    });
    return nowSaved;
  };

  const recordVisitedDestination = (destinationId: string) => {
    setProfile((prev) => {
      const visitedDestinationIds = prev.visitedDestinationIds.includes(destinationId)
        ? prev.visitedDestinationIds
        : [...prev.visitedDestinationIds, destinationId];
      const recentlyExploredIds = [
        destinationId,
        ...prev.recentlyExploredIds.filter((id) => id !== destinationId),
      ].slice(0, 5);
      return { ...prev, visitedDestinationIds, recentlyExploredIds };
    });
  };

  const completeQuest = (questId: string, xpReward: number, badgeId: string): boolean => {
    let newlyCompleted = false;
    setProfile((prev) => {
      if (prev.completedQuestIds.includes(questId)) {
        return prev;
      }
      newlyCompleted = true;
      return {
        ...prev,
        xp: prev.xp + xpReward,
        completedQuestIds: [...prev.completedQuestIds, questId],
        unlockedBadgeIds: prev.unlockedBadgeIds.includes(badgeId)
          ? prev.unlockedBadgeIds
          : [...prev.unlockedBadgeIds, badgeId],
      };
    });
    return newlyCompleted;
  };

  const recordArCapture = () => {
    setProfile((prev) => ({
      ...prev,
      capturedMomentsCount: prev.capturedMomentsCount + 1,
      unlockedBadgeIds: prev.unlockedBadgeIds.includes('badge-ar-pioneer')
        ? prev.unlockedBadgeIds
        : [...prev.unlockedBadgeIds, 'badge-ar-pioneer'],
    }));
  };

  const toggleItineraryDestination = (destinationId: string): boolean => {
    let added = false;
    setProfile((prev) => {
      const exists = prev.itineraryIds.includes(destinationId);
      added = !exists;
      const itineraryIds = exists
        ? prev.itineraryIds.filter((id) => id !== destinationId)
        : [...prev.itineraryIds, destinationId];
      return { ...prev, itineraryIds };
    });
    return added;
  };

  const addToItinerary = (destinationId: string): boolean => {
    let added = false;
    setProfile((prev) => {
      if (prev.itineraryIds.includes(destinationId)) return prev;
      added = true;
      return { ...prev, itineraryIds: [...prev.itineraryIds, destinationId] };
    });
    return added;
  };

  const moveItineraryItem = (index: number, direction: -1 | 1) => {
    setProfile((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.itineraryIds.length) return prev;
      const next = [...prev.itineraryIds];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return { ...prev, itineraryIds: next };
    });
  };

  const removeItineraryItem = (destinationId: string) => {
    setProfile((prev) => ({
      ...prev,
      itineraryIds: prev.itineraryIds.filter((id) => id !== destinationId),
    }));
  };

  const toggleAccessibleRoute = () => {
    setProfile((prev) => ({ ...prev, accessibleRoute: !prev.accessibleRoute }));
  };

  const resetProgress = () => {
    setProfile(DEFAULT_PROFILE_STATE);
    setAccessibility(DEFAULT_ACCESSIBILITY_SETTINGS);
  };

  return {
    profile,
    accessibility,
    setAccessibility,
    updateDisplayName,
    toggleSavedDestination,
    recordVisitedDestination,
    completeQuest,
    recordArCapture,
    toggleItineraryDestination,
    addToItinerary,
    moveItineraryItem,
    removeItineraryItem,
    toggleAccessibleRoute,
    resetProgress,
  };
}
