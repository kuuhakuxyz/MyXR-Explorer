import React, { useMemo, useState } from 'react';
import { Search, Camera, Globe, MapPin, Clock, Accessibility, ArrowRight } from 'lucide-react';
import { HERITAGE_DESTINATIONS } from '../data/heritageData';
import { ExplorerProfileState, ScreenId } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface ExploreScreenProps {
  profile: ExplorerProfileState;
  onNavigate: (screen: ScreenId, destinationId?: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ profile, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Fortress', 'Colonial Landmark', 'Cultural Street', 'Hilltop Ruins', 'Maritime Heritage'];

  const filtered = useMemo(() => {
    return HERITAGE_DESTINATIONS.filter((d) => {
      const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [query, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8 space-y-5">
      <header className="space-y-1">
        <h1 className="font-heading font-bold text-2xl text-[#0D3447] hc-heading">
          Explore Melaka Heritage
        </h1>
        <p className="text-sm text-slate-600 hc-muted">
          Launch AR reconstructions, 360° panoramic tours, or inspect landmark histories.
        </p>
      </header>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by landmark name or era..."
            aria-label="Filter heritage destinations"
            className="w-full min-h-[48px] pl-11 pr-4 rounded-2xl bg-white hc-surface border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3447]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0D3447] text-[#FFF4E3]'
                  : 'bg-white hc-surface border border-slate-200 text-slate-600 hc-muted hover:text-[#0D3447]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Directory */}
      {filtered.length === 0 ? (
        <div className="bg-white hc-surface rounded-2xl border border-slate-200 p-8 text-center space-y-2">
          <p className="font-heading font-semibold text-base text-[#0D3447] hc-heading">
            No matching heritage landmarks
          </p>
          <p className="text-sm text-slate-500 hc-muted">
            Clear your search filter to view all five UNESCO heritage sites.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCategory('All');
            }}
            className="mt-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#0D3447] text-white text-sm font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((dest) => {
            const isSaved = profile.savedDestinationIds.includes(dest.id);
            return (
              <article
                key={dest.id}
                className="bg-white hc-surface rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => onNavigate('detail', dest.id)}
                  className="relative h-48 w-full overflow-hidden text-left group"
                >
                  <ImageWithFallback
                    src={dest.image}
                    alt={dest.name}
                    fallbackTitle={dest.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-xs text-[#FFF4E3]/90">
                      {dest.category} · {dest.era} {isSaved ? '· Saved' : ''}
                    </p>
                    <h2 className="font-heading font-bold text-lg leading-snug">{dest.name}</h2>
                  </div>
                </button>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 hc-muted flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0D3447] shrink-0" aria-hidden="true" />
                      <span className="truncate">{dest.location}</span>
                    </p>
                    <p className="text-sm text-slate-700 hc-muted line-clamp-2">
                      {dest.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-600 hc-muted pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {dest.visitDuration}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Accessibility className="w-3.5 h-3.5 text-[#16A34A]" aria-hidden="true" />
                        {dest.accessibleFriendly ? 'Step-free path' : 'Alternate slope route'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onNavigate('ar-lens', dest.id)}
                      className="min-h-[44px] flex-1 px-3 py-2 rounded-xl bg-[#0D3447] text-[#FFF4E3] text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-[#134B66] transition-colors whitespace-nowrap"
                    >
                      <Camera className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
                      <span>AR Lens</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('virtual-tour', dest.id)}
                      className="min-h-[44px] flex-1 px-3 py-2 rounded-xl bg-[#FFF4E3] hc-surface-alt text-[#0D3447] text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-[#fde8c8] transition-colors whitespace-nowrap"
                    >
                      <Globe className="w-4 h-4" aria-hidden="true" />
                      <span>360° Tour</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('detail', dest.id)}
                      aria-label={`View details for ${dest.name}`}
                      className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl border border-slate-200 text-[#0D3447] hc-heading text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
