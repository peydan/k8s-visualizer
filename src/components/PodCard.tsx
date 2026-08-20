import React from 'react';
import { PodInstance } from '../types/k8s';
import { TooltipWrapper } from './TooltipWrapper';
import { useCluster } from '../context/ClusterContext';
import { Box, Skull, Key, Sliders, HardDrive, RefreshCw } from 'lucide-react';

interface PodCardProps {
  pod: PodInstance;
}

export const PodCard: React.FC<PodCardProps> = ({ pod }) => {
  const { selectElement, killPod } = useCluster();

  const getStatusColor = (status: PodInstance['status']) => {
    switch (status) {
      case 'Running':
        return 'bg-emerald-500 text-emerald-300 border-emerald-500/30';
      case 'ContainerCreating':
      case 'Pending':
        return 'bg-amber-500 text-amber-300 border-amber-500/30';
      case 'CrashLoopBackOff':
      case 'Terminating':
        return 'bg-rose-500 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-500 text-slate-300 border-slate-500/30';
    }
  };

  const isCrashing = pod.status === 'CrashLoopBackOff' || pod.status === 'Terminating';
  const isCreating = pod.status === 'ContainerCreating';

  return (
    <TooltipWrapper conceptId="pod" position="top">
      <div
        onClick={() => selectElement('pod', pod.id)}
        className={`group relative p-3 rounded-xl bg-slate-900/90 border transition-all duration-300 cursor-pointer ${
          isCrashing
            ? 'border-rose-500/80 shadow-lg shadow-rose-950/50 animate-pulse'
            : isCreating
            ? 'border-amber-500/80 shadow-lg shadow-amber-950/50'
            : 'border-slate-700/70 hover:border-cyan-500/60 hover:bg-slate-850 hover:shadow-lg hover:shadow-cyan-950/30'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <Box className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-xs font-bold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
              {pod.name}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${getStatusColor(
                pod.status
              )}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  pod.status === 'Running' ? 'bg-emerald-400 animate-ping' : 'bg-current'
                }`}
              />
              {pod.status}
            </span>

            {/* Kill button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                killPod(pod.id);
              }}
              title="Simulate container crash (Kill Pod)"
              className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              <Skull className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Container Image & Port */}
        <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/80 space-y-1 text-[11px] font-mono">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500">Image:</span>
            <span className="text-cyan-300 truncate max-w-[120px]">
              {pod.containers[0]?.image || 'app:latest'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500">IP:</span>
            <span className="text-slate-300 font-semibold">{pod.ip}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500">Port:</span>
            <span className="text-emerald-400">:{pod.containers[0]?.port || 80}</span>
          </div>
        </div>

        {/* Badges / References (ConfigMap, Secret, PVC) */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {pod.configMapRefs && pod.configMapRefs.length > 0 && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 flex items-center gap-1"
              title="ConfigMap mounted"
            >
              <Sliders className="w-2.5 h-2.5" />
              CM
            </span>
          )}

          {pod.secretRefs && pod.secretRefs.length > 0 && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-400 border border-rose-800/40 flex items-center gap-1"
              title="Secret mounted"
            >
              <Key className="w-2.5 h-2.5" />
              Secret
            </span>
          )}

          {pod.pvcRefs && pod.pvcRefs.length > 0 && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-400 border border-purple-800/40 flex items-center gap-1"
              title="PVC storage attached"
            >
              <HardDrive className="w-2.5 h-2.5" />
              PVC
            </span>
          )}

          {pod.restartCount > 0 && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40 flex items-center gap-0.5 ml-auto"
              title="Restart count"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              {pod.restartCount}
            </span>
          )}
        </div>
      </div>
    </TooltipWrapper>
  );
};
