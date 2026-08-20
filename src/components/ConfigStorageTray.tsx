import React, { useState } from 'react';
import { useCluster } from '../context/ClusterContext';
import { TooltipWrapper } from './TooltipWrapper';
import { Sliders, Lock, HardDrive, Eye, EyeOff, Plus } from 'lucide-react';

export const ConfigStorageTray: React.FC = () => {
  const { state, selectElement } = useCluster();
  const [showSecretMap, setShowSecretMap] = useState<Record<string, boolean>>({});

  const toggleSecret = (id: string) => {
    setShowSecretMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const hasItems = state.configMaps.length > 0 || state.secrets.length > 0 || state.pvcs.length > 0;

  if (!hasItems) return null;

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <span>Configuration & Persistent Storage</span>
          <span className="text-[10px] lowercase font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            namespace: {state.activeNamespace}
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* ConfigMaps */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <TooltipWrapper conceptId="configmap">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 cursor-pointer">
                <Sliders className="w-3.5 h-3.5" />
                ConfigMaps ({state.configMaps.length})
              </span>
            </TooltipWrapper>
          </div>

          <div className="space-y-2">
            {state.configMaps.map(cm => (
              <div
                key={cm.id}
                onClick={() => selectElement('configMap', cm.id)}
                className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                    {cm.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {Object.keys(cm.data).length} keys
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900/90 rounded p-1.5 border border-slate-800">
                  {Object.entries(cm.data).slice(0, 2).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <span className="text-cyan-400">{k}:</span> {v}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secrets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <TooltipWrapper conceptId="secret">
              <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5 cursor-pointer">
                <Lock className="w-3.5 h-3.5" />
                Secrets ({state.secrets.length})
              </span>
            </TooltipWrapper>
          </div>

          <div className="space-y-2">
            {state.secrets.map(sec => {
              const isRevealed = Boolean(showSecretMap[sec.id]);
              return (
                <div
                  key={sec.id}
                  onClick={() => selectElement('secret', sec.id)}
                  className="p-3 rounded-xl bg-slate-950/70 border border-rose-500/30 hover:border-rose-400 hover:bg-slate-900 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-rose-300">
                      {sec.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSecret(sec.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title={isRevealed ? 'Hide secret values' : 'Reveal secret values'}
                    >
                      {isRevealed ? <EyeOff className="w-3 h-3 text-rose-400" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-900/90 rounded p-1.5 border border-slate-800">
                    {Object.entries(sec.data).slice(0, 2).map(([k, v]) => (
                      <div key={k} className="truncate">
                        <span className="text-rose-400">{k}:</span>{' '}
                        {isRevealed ? v : '••••••••••••••••'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PVCs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <TooltipWrapper conceptId="pvc">
              <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5 cursor-pointer">
                <HardDrive className="w-3.5 h-3.5" />
                PersistentVolumeClaims ({state.pvcs.length})
              </span>
            </TooltipWrapper>
          </div>

          <div className="space-y-2">
            {state.pvcs.map(pvc => (
              <div
                key={pvc.id}
                onClick={() => selectElement('pvc', pvc.id)}
                className="p-3 rounded-xl bg-slate-950/70 border border-purple-500/30 hover:border-purple-400 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-purple-300">
                    {pvc.name}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {pvc.status}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900/90 rounded p-1.5 border border-slate-800 flex items-center justify-between">
                  <span>Capacity: <span className="text-purple-300 font-bold">{pvc.capacity}</span></span>
                  <span>Class: {pvc.storageClass}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
