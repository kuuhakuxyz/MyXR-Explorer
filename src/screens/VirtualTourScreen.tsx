import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Volume2,
  VolumeX,
  Captions,
  Info,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Home,
} from 'lucide-react';
import { HERITAGE_DESTINATIONS, MELAKA_PANORAMA_IMAGE } from '../data/heritageData';
import { AccessibilitySettings, Hotspot, ScreenId } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { speakNarration, stopNarration } from '../utils/speech';

interface VirtualTourScreenProps {
  initialDestinationId: string;
  accessibility: AccessibilitySettings;
  onExit: (screen?: ScreenId, destId?: string) => void;
}

interface TourScene {
  id: string;
  label: string;
  image: string;
  era: string;
  description: string;
  narration: string;
  hotspots: Hotspot[];
}

const TOUR_SCENES: TourScene[] = [
  {
    id: 'melaka-riverfront',
    label: 'Historical Melaka Riverfront',
    image: MELAKA_PANORAMA_IMAGE,
    era: '15th–19th Century Trade Hub',
    description:
      'Panoramic vista across the Melaka River, Dutch Red Square, Tan Kim Seng Bridge, and Jonker Street shophouse rooftops at sunset.',
    narration:
      'Welcome to the 360-degree panoramic tour of Historical Melaka. Drag left or right to look across the Melaka River estuary, connecting the Dutch Civic Square on the left with Peranakan Jonker Street on the right.',
    hotspots: [
      {
        id: 'hs-river-1',
        xPercent: 20,
        yPercent: 46,
        title: 'Dutch Square & Stadthuys',
        era: '1650–1753',
        description:
          'Terracotta-red administrative core of Dutch Melaka, housing the Stadthuys and Christ Church.',
      },
      {
        id: 'hs-river-2',
        xPercent: 50,
        yPercent: 60,
        title: 'Tan Kim Seng Heritage Bridge',
        era: '1862',
        description:
          'Historic crossing uniting Melaka’s European administrative bank with the Chinese merchant quarter.',
      },
      {
        id: 'hs-river-3',
        xPercent: 78,
        yPercent: 48,
        title: 'Jonker Quarter Rooftops',
        era: '17th–19th Century',
        description:
          'Dense rows of Peranakan merchant townhouses with terracotta tiles and interior courtyards.',
      },
    ],
  },
  ...HERITAGE_DESTINATIONS.map((d) => ({
    id: d.id,
    label: d.shortName,
    image: d.image,
    era: d.era,
    description: d.description,
    narration: d.narrationScript,
    hotspots: d.tourHotspots,
  })),
];

export const VirtualTourScreen: React.FC<VirtualTourScreenProps> = ({
  initialDestinationId,
  accessibility,
  onExit,
}) => {
  const initialIndex = Math.max(
    0,
    TOUR_SCENES.findIndex((s) => s.id === initialDestinationId)
  );
  const [sceneIndex, setSceneIndex] = useState(0);
  // Allow jumping to destination if explicitly requested, default to panoramic Melaka riverfront if a-famosa
  useEffect(() => {
    if (initialDestinationId && initialDestinationId !== 'a-famosa' && initialIndex > 0) {
      setSceneIndex(initialIndex);
    }
  }, [initialDestinationId, initialIndex]);

  const scene = TOUR_SCENES[sceneIndex] || TOUR_SCENES[0];

  const [panPercent, setPanPercent] = useState(50); // 0 to 100
  const [zoom, setZoom] = useState(1.15);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(accessibility.subtitles);

  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);

  useEffect(() => {
    setSelectedHotspot(null);
    setPanPercent(50);
  }, [sceneIndex]);

  useEffect(() => {
    return () => stopNarration();
  }, []);

  const bearingDegrees = Math.round((panPercent / 100) * 360);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    setPanPercent((prev) => Math.max(5, Math.min(95, prev - deltaX * 0.14)));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleStepPan = (delta: number) => {
    setPanPercent((prev) => Math.max(5, Math.min(95, prev + delta)));
  };

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      stopNarration();
      setIsAudioPlaying(false);
    } else {
      setIsAudioPlaying(true);
      if (accessibility.audioNarration) {
        speakNarration(scene.narration, accessibility.language);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#091B26] text-white overflow-hidden flex flex-col justify-between select-none">
      {/* Interactive Draggable Panoramic Canvas */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden touch-pan-y"
        role="region"
        aria-label={`360-degree simulated panoramic view of ${scene.label}. Drag horizontally or use directional controls to rotate viewpoint.`}
      >
        <div
          className="relative w-[180%] sm:w-[155%] h-full transition-transform duration-150 ease-out"
          style={{
            transform: `translateX(-${((panPercent - 5) / 90) * 35}%) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <ImageWithFallback
            src={scene.image}
            alt={`Panoramic view of ${scene.label}`}
            fallbackTitle={scene.label}
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* Interactive Hotspots anchored onto panoramic canvas */}
          {scene.hotspots.map((hs) => {
            const active = selectedHotspot?.id === hs.id;
            return (
              <button
                key={hs.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHotspot(active ? null : hs);
                }}
                style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
                className={`-translate-x-1/2 -translate-y-1/2 absolute min-h-[44px] px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold flex items-center gap-2 shadow-xl transition-all ${
                  active
                    ? 'bg-[#F5B942] text-[#0D3447] scale-105'
                    : 'bg-[#0D3447]/90 text-[#FFF4E3] border-2 border-[#F5B942] hover:scale-105'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-current shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{hs.title}</span>
              </button>
            );
          })}
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Top HUD: 360° Indicator, Compass Bearing & Exit */}
      <header className="relative z-20 p-4 sm:px-6 flex items-start justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto bg-[#0D3447]/85 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-[#F5B942] font-semibold">
            <Compass className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>360° Virtual Tour</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{bearingDegrees}°</span>
          </div>
          <h1 className="font-heading font-bold text-base sm:text-lg text-white mt-0.5">
            {scene.label}
          </h1>
          <p className="text-[11px] text-[#FFF4E3]/80">
            Drag scene or use arrows to explore · {scene.era}
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowInfoPanel((p) => !p)}
            aria-label="Toggle destination information"
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl backdrop-blur-md border transition-colors ${
              showInfoPanel
                ? 'bg-[#F5B942] text-[#0D3447] border-[#F5B942]'
                : 'bg-black/55 text-white border-white/20 hover:bg-black/75'
            }`}
          >
            <Info className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onExit('home')}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Home className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
            <span>Exit Tour</span>
          </button>
        </div>
      </header>

      {/* Center Overlay: Hotspot Detail or Info Panel */}
      <div className="relative z-20 px-4 sm:px-6 flex flex-col items-center gap-3 pointer-events-none">
        {selectedHotspot && (
          <div className="pointer-events-auto bg-white text-[#1E293B] rounded-2xl p-4 shadow-2xl max-w-md w-full border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Hotspot · {selectedHotspot.era}
                </p>
                <h2 className="font-heading font-bold text-base text-[#0D3447] mt-0.5">
                  {selectedHotspot.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHotspot(null)}
                aria-label="Close hotspot details"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {selectedHotspot.description}
            </p>
          </div>
        )}

        {showInfoPanel && (
          <div className="pointer-events-auto bg-[#0D3447]/95 backdrop-blur-md border border-[#F5B942]/40 text-[#FFF4E3] rounded-2xl p-4 shadow-2xl max-w-md w-full space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-sm text-[#F5B942]">
                About {scene.label}
              </h2>
              <button
                type="button"
                onClick={() => setShowInfoPanel(false)}
                aria-label="Close information panel"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs leading-relaxed text-[#FFF4E3]/90">{scene.description}</p>
          </div>
        )}
      </div>

      {/* Bottom Controls: Directional Nav, Subtitles, Audio Guide & Location Switcher */}
      <footer className="relative z-20 p-4 sm:px-6 pb-6 space-y-3 max-w-3xl mx-auto w-full">
        {showSubtitles && (
          <div className="bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#FFF4E3]">
            <span className="text-[#F5B942] font-semibold mr-1.5">Subtitle:</span>
            {scene.narration}
          </div>
        )}

        {/* Directional Controls + Audio / Subtitles */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0D3447]/90 backdrop-blur-md border border-white/15 rounded-2xl p-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleStepPan(-12)}
              aria-label="Pan view left"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleStepPan(12)}
              aria-label="Pan view right"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
              aria-label="Zoom in"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1.0, Number((z - 0.1).toFixed(2))))}
              aria-label="Zoom out"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setPanPercent(50);
                setZoom(1.15);
              }}
              aria-label="Reset camera orientation"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSubtitles((s) => !s)}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                showSubtitles
                  ? 'bg-[#FFF4E3] text-[#0D3447]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Captions className="w-4 h-4" aria-hidden="true" />
              <span>Subtitles</span>
            </button>

            <button
              type="button"
              onClick={handleToggleAudio}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isAudioPlaying
                  ? 'bg-[#F5B942] text-[#0D3447]'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {isAudioPlaying ? (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
              )}
              <span>{isAudioPlaying ? 'Pause Guide' : 'Audio Guide'}</span>
            </button>
          </div>
        </div>

        {/* Location Switcher Strip */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
          role="tablist"
          aria-label="Virtual Tour Locations"
        >
          {TOUR_SCENES.map((item, idx) => {
            const active = idx === sceneIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSceneIndex(idx)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#F5B942] text-[#0D3447]'
                    : 'bg-black/55 backdrop-blur-md text-[#FFF4E3] border border-white/15 hover:bg-black/75'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
