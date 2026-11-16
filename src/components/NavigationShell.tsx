import React from 'react';
import {
  Home,
  Compass,
  Trophy,
  Map,
  User,
  Camera,
  Globe,
  Accessibility,
  Smartphone,
  Monitor,
  Mic,
} from 'lucide-react';
import { AccessibilitySettings, ScreenId } from '../types';
import { TranslationBundle } from '../i18n/translations';

interface NavigationShellProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId, destinationId?: string) => void;
  t: TranslationBundle;
  xp: number;
  accessibility: AccessibilitySettings;
  phoneFrameMode: boolean;
  onTogglePhoneFrame: () => void;
  children: React.ReactNode;
}

export const BrandCrest: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="flex items-center gap-2.5 shrink-0">
    <div className="w-9 h-9 rounded-xl bg-[#0D3447] text-[#F5B942] flex items-center justify-center shadow-sm border border-[#F5B942]/30">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 18V9l8-5 8 5v9" />
        <path d="M9 18v-5a3 3 0 0 1 6 0v5" />
        <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      </svg>
    </div>
    {!compact && (
      <div className="leading-tight">
        <span className="font-heading font-bold text-base tracking-tight text-[#0D3447] hc-heading block whitespace-nowrap">
          MyXR Explorer
        </span>
      </div>
    )}
  </div>
);

export const NavigationShell: React.FC<NavigationShellProps> = ({
  activeScreen,
  onNavigate,
  t,
  xp,
  accessibility,
  phoneFrameMode,
  onTogglePhoneFrame,
  children,
}) => {
  const navItems: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'explore', label: t.navExplore, icon: Compass },
    { id: 'quests', label: t.navQuests, icon: Trophy },
    { id: 'planner', label: t.navPlanner, icon: Map },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  const isImmersiveFullScreen = activeScreen === 'ar-lens' || activeScreen === 'virtual-tour';

  const isNavActive = (id: ScreenId) => {
    if (id === 'explore' && activeScreen === 'detail') return true;
    if (id === 'profile' && activeScreen === 'accessibility') return true;
    return activeScreen === id;
  };

  // Voice navigation quick command bar when enabled
  const voiceBar = accessibility.voiceNavigation && !isImmersiveFullScreen && (
    <div className="bg-[#0D3447] text-[#FFF4E3] px-3 py-2 flex items-center justify-between gap-2 text-xs border-b border-white/10">
      <div className="flex items-center gap-2 min-w-0">
        <Mic className="w-3.5 h-3.5 text-[#F5B942] shrink-0" aria-hidden="true" />
        <span className="truncate font-medium">Voice Nav Commands:</span>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('ar-lens', 'a-famosa')}
          className="px-2 py-1 rounded bg-white/15 hover:bg-white/25 whitespace-nowrap font-medium transition-colors"
        >
          “Open AR”
        </button>
        <button
          type="button"
          onClick={() => onNavigate('virtual-tour', 'a-famosa')}
          className="px-2 py-1 rounded bg-white/15 hover:bg-white/25 whitespace-nowrap font-medium transition-colors"
        >
          “360 Tour”
        </button>
        <button
          type="button"
          onClick={() => onNavigate('planner')}
          className="px-2 py-1 rounded bg-white/15 hover:bg-white/25 whitespace-nowrap font-medium transition-colors"
        >
          “Planner”
        </button>
      </div>
    </div>
  );

  // Desktop 393x852 Phone Frame Preview Mode (for university demonstration on wide screens)
  if (phoneFrameMode) {
    return (
      <div className="min-h-screen bg-[#0D3447]/95 flex flex-col items-center justify-center py-6 px-4">
        <div className="mb-4 flex items-center gap-4 text-white/90 text-sm">
          <span className="font-heading font-semibold text-[#FFF4E3]">
            Mobile Prototype Viewport (393 × 852 px)
          </span>
          <button
            type="button"
            onClick={onTogglePhoneFrame}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-colors whitespace-nowrap"
          >
            <Monitor className="w-4 h-4 text-[#F5B942]" aria-hidden="true" />
            Switch to Responsive Desktop
          </button>
        </div>

        <div
          className="relative w-full max-w-[393px] h-[852px] max-h-[88vh] bg-[#F8FAFC] hc-surface rounded-[40px] shadow-2xl border-[8px] border-[#1E293B] overflow-hidden flex flex-col"
          role="region"
          aria-label="Mobile Prototype Frame"
        >
          {voiceBar}
          <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
            {children}
          </div>

          {!isImmersiveFullScreen && (
            <nav
              aria-label="Primary Mobile Navigation"
              className="shrink-0 bg-white/95 hc-nav backdrop-blur-md border-t border-slate-200 px-2 pt-1.5 pb-2 grid grid-cols-5 items-center"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl transition-colors ${
                      active
                        ? 'text-[#0D3447] hc-heading font-semibold'
                        : 'text-slate-500 hc-muted hover:text-[#0D3447]'
                    }`}
                  >
                    <div
                      className={`p-1 rounded-lg transition-colors ${
                        active ? 'bg-[#FFF4E3] text-[#0D3447]' : ''
                      }`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] mt-0.5 whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    );
  }

  // Standard Responsive Mobile-First Layout (works at 393x852 mobile AND expands cleanly to 1440px desktop)
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Desktop Navigation Rail */}
      {!isImmersiveFullScreen && (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen bg-white hc-surface border-r border-slate-200 p-5 justify-between z-30">
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-left focus-visible:outline-2 focus-visible:outline-[#0D3447] rounded-xl"
            >
              <BrandCrest />
              <p className="text-xs text-slate-500 hc-muted mt-1.5 pl-0.5">{t.tagline}</p>
            </button>

            <nav aria-label="Desktop Navigation" className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-[#0D3447] text-[#FFF4E3] shadow-sm'
                        : 'text-slate-600 hc-muted hover:bg-slate-100 hover:text-[#0D3447]'
                    }`}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-[#F5B942]' : ''}`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-200 space-y-1.5">
              <p className="px-3 text-xs font-medium text-slate-500 hc-muted">XR Experiences</p>
              <button
                type="button"
                onClick={() => onNavigate('ar-lens', 'a-famosa')}
                className="w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hc-muted hover:bg-[#FFF4E3] hover:text-[#0D3447] transition-colors whitespace-nowrap"
              >
                <Camera className="w-4.5 h-4.5 text-[#0D3447] shrink-0" aria-hidden="true" />
                <span>{t.arLens}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('virtual-tour', 'a-famosa')}
                className="w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hc-muted hover:bg-[#FFF4E3] hover:text-[#0D3447] transition-colors whitespace-nowrap"
              >
                <Globe className="w-4.5 h-4.5 text-[#0D3447] shrink-0" aria-hidden="true" />
                <span>{t.virtualTours}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('accessibility')}
                className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeScreen === 'accessibility'
                    ? 'bg-[#FFF4E3] text-[#0D3447] font-semibold'
                    : 'text-slate-700 hc-muted hover:bg-slate-100'
                }`}
              >
                <Accessibility className="w-4.5 h-4.5 text-[#0D3447] shrink-0" aria-hidden="true" />
                <span>Accessibility</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="bg-[#FFF4E3] hc-surface-alt rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 hc-muted">Explorer XP</p>
                <p className="font-heading font-bold text-lg text-[#0D3447] hc-heading tabular-nums">
                  {xp} XP
                </p>
              </div>
              <Trophy className="w-6 h-6 text-[#F5B942]" aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={onTogglePhoneFrame}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hc-muted hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              <Smartphone className="w-4 h-4 text-[#0D3447]" aria-hidden="true" />
              <span>393×852 Mobile View</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {voiceBar}
        <main
          className={`flex-1 min-w-0 ${
            isImmersiveFullScreen ? '' : 'pb-20 lg:pb-8'
          }`}
        >
          {children}
        </main>
      </div>

      {/* Fixed Mobile Bottom Tab Bar (< lg) */}
      {!isImmersiveFullScreen && (
        <nav
          aria-label="Bottom Navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 hc-nav backdrop-blur-md border-t border-slate-200 px-2 pt-1.5 pb-2 grid grid-cols-5 items-center shadow-[0_-4px_20px_rgba(13,52,71,0.06)]"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl transition-colors ${
                  active
                    ? 'text-[#0D3447] hc-heading font-semibold'
                    : 'text-slate-500 hc-muted hover:text-[#0D3447]'
                }`}
              >
                <div
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    active ? 'bg-[#FFF4E3] text-[#0D3447]' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-[11px] mt-0.5 whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};
