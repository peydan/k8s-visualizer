import React from 'react';
import { useCluster, ViewMode } from '../context/ClusterContext';
import { ARCHITECTURE_PRESETS } from '../data/presets';
import {
  Send,
  Skull,
  RotateCcw,
  Compass,
  Terminal,
  FileCode,
  BookOpen,
  LayoutGrid,
  Zap,
  Gauge,
  Sliders
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    activePresetId,
    loadPreset,
    resetCluster,
    sendTraffic,
    triggerChaosMonkey,
    simulateCpuSpike,
    state
  } = useCluster();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => setViewMode('canvas')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.2L19.5 8 12 11.8 4.5 8 12 4.2zM4 9.5l7 3.5v7l-7-3.5v-7zm16 7l-7 3.5v-7l7-3.5v7z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 font-mono">
                Kube<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Verse</span>
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Interactive Lab
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Visual Kubernetes Architecture, Playground & Learning Sandbox
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('canvas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'canvas'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Visual Canvas</span>
          </button>

          <button
            onClick={() => setViewMode('missions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'missions'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Missions</span>
          </button>

          <button
            onClick={() => setViewMode('yaml')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'yaml'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Live YAML</span>
          </button>

          <button
            onClick={() => setViewMode('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'terminal'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Kubectl CLI</span>
          </button>

          <button
            onClick={() => setViewMode('glossary')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'glossary'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Glossary</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium hidden md:inline">Preset:</label>
          <select
            value={activePresetId}
            onChange={(e) => loadPreset(e.target.value)}
            className="bg-slate-950 text-cyan-300 text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-700 hover:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer transition-all"
          >
            {ARCHITECTURE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id} className="bg-slate-900 text-slate-100">
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Simulation Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={sendTraffic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all transform active:scale-95"
            title="Send an animated HTTP request through Ingress -> Service -> Pod"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send Traffic</span>
          </button>

          <button
            onClick={triggerChaosMonkey}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold border border-rose-500/40 shadow-lg shadow-rose-600/20 hover:shadow-rose-600/40 transition-all transform active:scale-95"
            title="Kill a random pod to watch Kubernetes self-healing in real time!"
          >
            <Skull className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chaos Monkey</span>
          </button>

          <button
            onClick={() => simulateCpuSpike(state.cpuLoadSimulation >= 75 ? 25 : 85)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              state.cpuLoadSimulation >= 75
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Simulate CPU traffic load (triggers HPA auto-scaling if CPU > 70%)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">CPU {state.cpuLoadSimulation}%</span>
          </button>

          <button
            onClick={resetCluster}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Reset Cluster to initial state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
