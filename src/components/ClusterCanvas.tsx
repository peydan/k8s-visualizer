import React from 'react';
import { useCluster } from '../context/ClusterContext';
import { ControlPlaneVisualizer } from './ControlPlaneVisualizer';
import { NodeCard } from './NodeCard';
import { ServiceCard } from './ServiceCard';
import { IngressCard } from './IngressCard';
import { ConfigStorageTray } from './ConfigStorageTray';
import { TooltipWrapper } from './TooltipWrapper';
import {
  Globe,
  Share2,
  Server,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const ClusterCanvas: React.FC = () => {
  const { state, addNode, selectElement } = useCluster();

  const totalPods = state.pods.length;
  const runningPods = state.pods.filter(p => p.status === 'Running').length;
  const totalNodes = state.nodes.length;
  const readyNodes = state.nodes.filter(n => n.status === 'Ready').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Cluster Overview Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-500/50"></span>
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Cluster Status: Operational
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span>
              Nodes: <strong className="text-cyan-400">{readyNodes}/{totalNodes}</strong>
            </span>
            <span>•</span>
            <span>
              Pods: <strong className="text-emerald-400">{runningPods}/{totalPods}</strong>
            </span>
            <span>•</span>
            <span>
              Services: <strong className="text-amber-400">{state.services.length}</strong>
            </span>
          </div>
        </div>

        {/* Namespace Badge & HPA Status */}
        <div className="flex items-center gap-2">
          {state.hpa && (
            <TooltipWrapper conceptId="hpa">
              <div
                onClick={() => selectElement('concept', 'hpa')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-xs cursor-pointer hover:border-emerald-400"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>HPA Active ({state.hpa.minReplicas}-{state.hpa.maxReplicas} pods)</span>
              </div>
            </TooltipWrapper>
          )}

          <TooltipWrapper conceptId="namespace">
            <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 font-mono text-xs flex items-center gap-1.5">
              <span>ns:</span>
              <span className="text-cyan-300 font-bold">{state.activeNamespace}</span>
            </div>
          </TooltipWrapper>
        </div>
      </div>

      {/* 1. Control Plane Layer */}
      <ControlPlaneVisualizer />

      {/* 2. Ingress & External Traffic Entry Point */}
      {state.ingress && (
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Layer 7 Ingress Routing
            </h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <IngressCard ingress={state.ingress} />
          </div>
        </div>
      )}

      {/* 3. Services / Networking Layer */}
      {state.services.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Services & Endpoints (Load Balancers)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              kube-proxy virtual IPs & service routing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.services.map(svc => (
              <ServiceCard key={svc.id} service={svc} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Worker Nodes & Hosted Pods */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Worker Nodes & Container Workloads ({state.nodes.length} Nodes)
            </h3>
          </div>

          <button
            onClick={addNode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs font-bold border border-blue-500/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Worker Node</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {state.nodes.map(node => (
            <NodeCard key={node.id} node={node} />
          ))}
        </div>
      </div>

      {/* 5. Configuration & Persistent Storage Tray */}
      <ConfigStorageTray />
    </div>
  );
};
