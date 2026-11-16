import React, { useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Plus,
  Check,
  Trash2,
  ArrowUp,
  ArrowDown,
  Accessibility,
  Navigation,
  Camera,
  Clock,
  X,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { HERITAGE_DESTINATIONS } from '../data/heritageData';
import { ExplorerProfileState, ScreenId } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface PlannerScreenProps {
  profile: ExplorerProfileState;
  onToggleItinerary: (id: string) => boolean;
  onMoveItem: (index: number, direction: -1 | 1) => void;
  onRemoveItem: (id: string) => void;
  onToggleAccessibleRoute: () => void;
  onNavigate: (screen: ScreenId, destinationId?: string) => void;
}

export const PlannerScreen: React.FC<PlannerScreenProps> = ({
  profile,
  onToggleItinerary,
  onMoveItem,
  onRemoveItem,
  onToggleAccessibleRoute,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapPinId, setSelectedMapPinId] = useState<string>('a-famosa');
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [activeNavStep, setActiveNavStep] = useState(0);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const filteredDestinations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return HERITAGE_DESTINATIONS;
    return HERITAGE_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.shortName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const itineraryStops = useMemo(
    () =>
      profile.itineraryIds
        .map((id) => HERITAGE_DESTINATIONS.find((d) => d.id === id))
        .filter((d): d is NonNullable<typeof d> => Boolean(d)),
    [profile.itineraryIds]
  );

  // Calculate estimated walk & visit time (accessible route adds gentle buffer for step-free ramps)
  const travelStats = useMemo(() => {
    if (itineraryStops.length === 0) return { walkMins: 0, visitMins: 0, distanceKm: '0.0' };
    const walkPerLeg = profile.accessibleRoute ? 9 : 6;
    const walkMins = Math.max(0, (itineraryStops.length - 1) * walkPerLeg);
    const visitMins = itineraryStops.length * 45;
    const distanceKm = ((itineraryStops.length - 1) * (profile.accessibleRoute ? 0.55 : 0.42)).toFixed(
      1
    );
    return { walkMins, visitMins, distanceKm };
  }, [itineraryStops, profile.accessibleRoute]);

  const selectedPinDestination =
    HERITAGE_DESTINATIONS.find((d) => d.id === selectedMapPinId) || HERITAGE_DESTINATIONS[0];

  const routePolylinePoints = itineraryStops
    .map((stop) => `${stop.mapCoords.x},${stop.mapCoords.y}`)
    .join(' ');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#0D3447] hc-heading">
            Smart XR Trip Planner
          </h1>
          <p className="text-sm text-slate-600 hc-muted">
            Build your Melaka heritage trail with step-free routing and AR previews.
          </p>
        </div>

        {/* Accessible Route Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={profile.accessibleRoute}
          onClick={onToggleAccessibleRoute}
          className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors ${
            profile.accessibleRoute
              ? 'bg-[#16A34A] text-white border-[#16A34A]'
              : 'bg-white hc-surface text-[#0D3447] border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Accessibility className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>
            Accessible Route: {profile.accessibleRoute ? 'ON (Step-Free)' : 'Standard'}
          </span>
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Melaka destinations (A Famosa, Jonker Street, Maritime Museum)..."
          aria-label="Search trip planner destinations"
          className="w-full min-h-[48px] pl-11 pr-4 rounded-2xl bg-white hc-surface border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3447]"
        />
      </div>

      {/* Interactive Map + Itinerary Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Illustrated Interactive Melaka Heritage Map + Destination Picker */}
        <div className="lg:col-span-7 space-y-5">
          {/* Illustrated Map Card */}
          <section
            aria-label="Interactive Melaka Heritage Map"
            className="bg-white hc-surface rounded-3xl border border-slate-200 overflow-hidden shadow-xs"
          >
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-heading font-semibold text-[#0D3447] hc-heading flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
                Melaka UNESCO Heritage Map (Illustrated)
              </span>
              <span className="text-slate-500 hc-muted tabular-nums">
                {itineraryStops.length} stop(s) selected
              </span>
            </div>

            <div className="relative w-full h-64 sm:h-72 bg-[#E6EFF2] overflow-hidden">
              {/* Custom Illustrated Cartographic SVG */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full"
                aria-hidden="true"
              >
                {/* Land zones */}
                <rect x="0" y="0" width="100" height="100" fill="#EDF3F0" />
                {/* Strait of Malacca Coastline */}
                <path d="M0,84 Q40,76 70,88 T100,82 L100,100 L0,100 Z" fill="#B8DCE8" />
                {/* Melaka River Winding */}
                <path
                  d="M36,0 C39,28 31,48 39,85"
                  fill="none"
                  stroke="#95C9DC"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Heritage Road Grid */}
                <path
                  d="M14,36 L86,36 M48,20 L48,74 M24,36 L48,42 L64,48 L58,66 L42,78"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeOpacity="0.85"
                />
                {/* St. Paul's Hill Contour */}
                <ellipse cx="64" cy="49" rx="13" ry="10" fill="#D6E5D8" opacity="0.8" />

                {/* Active Itinerary Route Path */}
                {itineraryStops.length > 1 && (
                  <polyline
                    points={routePolylinePoints}
                    fill="none"
                    stroke={profile.accessibleRoute ? '#16A34A' : '#0D3447'}
                    strokeWidth="2.2"
                    strokeDasharray="3 2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>

              {/* Map Geographic Labels */}
              <span className="absolute top-3 left-3 text-[10px] font-semibold text-[#0D3447]/70 pointer-events-none">
                Jonker Quarter
              </span>
              <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-[#0D3447]/80 pointer-events-none">
                Strait of Malacca
              </span>

              {/* Interactive Destination Markers */}
              {HERITAGE_DESTINATIONS.map((dest) => {
                const orderIndex = profile.itineraryIds.indexOf(dest.id);
                const inRoute = orderIndex !== -1;
                const isSelected = selectedMapPinId === dest.id;

                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => setSelectedMapPinId(dest.id)}
                    style={{ left: `${dest.mapCoords.x}%`, top: `${dest.mapCoords.y}%` }}
                    aria-label={`Select ${dest.shortName} on map`}
                    className={`-translate-x-1/2 -translate-y-1/2 absolute min-h-[36px] px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-md transition-transform flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#F5B942] text-[#0D3447] scale-110 z-20 ring-2 ring-[#0D3447]'
                        : inRoute
                        ? 'bg-[#0D3447] text-white z-10'
                        : 'bg-white text-[#0D3447] border border-slate-300'
                    }`}
                  >
                    {inRoute ? (
                      <span className="w-4 h-4 rounded-full bg-[#F5B942] text-[#0D3447] text-[10px] font-bold flex items-center justify-center tabular-nums">
                        {orderIndex + 1}
                      </span>
                    ) : (
                      <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                    )}
                    <span className="whitespace-nowrap">{dest.shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Map Pin Quick Preview Bar */}
            <div className="p-3.5 bg-[#FFF4E3]/60 hc-surface-alt flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-heading font-semibold text-sm text-[#0D3447] hc-heading truncate">
                  {selectedPinDestination.name}
                </p>
                <p className="text-xs text-slate-600 hc-muted truncate">
                  {selectedPinDestination.accessibilityNote}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate('ar-lens', selectedPinDestination.id)}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white hc-surface border border-slate-200 text-xs font-semibold text-[#0D3447] inline-flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>AR Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleItinerary(selectedPinDestination.id)}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#0D3447] text-white text-xs font-semibold"
                >
                  {profile.itineraryIds.includes(selectedPinDestination.id)
                    ? 'Remove Stop'
                    : 'Add Stop'}
                </button>
              </div>
            </div>
          </section>

          {/* Destination Cards Picker */}
          <section aria-label="Melaka Destinations" className="space-y-3">
            <h2 className="font-heading font-semibold text-base text-[#0D3447] hc-heading">
              Add Destinations ({filteredDestinations.length})
            </h2>

            {filteredDestinations.length === 0 ? (
              <div className="bg-white hc-surface rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-500">
                No destinations match “{searchQuery}”.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredDestinations.map((dest) => {
                  const inItinerary = profile.itineraryIds.includes(dest.id);
                  return (
                    <div
                      key={dest.id}
                      className="bg-white hc-surface rounded-2xl border border-slate-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ImageWithFallback
                          src={dest.image}
                          alt={dest.name}
                          fallbackTitle={dest.shortName}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-heading font-semibold text-sm text-[#0D3447] hc-heading truncate">
                            {dest.name}
                          </h3>
                          <p className="text-xs text-slate-500 hc-muted">
                            {dest.visitDuration} ·{' '}
                            {dest.accessibleFriendly ? 'Step-free access' : 'Steep steps / alt ramp'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onNavigate('ar-lens', dest.id)}
                          className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0D3447] hc-heading hover:bg-slate-50 inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Camera className="w-4 h-4" aria-hidden="true" />
                          <span>AR Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleItinerary(dest.id)}
                          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                            inItinerary
                              ? 'bg-[#16A34A]/15 text-[#14532D] border border-[#16A34A]/40'
                              : 'bg-[#0D3447] text-[#FFF4E3] hover:bg-[#134B66]'
                          }`}
                        >
                          {inItinerary ? (
                            <>
                              <Check className="w-4 h-4" aria-hidden="true" />
                              <span>In Trip</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" aria-hidden="true" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right: Daily Itinerary Timeline & Journey Actions */}
        <section
          aria-label="Daily Itinerary Timeline"
          className="lg:col-span-5 bg-white hc-surface rounded-3xl border border-slate-200 p-5 space-y-5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg text-[#0D3447] hc-heading">
                Daily Heritage Timeline
              </h2>
              <p className="text-xs text-slate-500 hc-muted">
                {profile.accessibleRoute
                  ? 'Step-free accessible route active'
                  : 'Standard pedestrian heritage walk'}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0D3447] hc-heading tabular-nums">
              {itineraryStops.length} Stops
            </span>
          </div>

          {/* Estimated Time & Distance Summary */}
          <div className="grid grid-cols-3 gap-2 bg-[#FFF4E3] hc-surface-alt rounded-2xl p-3 text-center">
            <div>
              <p className="text-[11px] text-slate-600 hc-muted">Walk Time</p>
              <p className="font-heading font-bold text-sm text-[#0D3447] hc-heading tabular-nums">
                {travelStats.walkMins} min
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-600 hc-muted">Explore Time</p>
              <p className="font-heading font-bold text-sm text-[#0D3447] hc-heading tabular-nums">
                {travelStats.visitMins} min
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-600 hc-muted">Distance</p>
              <p className="font-heading font-bold text-sm text-[#0D3447] hc-heading tabular-nums">
                {travelStats.distanceKm} km
              </p>
            </div>
          </div>

          {/* Timeline List */}
          {itineraryStops.length === 0 ? (
            <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto" aria-hidden="true" />
              <p className="font-heading font-semibold text-sm text-[#0D3447] hc-heading">
                Your itinerary is empty
              </p>
              <p className="text-xs text-slate-500 hc-muted px-4">
                Tap “Add” on any Melaka landmark to build your personalized XR walking route.
              </p>
            </div>
          ) : (
            <ol className="space-y-3">
              {itineraryStops.map((stop, idx) => (
                <li
                  key={stop.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hc-surface-alt flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-[#0D3447] text-[#F5B942] text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading font-semibold text-sm text-[#0D3447] hc-heading truncate">
                        {stop.shortName}
                      </p>
                      <p className="text-[11px] text-slate-500 hc-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>{stop.visitDuration}</span>
                        {profile.accessibleRoute && !stop.accessibleFriendly && (
                          <span>· Alt ramp route</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onMoveItem(idx, -1)}
                      aria-label={`Move ${stop.shortName} earlier`}
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-35 hover:text-[#0D3447]"
                    >
                      <ArrowUp className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === itineraryStops.length - 1}
                      onClick={() => onMoveItem(idx, 1)}
                      aria-label={`Move ${stop.shortName} later`}
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-35 hover:text-[#0D3447]"
                    >
                      <ArrowDown className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(stop.id)}
                      aria-label={`Remove ${stop.shortName} from itinerary`}
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg bg-white border border-slate-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {/* Start Journey & Summary CTA Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              disabled={itineraryStops.length === 0}
              onClick={() => {
                setActiveNavStep(0);
                setShowJourneyModal(true);
              }}
              className="min-h-[48px] w-full px-5 py-3 rounded-xl bg-[#0D3447] hover:bg-[#134B66] disabled:bg-slate-200 disabled:text-slate-400 text-[#FFF4E3] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Navigation className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
              <span>Start Journey</span>
            </button>

            <button
              type="button"
              disabled={itineraryStops.length === 0}
              onClick={() => setShowSummaryModal(true)}
              className="min-h-[44px] w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0D3447] hc-heading hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              View Journey Summary
            </button>
          </div>
        </section>
      </div>

      {/* Simulated Turn-by-Turn XR Navigation Modal */}
      {showJourneyModal && itineraryStops[activeNavStep] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Simulated XR Journey Navigation"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div className="bg-[#0D3447] text-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#F5B942] tabular-nums">
                  Simulated XR Navigation · Stop {activeNavStep + 1} of {itineraryStops.length}
                </p>
                <h2 className="font-heading font-bold text-xl mt-0.5">
                  {itineraryStops[activeNavStep].name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowJourneyModal(false)}
                aria-label="Close navigation"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative h-44 rounded-2xl overflow-hidden border border-white/15">
              <ImageWithFallback
                src={itineraryStops[activeNavStep].image}
                alt={itineraryStops[activeNavStep].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#F5B942]">
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  {activeNavStep === 0
                    ? 'Starting Point · 120m ahead'
                    : `Walk ~${profile.accessibleRoute ? 9 : 6} mins from previous stop`}
                </span>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-3.5 text-xs text-[#FFF4E3] space-y-1">
              <p className="font-semibold text-[#F5B942]">
                {profile.accessibleRoute ? 'Step-Free Guidance:' : 'Walking Guidance:'}
              </p>
              <p>{itineraryStops[activeNavStep].accessibilityNote}</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const destId = itineraryStops[activeNavStep].id;
                  setShowJourneyModal(false);
                  onNavigate('ar-lens', destId);
                }}
                className="min-h-[46px] flex-1 px-4 py-2.5 rounded-xl bg-[#F5B942] text-[#0D3447] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
                <span>Launch AR Here</span>
              </button>

              {activeNavStep + 1 < itineraryStops.length ? (
                <button
                  type="button"
                  onClick={() => setActiveNavStep((s) => s + 1)}
                  className="min-h-[46px] flex-1 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold"
                >
                  Next Stop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowJourneyModal(false);
                    setShowSummaryModal(true);
                  }}
                  className="min-h-[46px] flex-1 px-4 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs sm:text-sm font-semibold"
                >
                  Finish Trail
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Journey Summary Modal */}
      {showSummaryModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Trip Summary"
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white hc-surface w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl text-[#0D3447] hc-heading flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#16A34A]" aria-hidden="true" />
                <span>Melaka Journey Summary</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                aria-label="Close summary"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-600"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="bg-[#FFF4E3] hc-surface-alt rounded-2xl p-4 space-y-1.5 text-sm text-[#0D3447] hc-heading">
              <p className="flex justify-between">
                <span>Total Landmarks</span>
                <strong className="tabular-nums">{itineraryStops.length} stops</strong>
              </p>
              <p className="flex justify-between">
                <span>Total Route Distance</span>
                <strong className="tabular-nums">{travelStats.distanceKm} km</strong>
              </p>
              <p className="flex justify-between">
                <span>Estimated Duration</span>
                <strong className="tabular-nums">
                  {travelStats.walkMins + travelStats.visitMins} mins
                </strong>
              </p>
              <p className="flex justify-between">
                <span>Route Profile</span>
                <strong>{profile.accessibleRoute ? 'Step-Free Accessible' : 'Standard'}</strong>
              </p>
            </div>

            <p className="text-xs text-slate-500 hc-muted">
              Your itinerary is automatically saved to LocalStorage so it persists across sessions.
            </p>

            <button
              type="button"
              onClick={() => setShowSummaryModal(false)}
              className="min-h-[46px] w-full rounded-xl bg-[#0D3447] text-white font-semibold text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
