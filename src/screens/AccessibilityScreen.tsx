import React, { useState } from 'react';
import {
  Globe,
  Type,
  Volume2,
  Captions,
  Sparkles,
  Mic,
  LayoutTemplate,
  Contrast,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { AccessibilitySettings, LanguageCode, ScreenId, TextSizeMode } from '../types';
import { TranslationBundle } from '../i18n/translations';

interface AccessibilityScreenProps {
  settings: AccessibilitySettings;
  t: TranslationBundle;
  onUpdate: (next: AccessibilitySettings) => void;
  onBack: (screen: ScreenId) => void;
}

export const AccessibilityScreen: React.FC<AccessibilityScreenProps> = ({
  settings,
  t,
  onUpdate,
  onBack,
}) => {
  const [savedNotice, setSavedNotice] = useState(false);

  const updateField = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    onUpdate({ ...settings, [key]: value });
    setSavedNotice(true);
  };

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ms', label: 'Bahasa Melayu', native: 'Malay' },
    { code: 'zh', label: '中文', native: 'Chinese' },
  ];

  const textSizes: { code: TextSizeMode; label: string }[] = [
    { code: 'small', label: 'Small' },
    { code: 'medium', label: 'Medium' },
    { code: 'large', label: 'Large' },
  ];

  const toggleOptions: {
    key: Exclude<keyof AccessibilitySettings, 'language' | 'textSize'>;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: 'audioNarration',
      title: 'Audio Narration',
      description: 'Read aloud historical commentary inside AR Lens and 360° Tours.',
      icon: Volume2,
    },
    {
      key: 'subtitles',
      title: 'Live Subtitles',
      description: 'Display high-legibility captions during XR heritage tours.',
      icon: Captions,
    },
    {
      key: 'reducedMotion',
      title: 'Reduced Motion',
      description: 'Minimize AR scan sweeps, transitions, and reward animations.',
      icon: Sparkles,
    },
    {
      key: 'voiceNavigation',
      title: 'Voice Navigation Bar',
      description: 'Pin quick one-tap voice-command shortcuts across screens.',
      icon: Mic,
    },
    {
      key: 'simplifiedUi',
      title: 'Simplified UI Mode',
      description: 'Hide secondary history strips on the dashboard for visual focus.',
      icon: LayoutTemplate,
    },
    {
      key: 'highContrast',
      title: 'High Contrast Mode',
      description: 'Apply high-contrast dark surfaces with golden yellow focus accents.',
      icon: Contrast,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8 space-y-6">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onBack('profile')}
          aria-label="Back to Profile"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white hc-surface border border-slate-200 text-[#0D3447] hover:bg-slate-50"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#0D3447] hc-heading">
            {t.accessibilityTitle}
          </h1>
          <p className="text-sm text-slate-600 hc-muted">
            Personalize language, legibility, sensory comfort, and assistive XR guidance.
          </p>
        </div>
      </header>

      {savedNotice && (
        <div
          role="status"
          className="bg-[#16A34A]/15 border border-[#16A34A]/40 text-[#14532D] hc-surface-alt rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" aria-hidden="true" />
            <span>{t.settingsSavedToast}</span>
          </span>
        </div>
      )}

      {/* Language Selector */}
      <section className="bg-white hc-surface rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#0D3447] hc-heading" aria-hidden="true" />
          <div>
            <h2 className="font-heading font-semibold text-base text-[#0D3447] hc-heading">
              App Language
            </h2>
            <p className="text-xs text-slate-500 hc-muted">
              Changes dashboard labels, navigation, and speech synthesis locale.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {languages.map((lang) => {
            const active = settings.language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => updateField('language', lang.code)}
                className={`min-h-[48px] px-3 py-2 rounded-xl border text-center transition-colors ${
                  active
                    ? 'bg-[#0D3447] text-[#FFF4E3] border-[#0D3447] font-semibold'
                    : 'bg-slate-50 hc-surface-alt border-slate-200 text-[#1E293B] hover:border-[#0D3447]'
                }`}
              >
                <span className="block text-sm">{lang.label}</span>
                <span className="block text-[11px] opacity-75">{lang.native}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Text Size Selector */}
      <section className="bg-white hc-surface rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <Type className="w-5 h-5 text-[#0D3447] hc-heading" aria-hidden="true" />
          <div>
            <h2 className="font-heading font-semibold text-base text-[#0D3447] hc-heading">
              Text Size Scaling
            </h2>
            <p className="text-xs text-slate-500 hc-muted">
              Adjusts base typography across all screens immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Text Size">
          {textSizes.map((sz) => {
            const active = settings.textSize === sz.code;
            return (
              <button
                key={sz.code}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => updateField('textSize', sz.code)}
                className={`min-h-[48px] px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#F5B942] text-[#0D3447] border-[#F5B942]'
                    : 'bg-slate-50 hc-surface-alt border-slate-200 text-[#1E293B] hover:border-[#0D3447]'
                }`}
              >
                {sz.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Assistive & Sensory Toggles */}
      <section className="bg-white hc-surface rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {toggleOptions.map((opt) => {
          const Icon = opt.icon;
          const checked = settings[opt.key];
          return (
            <div
              key={opt.key}
              className="p-4 sm:px-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4E3] hc-surface-alt text-[#0D3447] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-semibold text-sm text-[#0D3447] hc-heading">
                    {opt.title}
                  </h3>
                  <p className="text-xs text-slate-600 hc-muted mt-0.5">{opt.description}</p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={opt.title}
                onClick={() => updateField(opt.key, !checked)}
                className={`relative w-14 h-8 rounded-full transition-colors shrink-0 p-1 ${
                  checked ? 'bg-[#16A34A]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </section>

      <button
        type="button"
        onClick={() => setSavedNotice(true)}
        className="min-h-[48px] w-full rounded-xl bg-[#0D3447] hover:bg-[#134B66] text-[#FFF4E3] font-semibold text-sm transition-colors shadow-sm"
      >
        {t.saveSettings}
      </button>
    </div>
  );
};
