import React, { useState } from 'react';
import { useCluster } from '../context/ClusterContext';
import { LEARNING_MISSIONS } from '../data/missions';
import {
  Compass,
  CheckCircle2,
  Circle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Trophy,
  Play,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MissionGuideModal: React.FC = () => {
  const { state, loadPreset, setViewMode } = useCluster();
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0);
  const [showHints, setShowHints] = useState(false);

  const activeMission = LEARNING_MISSIONS[selectedMissionIndex];

  // Check progress
  const completedChecks = activeMission.checks.map(c => c.isComplete(state));
  const isMissionComplete = completedChecks.every(Boolean);

  const handleNextMission = () => {
    if (selectedMissionIndex < LEARNING_MISSIONS.length - 1) {
      const nextIdx = selectedMissionIndex + 1;
      setSelectedMissionIndex(nextIdx);
      setShowHints(false);
      const nextPreset = LEARNING_MISSIONS[nextIdx].recommendedPreset;
      if (nextPreset) {
        loadPreset(nextPreset);
      }
    }
  };

  const handleStartMission = () => {
    if (activeMission.recommendedPreset) {
      loadPreset(activeMission.recommendedPreset);
    }
    setViewMode('canvas');
    if (isMissionComplete) {
      confetti({ particleCount: 80, spread: 70 });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono">
                Kubernetes Guided Learning Missions
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Interactive Lab
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hands-on interactive challenges to master Kubernetes concepts step by step.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission Track Selector */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Mission Roadmap
          </h3>

          {LEARNING_MISSIONS.map((mission, idx) => {
            const isComplete = mission.checks.every(c => c.isComplete(state));
            const isSelected = idx === selectedMissionIndex;

            return (
              <div
                key={mission.id}
                onClick={() => {
                  setSelectedMissionIndex(idx);
                  setShowHints(false);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/80 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isComplete
                        ? 'bg-emerald-500 text-white'
                        : isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isComplete ? <CheckCircle2 className="w-4 h-4" /> : mission.number}
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold text-slate-200 truncate">
                      {mission.title}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {mission.category} • {mission.badge}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isComplete && (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">Done</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Mission Details */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Stage {activeMission.number} of {LEARNING_MISSIONS.length}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {activeMission.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-mono mt-1">
                {activeMission.title}
              </h3>
              <p className="text-xs text-cyan-300">{activeMission.subtitle}</p>
            </div>

            {isMissionComplete ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-bounce-short">
                <Trophy className="w-4 h-4 text-emerald-400" />
                Completed!
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeMission.description}
            </p>

            {/* Key Learning Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 to-purple-950/40 border border-blue-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-white block mb-0.5">Core Concept:</strong>
                {activeMission.keyLearning}
              </div>
            </div>

            {/* Interactive Objectives Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Mission Objectives:
              </h4>

              <div className="space-y-2">
                {activeMission.checks.map((check, idx) => {
                  const completed = completedChecks[idx];
                  return (
                    <div
                      key={check.id}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        completed
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                      )}
                      <span className="text-xs font-medium">{check.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hints Accordion */}
            <div>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showHints ? 'Hide Helpful Hints' : 'Show Helpful Hints & Guide'}
              </button>

              {showHints && (
                <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1.5 text-xs text-slate-300 animate-fadeIn">
                  {activeMission.hints.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (activeMission.recommendedPreset) {
                  loadPreset(activeMission.recommendedPreset);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Load Mission Template Setup
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleStartMission}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                Try on Visual Canvas
              </button>

              {isMissionComplete && selectedMissionIndex < LEARNING_MISSIONS.length - 1 && (
                <button
                  onClick={handleNextMission}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all animate-pulse"
                >
                  Next Mission
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
