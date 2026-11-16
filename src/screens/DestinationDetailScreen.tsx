import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Clock,
  Camera,
  Globe,
  Plus,
  Check,
  Accessibility,
  CheckCircle2,
  CalendarClock,
} from 'lucide-react';
import { HERITAGE_DESTINATIONS } from '../data/heritageData';
import { ExplorerProfileState, ScreenId } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface DestinationDetailScreenProps {
  destinationId: string;
  profile: ExplorerProfileState;
  onToggleFavorite: (id: string) => boolean;
  onAddToTrip: (id: string) => boolean;
  onNavigate: (screen: ScreenId, destinationId?: string) => void;
  onBack: () => void;
}

export const DestinationDetailScreen: React.FC<DestinationDetailScreenProps> = ({
  destinationId,
  profile,
  onToggleFavorite,
  onAddToTrip,
  onNavigate,
  onBack,
}) => {
  const destination =
    HERITAGE_DESTINATIONS.find((d) => d.id === destinationId) || HERITAGE_DESTINATIONS[0];

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isSaved = profile.savedDestinationIds.includes(destination.id);
  const inTrip = profile.itineraryIds.includes(destination.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 2600);
  };

  const handleFavorite = () => {
    const nowSaved = onToggleFavorite(destination.id);
    showToast(
      nowSaved
        ? `${destination.shortName} saved to your Profile favorites.`
        : `${destination.shortName} removed from saved destinations.`
    );
  };

  const handleAddToTrip = () => {
    if (inTrip) {
      onNavigate('planner');
      return;
    }
    onAddToTrip(destination.id);
    showToast(`${destination.shortName} added to your Smart Trip Planner.`);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Large Hero Image */}
      <div className="relative h-72 sm:h-96 w-full bg-[#0D3447] overflow-hidden lg:rounded-b-3xl">
        <ImageWithFallback
          src={destination.image}
          alt={destination.name}
          fallbackTitle={destination.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0D3447] via-[#0D3447]/35 to-black/35"
          aria-hidden="true"
        />

        {/* Top Bar Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleFavorite}
            aria-label={isSaved ? 'Remove from favorites' : 'Save destination'}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl backdrop-blur-md border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-[#F5B942] text-[#0D3447] border-[#F5B942]'
                : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
              aria-hidden="true"
            />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Hero Title Content */}
        <div className="absolute bottom-5 left-4 right-4 sm:left-6 sm:right-6 text-white space-y-1.5">
          <p className="text-xs text-[#FFF4E3]/90 font-medium">
            {destination.category} · {destination.era}
          </p>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl leading-tight">
            {destination.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#FFF4E3]/90 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#F5B942] shrink-0" aria-hidden="true" />
            <span>{destination.location}</span>
          </p>
        </div>
      </div>

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="px-4 sm:px-6 mt-4">
          <div
            role="status"
            className="bg-[#16A34A] text-white rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Primary Action Strip */}
      <div className="px-4 sm:px-6 mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onNavigate('ar-lens', destination.id)}
          className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#0D3447] hover:bg-[#134B66] text-[#FFF4E3] font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Camera className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
          <span>AR Preview</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('virtual-tour', destination.id)}
          className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#FFF4E3] hc-surface-alt hover:bg-[#fde8c8] text-[#0D3447] font-semibold text-sm inline-flex items-center justify-center gap-2 border border-[#F5B942]/40 transition-colors"
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span>Virtual Tour</span>
        </button>

        <button
          type="button"
          onClick={handleAddToTrip}
          className={`min-h-[48px] px-4 py-3 rounded-2xl font-semibold text-sm inline-flex items-center justify-center gap-2 border transition-colors ${
            inTrip
              ? 'bg-[#16A34A]/15 text-[#14532D] border-[#16A34A]/40'
              : 'bg-white hc-surface text-[#0D3447] border-slate-200 hover:bg-slate-50'
          }`}
        >
          {inTrip ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>In Trip (View Planner)</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add to Trip</span>
            </>
          )}
        </button>
      </div>

      {/* Main Detail Sections */}
      <div className="px-4 sm:px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          <section className="bg-white hc-surface rounded-2xl border border-slate-200 p-5 space-y-3">
            <h2 className="font-heading font-semibold text-lg text-[#0D3447] hc-heading">
              Historical Overview
            </h2>
            <p className="text-sm text-slate-700 hc-muted leading-relaxed">
              {destination.description}
            </p>
            <p className="text-sm text-slate-700 hc-muted leading-relaxed">
              {destination.historicalSummary}
            </p>
          </section>

          <section className="bg-white hc-surface rounded-2xl border border-slate-200 p-5 space-y-3">
            <h2 className="font-heading font-semibold text-lg text-[#0D3447] hc-heading">
              Architectural Highlights
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-700 hc-muted">
              {destination.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full bg-[#F5B942] mt-1.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:col-span-5 space-y-4">
          <div className="bg-white hc-surface rounded-2xl border border-slate-200 p-5 space-y-4">
            <h2 className="font-heading font-semibold text-base text-[#0D3447] hc-heading">
              Visitor Information
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#0D3447] hc-heading shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#0D3447] hc-heading">
                    Estimated Visit Duration
                  </p>
                  <p className="text-slate-600 hc-muted">{destination.visitDuration}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarClock
                  className="w-5 h-5 text-[#0D3447] hc-heading shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#0D3447] hc-heading">
                    Opening Hours (Sample Data)
                  </p>
                  <p className="text-slate-600 hc-muted">{destination.sampleOpeningHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Accessibility
                  className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#0D3447] hc-heading">Accessibility Notes</p>
                  <p className="text-slate-600 hc-muted">{destination.accessibilityNote}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
