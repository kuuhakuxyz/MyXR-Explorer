import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Info,
  Volume2,
  VolumeX,
  Camera,
  History,
  CheckCircle2,
  Scan,
  Sparkles,
  Video,
} from 'lucide-react';
import { HERITAGE_DESTINATIONS } from '../data/heritageData';
import { AccessibilitySettings, ScreenId } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { speakNarration, stopNarration } from '../utils/speech';

interface ARLensScreenProps {
  destinationId: string;
  accessibility: AccessibilitySettings;
  onRecordCapture: () => void;
  onExit: (screen?: ScreenId, destId?: string) => void;
}

export const ARLensScreen: React.FC<ARLensScreenProps> = ({
  destinationId,
  accessibility,
  onRecordCapture,
  onExit,
}) => {
  const destination =
    HERITAGE_DESTINATIONS.find((d) => d.id === destinationId) || HERITAGE_DESTINATIONS[0];

  const [viewMode, setViewMode] = useState<'present' | 'historical'>('present');
  const [isScanning, setIsScanning] = useState(true);
  const [scanComplete, setScanComplete] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [captureFeedback, setCaptureFeedback] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  // Optional camera attempt only when user explicitly presses "Use Device Camera"
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setIsScanning(true);
    setScanComplete(false);
    const timer = window.setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [destination.id]);

  useEffect(() => {
    return () => {
      stopNarration();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleToggleNarration = () => {
    if (isNarrating) {
      stopNarration();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      if (accessibility.audioNarration) {
        speakNarration(destination.narrationScript, accessibility.language);
      }
    }
  };

  const handleToggleHistoricalView = () => {
    setViewMode((prev) => (prev === 'present' ? 'historical' : 'present'));
  };

  const handleCapture = () => {
    setFlashEffect(true);
    window.setTimeout(() => setFlashEffect(false), 180);
    onRecordCapture();
    setCaptureFeedback(true);
    window.setTimeout(() => setCaptureFeedback(false), 3200);
  };

  const handleTryLiveCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Live camera preview is unavailable on this browser; showing simulated AR scene.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setCameraActive(true);
      setCameraError(null);
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch {
      setCameraError('Camera permission declined or unavailable; displaying simulated AR heritage view.');
    }
  };

  const activeCallout = destination.arCallouts.find((c) => c.id === activeCalloutId);
  const displayImage =
    viewMode === 'historical' && destination.historicalImage
      ? destination.historicalImage
      : destination.image;

  return (
    <div className="relative min-h-screen w-full bg-[#091B26] text-white overflow-hidden flex flex-col justify-between select-none">
      {/* Background Simulated AR Scene or Live Camera Feed */}
      <div className="absolute inset-0">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageWithFallback
            src={displayImage}
            alt={`${destination.name} - ${viewMode} view`}
            fallbackTitle={destination.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              viewMode === 'historical' ? 'sepia-[0.12] contrast-[1.06]' : ''
            }`}
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/80"
          aria-hidden="true"
        />
      </div>

      {/* Camera Flash Effect */}
      {flashEffect && (
        <div className="absolute inset-0 bg-white/80 z-50 pointer-events-none" aria-hidden="true" />
      )}

      {/* AR Corner Scanning Brackets & Sweep */}
      <div className="absolute inset-x-6 sm:inset-x-16 top-24 bottom-48 pointer-events-none z-10">
        <div className="relative w-full h-full max-w-2xl mx-auto">
          {/* 4 Corner Brackets */}
          <div className="absolute top-0 left-0 w-9 h-9 border-t-2 border-l-2 border-[#F5B942] rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-9 h-9 border-t-2 border-r-2 border-[#F5B942] rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-9 h-9 border-b-2 border-l-2 border-[#F5B942] rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-9 h-9 border-b-2 border-r-2 border-[#F5B942] rounded-br-xl" />

          {/* Animated AR Scan Line */}
          {isScanning && !accessibility.reducedMotion && (
            <div className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#F5B942] to-transparent shadow-[0_0_12px_#F5B942] animate-ar-scan" />
          )}
        </div>
      </div>

      {/* Interactive Spatial AR Callout Nodes */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {destination.arCallouts.map((callout) => {
          const selected = callout.id === activeCalloutId;
          return (
            <button
              key={callout.id}
              type="button"
              onClick={() => setActiveCalloutId(selected ? null : callout.id)}
              style={{ left: `${callout.xPercent}%`, top: `${callout.yPercent}%` }}
              className={`pointer-events-auto -translate-x-1/2 -translate-y-1/2 absolute min-h-[44px] px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg ${
                selected
                  ? 'bg-[#F5B942] text-[#0D3447] scale-105'
                  : 'bg-[#0D3447]/85 text-[#FFF4E3] border border-[#F5B942]/60 hover:bg-[#0D3447]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{callout.label}</span>
            </button>
          );
        })}
      </div>

      {/* Top Overlay Bar */}
      <header className="relative z-30 p-4 sm:px-6 flex items-start justify-between gap-3">
        <div className="bg-[#0D3447]/85 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 max-w-[260px] sm:max-w-md">
          <div className="flex items-center gap-2 text-[11px] text-[#F5B942] font-medium">
            <Scan className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              {isScanning
                ? 'Simulated AR Recognition Scanning...'
                : viewMode === 'historical'
                ? `Simulated Reconstruction (${destination.historicalYear || '16th Century'})`
                : 'Simulated AR Overlay Ready'}
            </span>
          </div>
          <h1 className="font-heading font-bold text-base sm:text-lg text-white leading-snug mt-0.5">
            {destination.name}
          </h1>
          <p className="text-[11px] text-[#FFF4E3]/80">{destination.location}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleTryLiveCamera}
            aria-label={cameraActive ? 'Switch to simulated scene' : 'Try live device camera'}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-[#0D3447]/85 backdrop-blur-md border border-white/20 text-xs font-medium text-[#FFF4E3] hover:bg-[#0D3447] inline-flex items-center gap-1.5"
          >
            <Video className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
            <span className="hidden sm:inline">{cameraActive ? 'Simulated View' : 'Live Cam'}</span>
          </button>

          <button
            type="button"
            onClick={() => onExit('home')}
            aria-label="Exit AR Heritage Lens"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Camera fallback notice or active callout detail */}
      <div className="relative z-30 px-4 sm:px-6 flex flex-col items-center gap-2 pointer-events-none">
        {cameraError && (
          <div className="pointer-events-auto bg-[#0D3447]/90 border border-[#F5B942]/50 text-[#FFF4E3] px-3.5 py-2 rounded-xl text-xs max-w-md text-center">
            {cameraError}
          </div>
        )}

        {activeCallout && (
          <div className="pointer-events-auto bg-white text-[#1E293B] rounded-2xl p-3.5 shadow-xl max-w-sm w-full border border-slate-200 flex items-start justify-between gap-3">
            <div>
              <p className="font-heading font-semibold text-sm text-[#0D3447]">
                {activeCallout.label}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{activeCallout.detail}</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveCalloutId(null)}
              aria-label="Close annotation"
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {captureFeedback && (
          <div
            role="status"
            className="pointer-events-auto bg-[#16A34A] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>AR Heritage Moment captured to Profile! Badge progress updated.</span>
          </div>
        )}
      </div>

      {/* Bottom Interactive Dock */}
      <footer className="relative z-30 p-4 sm:px-6 pb-6 space-y-3 max-w-2xl mx-auto w-full">
        {/* Live Audio Subtitles */}
        {(isNarrating || (accessibility.subtitles && scanComplete)) && (
          <div className="bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#FFF4E3] leading-relaxed">
            <span className="font-semibold text-[#F5B942] mr-1.5">
              {isNarrating ? 'Audio Guide:' : 'AR Context:'}
            </span>
            {isNarrating
              ? destination.narrationScript
              : viewMode === 'historical'
              ? destination.historicalSummary
              : `Viewing ${destination.name}. Tap any spatial marker or switch to Historical View.`}
          </div>
        )}

        {/* Present / Historical Segmented Switch + Primary Reconstruction CTA */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#0D3447]/90 backdrop-blur-md border border-white/15 rounded-2xl p-2">
          <div className="flex items-center bg-black/30 rounded-xl p-1" role="group" aria-label="View Mode">
            <button
              type="button"
              onClick={() => setViewMode('present')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'present'
                  ? 'bg-white text-[#0D3447]'
                  : 'text-[#FFF4E3]/80 hover:text-white'
              }`}
            >
              Present View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('historical')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'historical'
                  ? 'bg-[#F5B942] text-[#0D3447]'
                  : 'text-[#FFF4E3]/80 hover:text-white'
              }`}
            >
              Historical View
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleHistoricalView}
            className="min-h-[44px] flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#F5B942] hover:bg-[#eab035] text-[#0D3447] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <History className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {viewMode === 'present'
                ? 'View Historical Reconstruction'
                : 'Return to Present Day'}
            </span>
          </button>
        </div>

        {/* Bottom Tool Strip: Info Card, Narration, Capture, Re-scan */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="min-h-[48px] flex-1 px-3 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Info className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
            <span>Landmark Info</span>
          </button>

          <button
            type="button"
            onClick={handleCapture}
            aria-label="Capture AR Moment"
            className="min-h-[56px] min-w-[56px] w-14 h-14 rounded-full bg-white text-[#0D3447] ring-4 ring-[#F5B942]/60 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform shrink-0"
          >
            <Camera className="w-6 h-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleToggleNarration}
            className={`min-h-[48px] flex-1 px-3 py-2.5 rounded-2xl backdrop-blur-md border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
              isNarrating
                ? 'bg-[#F5B942] text-[#0D3447] border-[#F5B942]'
                : 'bg-white/15 hover:bg-white/25 border-white/20 text-white'
            }`}
          >
            {isNarrating ? (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
            )}
            <span>{isNarrating ? 'Stop Audio' : 'Audio Guide'}</span>
          </button>
        </div>
      </footer>

      {/* Historical Information Modal */}
      {showInfoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${destination.name} Historical Notes`}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div className="bg-white hc-surface text-[#1E293B] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 hc-muted">
                  Simulated AR Reconstruction Guide · {destination.era}
                </p>
                <h2 className="font-heading font-bold text-xl text-[#0D3447] hc-heading mt-0.5">
                  {destination.historicalTitle || destination.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                aria-label="Close modal"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-sm text-slate-700 hc-muted leading-relaxed">
              {destination.historicalSummary}
            </p>

            <div className="bg-[#FFF4E3] hc-surface-alt rounded-2xl p-4 space-y-2">
              <p className="font-heading font-semibold text-xs text-[#0D3447] hc-heading flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" aria-hidden="true" />
                <span>Prototype Transparency Note</span>
              </p>
              <p className="text-xs text-slate-700 hc-muted leading-relaxed">
                This prototype demonstrates simulated AR architectural overlays using curated historical illustrations. Production deployment would pair GPS anchors with on-device WebXR plane tracking.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowInfoModal(false);
                  onExit('detail', destination.id);
                }}
                className="min-h-[44px] flex-1 px-4 py-2.5 rounded-xl bg-[#0D3447] text-white text-sm font-semibold"
              >
                Full Landmark Details
              </button>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
