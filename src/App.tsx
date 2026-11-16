import { useCallback, useEffect, useState } from 'react';
import { NavigationShell } from './components/NavigationShell';
import { useExplorerStore } from './hooks/useExplorerStore';
import { TRANSLATIONS } from './i18n/translations';
import { ScreenId } from './types';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { ARLensScreen } from './screens/ARLensScreen';
import { VirtualTourScreen } from './screens/VirtualTourScreen';
import { QuestScreen } from './screens/QuestScreen';
import { PlannerScreen } from './screens/PlannerScreen';
import { AccessibilityScreen } from './screens/AccessibilityScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DestinationDetailScreen } from './screens/DestinationDetailScreen';

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

  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('a-famosa');
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

  // Support browser back/hash navigation cleanly
  useEffect(() => {
    window.location.hash = activeScreen === 'home' ? '' : `#${activeScreen}`;
  }, [activeScreen]);

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
