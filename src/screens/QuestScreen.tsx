import React, { useState } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  Clock,
  Shield,
  Landmark,
  Compass,
  BookOpen,
  Camera,
  ChevronRight,
  X,
  Lock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ACHIEVEMENT_BADGES, HERITAGE_QUESTS } from '../data/heritageData';
import { getLevelTitle } from '../hooks/useExplorerStore';
import { AccessibilitySettings, ExplorerProfileState, HeritageQuest } from '../types';

interface QuestScreenProps {
  profile: ExplorerProfileState;
  accessibility: AccessibilitySettings;
  onCompleteQuest: (questId: string, xpReward: number, badgeId: string) => boolean;
}

const BADGE_ICONS = {
  shield: Shield,
  landmark: Landmark,
  compass: Compass,
  book: BookOpen,
  award: Award,
  camera: Camera,
};

export const QuestScreen: React.FC<QuestScreenProps> = ({
  profile,
  accessibility,
  onCompleteQuest,
}) => {
  const [activeQuest, setActiveQuest] = useState<HeritageQuest | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [rewardState, setRewardState] = useState<{
    questTitle: string;
    xpAwarded: number;
    badgeTitle: string;
    isReplay: boolean;
  } | null>(null);

  const completedCount = profile.completedQuestIds.length;
  const totalQuests = HERITAGE_QUESTS.length;
  const progressPercent = Math.round((completedCount / totalQuests) * 100);
  const levelTitle = getLevelTitle(profile.xp);

  const openQuiz = (quest: HeritageQuest) => {
    setActiveQuest(quest);
    setQuestionIndex(0);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setCorrectCount(0);
  };

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer || !activeQuest) return;
    setSelectedOption(idx);
    setHasSubmittedAnswer(true);
    if (idx === activeQuest.questions[questionIndex].correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNextStep = () => {
    if (!activeQuest) return;
    const isLast = questionIndex + 1 >= activeQuest.questions.length;
    if (!isLast) {
      setQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setHasSubmittedAnswer(false);
      return;
    }

    const newlyCompleted = onCompleteQuest(
      activeQuest.id,
      activeQuest.xpReward,
      activeQuest.badgeId
    );
    const badge = ACHIEVEMENT_BADGES.find((b) => b.id === activeQuest.badgeId);
    setActiveQuest(null);
    setRewardState({
      questTitle: activeQuest.title,
      xpAwarded: newlyCompleted ? activeQuest.xpReward : 0,
      badgeTitle: badge?.title || 'Heritage Badge',
      isReplay: !newlyCompleted,
    });
  };

  const currentQuestion = activeQuest?.questions[questionIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8 space-y-6">
      <header className="space-y-1">
        <h1 className="font-heading font-bold text-2xl text-[#0D3447] hc-heading">
          Heritage Quests & Challenges
        </h1>
        <p className="text-sm text-slate-600 hc-muted">
          Complete Malaysian cultural trivia quests to earn XP and unlock commemorative badges.
        </p>
      </header>

      {/* Explorer XP & Quest Progress Summary Card */}
      <section
        aria-label="Quest Progress Summary"
        className="bg-[#0D3447] text-[#FFF4E3] rounded-3xl p-5 sm:p-6 shadow-md space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#F5B942] text-[#0D3447] flex items-center justify-center shrink-0 shadow-sm">
              <Trophy className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[#FFF4E3]/80">Current Explorer Rank</p>
              <h2 className="font-heading font-bold text-xl text-white">{levelTitle}</h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-[#FFF4E3]/75">Total XP</p>
              <p className="font-heading font-bold text-2xl text-[#F5B942] tabular-nums">
                {profile.xp} XP
              </p>
            </div>
            <div>
              <p className="text-xs text-[#FFF4E3]/75">Quest Progress</p>
              <p className="font-heading font-bold text-2xl text-white tabular-nums">
                {completedCount}/{totalQuests}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#FFF4E3]/85">
            <span>Melaka Heritage Trail Completion</span>
            <span className="font-semibold tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full bg-[#F5B942] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Main Content Split on Desktop: Quests + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quest Cards List */}
        <section aria-label="Available Quests" className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg text-[#0D3447] hc-heading">
              Melaka Discovery Quests
            </h2>
            <span className="text-xs text-slate-500 hc-muted tabular-nums">
              +100 XP per quest
            </span>
          </div>

          <div className="space-y-3">
            {HERITAGE_QUESTS.map((quest, index) => {
              const isCompleted = profile.completedQuestIds.includes(quest.id);
              return (
                <div
                  key={quest.id}
                  className={`bg-white hc-surface rounded-2xl border p-4 transition-all ${
                    isCompleted ? 'border-[#16A34A]/40' : 'border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 hc-muted">
                        <span className="font-semibold text-[#0D3447] hc-heading tabular-nums">
                          0{index + 1}.
                        </span>
                        <span>+{quest.xpReward} XP</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          {quest.estimatedMinutes} min
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-semibold inline-flex items-center gap-1 ${
                            isCompleted ? 'text-[#16A34A]' : 'text-[#D97706]'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                              Completed
                            </>
                          ) : (
                            'Available'
                          )}
                        </span>
                      </div>

                      <h3 className="font-heading font-semibold text-base text-[#0D3447] hc-heading">
                        {quest.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 hc-muted">
                        {quest.subtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openQuiz(quest)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap transition-colors ${
                        isCompleted
                          ? 'bg-[#FFF4E3] hc-surface-alt text-[#0D3447] hover:bg-[#fde8c8]'
                          : 'bg-[#0D3447] text-[#FFF4E3] hover:bg-[#134B66]'
                      }`}
                    >
                      <span>{isCompleted ? 'Replay Quiz' : 'Start Quiz'}</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trophy & Reward Badges Shelf */}
        <section aria-label="Reward Badges" className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg text-[#0D3447] hc-heading">
              Trophy & Badge Shelf
            </h2>
            <span className="text-xs text-slate-500 hc-muted tabular-nums">
              {profile.unlockedBadgeIds.length}/{ACHIEVEMENT_BADGES.length} unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENT_BADGES.map((badge) => {
              const unlocked = profile.unlockedBadgeIds.includes(badge.id);
              const Icon = BADGE_ICONS[badge.iconName];
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl border p-3.5 flex flex-col justify-between space-y-2.5 hc-surface ${
                    unlocked
                      ? 'bg-[#FFF4E3]/70 border-[#F5B942]/50'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        unlocked
                          ? 'bg-[#0D3447] text-[#F5B942]'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    {!unlocked && (
                      <Lock className="w-4 h-4 text-slate-400" aria-label="Locked badge" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-xs sm:text-sm text-[#0D3447] hc-heading">
                      {badge.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 hc-muted mt-0.5 leading-snug">
                      {unlocked ? badge.description : badge.criteria}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Interactive Quiz Modal */}
      {activeQuest && currentQuestion && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Quiz: ${activeQuest.title}`}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div className="bg-white hc-surface w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 hc-muted tabular-nums">
                  {activeQuest.title} · Question {questionIndex + 1} of{' '}
                  {activeQuest.questions.length}
                </p>
                <h2 className="font-heading font-bold text-lg text-[#0D3447] hc-heading mt-1">
                  {currentQuestion.question}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuest(null)}
                aria-label="Close quiz"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 shrink-0"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                let style =
                  'bg-white hc-surface border-slate-200 text-[#1E293B] hover:border-[#0D3447]';

                if (hasSubmittedAnswer) {
                  if (isCorrect) {
                    style = 'bg-[#16A34A]/10 border-[#16A34A] text-[#14532D] font-semibold';
                  } else if (isSelected && !isCorrect) {
                    style = 'bg-red-50 border-red-500 text-red-800';
                  } else {
                    style = 'bg-slate-50 border-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={hasSubmittedAnswer}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-xl border-2 text-left text-sm flex items-center justify-between gap-3 transition-colors ${style}`}
                  >
                    <span>{option}</span>
                    {hasSubmittedAnswer && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {hasSubmittedAnswer && (
              <div
                role="status"
                className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'bg-[#16A34A]/10 text-[#14532D] border border-[#16A34A]/30'
                    : 'bg-[#FFF4E3] text-[#0D3447] border border-[#F5B942]/40'
                }`}
              >
                <p className="font-semibold mb-0.5">
                  {selectedOption === currentQuestion.correctIndex
                    ? 'Correct Answer!'
                    : `Good try — Correct answer: ${
                        currentQuestion.options[currentQuestion.correctIndex]
                      }`}
                </p>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={!hasSubmittedAnswer}
                onClick={handleNextStep}
                className="min-h-[46px] w-full px-5 py-2.5 rounded-xl bg-[#0D3447] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors"
              >
                {questionIndex + 1 < activeQuest.questions.length
                  ? 'Next Question'
                  : 'Complete Quest'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quest Reward Animation Modal */}
      {rewardState && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quest Reward"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={accessibility.reducedMotion ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white hc-surface w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F5B942] text-[#0D3447] flex items-center justify-center shadow-md">
              <Award className="w-9 h-9" aria-hidden="true" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#16A34A]">
                {rewardState.isReplay ? 'Quest Reviewed' : 'Quest Completed!'}
              </p>
              <h2 className="font-heading font-bold text-xl text-[#0D3447] hc-heading">
                {rewardState.questTitle}
              </h2>
              <p className="text-sm text-slate-600 hc-muted">
                {rewardState.isReplay
                  ? `You answered ${correctCount} quiz prompt(s) accurately.`
                  : `You earned +${rewardState.xpAwarded} XP and unlocked the ${rewardState.badgeTitle} badge.`}
              </p>
            </div>

            {!rewardState.isReplay && (
              <div className="bg-[#FFF4E3] hc-surface-alt rounded-2xl py-3 px-4 flex items-center justify-center gap-4">
                <span className="font-heading font-bold text-lg text-[#0D3447] hc-heading tabular-nums">
                  +{rewardState.xpAwarded} XP
                </span>
                <span aria-hidden="true" className="text-slate-400">
                  ·
                </span>
                <span className="text-xs font-semibold text-[#0D3447] hc-heading">
                  {rewardState.badgeTitle}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setRewardState(null)}
              className="min-h-[46px] w-full rounded-xl bg-[#0D3447] text-white font-semibold text-sm hover:bg-[#134B66] transition-colors"
            >
              Continue Exploring
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
