import { useCallback, useEffect, useState } from 'react';
import { NavigationShell } from './components/NavigationShell';
import { useExplorerStore } from './hooks/useExplorerStore';
import { TRANSLATIONS } from './i18n/translations';
import { ScreenId } from './types';
import { HERITAGE_DESTINATIONS } from './data/heritageData';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { ARLensScreen } from './screens/ARLensScreen';
import { VirtualTourScreen } from './screens/VirtualTourScreen';
import { QuestScreen } from './screens/QuestScreen';
import { PlannerScreen } from './screens/PlannerScreen';
import { AccessibilityScreen } from './screens/AccessibilityScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DestinationDetailScreen } from './screens/DestinationDetailScreen';

const VALID_SCREENS: ScreenId[] = [
  'home',
  'explore',
  'ar-lens',
  'virtual-tour',
  'quests',
  'planner',
  'accessibility',
  'profile',
  'detail',
];

function parseHashRoute(): { screen: ScreenId; destinationId: string } {
  if (typeof window === 'undefined') {
    return { screen: 'home', destinationId: 'a-famosa' };
  }
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!raw) {
    return { screen: 'home', destinationId: 'a-famosa' };
  }
  const [screenPart, destPart] = raw.split('/');
  const screen = VALID_SCREENS.includes(screenPart as ScreenId)
    ? (screenPart as ScreenId)
    : 'home';
  const validDest =
    destPart && HERITAGE_DESTINATIONS.some((d) => d.id === destPart)
      ? destPart
      : 'a-famosa';
  return { screen, destinationId: validDest };
}

export default function App() {
  const {
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
  } = useExplorerStore();

  const initialRoute = parseHashRoute();
  const [activeScreen, setActiveScreen] = useState<ScreenId>(initialRoute.screen);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>(
    initialRoute.destinationId
  );
  const [historyStack, setHistoryStack] = useState<ScreenId[]>([]);
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(false);
  const [isTransitioningXr, setIsTransitioningXr] = useState<boolean>(false);

  const t = TRANSLATIONS[accessibility.language] || TRANSLATIONS.en;

  const handleNavigate = useCallback(
    (screen: ScreenId, destinationId?: string) => {
      if (destinationId) {
        setSelectedDestinationId(destinationId);
        if (screen === 'detail' || screen === 'ar-lens' || screen === 'virtual-tour') {
          recordVisitedDestination(destinationId);
        }
      }

      if (screen !== activeScreen) {
        setHistoryStack((prev) => [...prev.slice(-8), activeScreen]);
      }

      if ((screen === 'ar-lens' || screen === 'virtual-tour') && !accessibility.reducedMotion) {
        setIsTransitioningXr(true);
        window.setTimeout(() => setIsTransitioningXr(false), 320);
      }

      setActiveScreen(screen);
      window.scrollTo({ top: 0, behavior: accessibility.reducedMotion ? 'auto' : 'smooth' });
    },
    [activeScreen, accessibility.reducedMotion, recordVisitedDestination]
  );

  const handleBack = useCallback(() => {
    setHistoryStack((prev) => {
      if (prev.length === 0) {
        setActiveScreen('home');
        return prev;
      }
      const next = [...prev];
      const previousScreen = next.pop() || 'home';
      setActiveScreen(previousScreen);
      return next;
    });
  }, []);

  // Sync URL hash and handle browser Back/Forward or unknown hashes gracefully
  useEffect(() => {
    const destScreens: ScreenId[] = ['detail', 'ar-lens', 'virtual-tour'];
    const targetHash =
      activeScreen === 'home'
        ? ''
        : destScreens.includes(activeScreen)
        ? `#/${activeScreen}/${selectedDestinationId}`
        : `#/${activeScreen}`;

    if (window.location.hash !== targetHash) {
      if (targetHash) {
        window.location.hash = targetHash;
      } else if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [activeScreen, selectedDestinationId]);

  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashRoute();
      setActiveScreen(parsed.screen);
      setSelectedDestinationId(parsed.destinationId);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const renderScreen = () => {
    if (isTransitioningXr) {
      return (
        <div className="min-h-screen bg-[#0D3447] text-[#FFF4E3] flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-[#F5B942] border-t-transparent animate-spin" />
          <p className="font-heading font-semibold text-base">
            Initializing XR Heritage Environment...
          </p>
          <p className="text-xs text-[#FFF4E3]/75">Calibrating Melaka landmark anchors</p>
        </div>
      );
    }

    switch (activeScreen) {
      case 'home':
        return (
          <HomeScreen
            profile={profile}
            accessibility={accessibility}
            t={t}
            onNavigate={handleNavigate}
          />
        );
      case 'explore':
        return <ExploreScreen profile={profile} onNavigate={handleNavigate} />;
      case 'ar-lens':
        return (
          <ARLensScreen
            destinationId={selectedDestinationId}
            accessibility={accessibility}
            onRecordCapture={recordArCapture}
            onExit={(nextScreen, destId) =>
              handleNavigate(nextScreen || 'home', destId || selectedDestinationId)
            }
          />
        );
      case 'virtual-tour':
        return (
          <VirtualTourScreen
            initialDestinationId={selectedDestinationId}
            accessibility={accessibility}
            onExit={(nextScreen, destId) =>
              handleNavigate(nextScreen || 'home', destId || selectedDestinationId)
            }
          />
        );
      case 'quests':
        return (
          <QuestScreen
            profile={profile}
            accessibility={accessibility}
            onCompleteQuest={completeQuest}
          />
        );
      case 'planner':
        return (
          <PlannerScreen
            profile={profile}
            onToggleItinerary={toggleItineraryDestination}
            onMoveItem={moveItineraryItem}
            onRemoveItem={removeItineraryItem}
            onToggleAccessibleRoute={toggleAccessibleRoute}
            onNavigate={handleNavigate}
          />
        );
      case 'accessibility':
        return (
          <AccessibilityScreen
            settings={accessibility}
            t={t}
            onUpdate={setAccessibility}
            onBack={(screen) => handleNavigate(screen)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            onUpdateName={updateDisplayName}
            onResetProgress={resetProgress}
            onNavigate={handleNavigate}
          />
        );
      case 'detail':
        return (
          <DestinationDetailScreen
            destinationId={selectedDestinationId}
            profile={profile}
            onToggleFavorite={toggleSavedDestination}
            onAddToTrip={addToItinerary}
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        );
      default:
        return (
          <HomeScreen
            profile={profile}
            accessibility={accessibility}
            t={t}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <NavigationShell
      activeScreen={activeScreen}
      onNavigate={handleNavigate}
      t={t}
      xp={profile.xp}
      accessibility={accessibility}
      phoneFrameMode={phoneFrameMode}
      onTogglePhoneFrame={() => setPhoneFrameMode((p) => !p)}
    >
      {renderScreen()}
    </NavigationShell>
  );
}
