import React from 'react';
import { TooltipWrapper } from './TooltipWrapper';
import { Server, Database, Compass, Cpu, Radio, ShieldCheck } from 'lucide-react';
import { useCluster } from '../context/ClusterContext';

export const ControlPlaneVisualizer: React.FC = () => {
  const { selectElement } = useCluster();

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-md shadow-blue-500/50"></div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <span>Control Plane (Master Node)</span>
            <span className="text-[10px] lowercase font-normal px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              namespace: kube-system
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Status: Healthy (Quorum Active)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* API Server */}
        <TooltipWrapper conceptId="api-server" position="bottom">
          <div
            onClick={() => selectElement('controlPlane', 'api-server')}
            className="group cursor-pointer p-3 rounded-xl bg-slate-950/70 border border-blue-500/30 hover:border-blue-400 hover:bg-slate-900 transition-all shadow-sm hover:shadow-blue-500/20"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <Server className="w-4 h-4" />
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="font-mono font-bold text-xs text-white group-hover:text-blue-300 transition-colors">
              kube-apiserver
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              REST Hub :6443
            </div>
          </div>
        </TooltipWrapper>

        {/* etcd */}
        <TooltipWrapper conceptId="etcd" position="bottom">
          <div
            onClick={() => selectElement('controlPlane', 'etcd')}
            className="group cursor-pointer p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-900 transition-all shadow-sm hover:shadow-cyan-500/20"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Database className="w-4 h-4" />
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="font-mono font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
              etcd Key-Value Store
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              Raft State :2379
            </div>
          </div>
        </TooltipWrapper>

        {/* Kube-Scheduler */}
        <TooltipWrapper conceptId="scheduler" position="bottom">
          <div
            onClick={() => selectElement('controlPlane', 'scheduler')}
            className="group cursor-pointer p-3 rounded-xl bg-slate-950/70 border border-purple-500/30 hover:border-purple-400 hover:bg-slate-900 transition-all shadow-sm hover:shadow-purple-500/20"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="font-mono font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
              kube-scheduler
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              Pod Placement Engine
            </div>
          </div>
        </TooltipWrapper>

        {/* Controller Manager */}
        <TooltipWrapper conceptId="controller-manager" position="bottom">
          <div
            onClick={() => selectElement('controlPlane', 'controller-manager')}
            className="group cursor-pointer p-3 rounded-xl bg-slate-950/70 border border-pink-500/30 hover:border-pink-400 hover:bg-slate-900 transition-all shadow-sm hover:shadow-pink-500/20"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="font-mono font-bold text-xs text-white group-hover:text-pink-300 transition-colors">
              kube-controller-mgr
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              Reconciliation Loops
            </div>
          </div>
        </TooltipWrapper>
      </div>
    </div>
  );
};
