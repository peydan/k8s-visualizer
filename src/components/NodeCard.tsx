import React from 'react';
import { K8sNode } from '../types/k8s';
import { useCluster } from '../context/ClusterContext';
import { PodCard } from './PodCard';
import { TooltipWrapper } from './TooltipWrapper';
import {
  Server,
  Cpu,
  HardDrive,
  Slash,
  Trash2,
  Activity,
  Radio,
  PowerOff
} from 'lucide-react';

interface NodeCardProps {
  node: K8sNode;
}

export const NodeCard: React.FC<NodeCardProps> = ({ node }) => {
  const {
    state,
    selectElement,
    toggleNodeCordon,
    drainNode,
    removeNode
  } = useCluster();

  const nodePods = state.pods.filter(p => p.nodeId === node.id);
  const isCordoned = node.status === 'Cordoned';

  const cpuPercent = Math.min(100, Math.round((node.cpuAllocated / node.cpuTotal) * 100));
  const memPercent = Math.min(100, Math.round((node.memAllocated / node.memTotal) * 100));

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${
        isCordoned
          ? 'bg-slate-900/60 border-amber-500/50 shadow-md shadow-amber-950/20'
          : 'bg-slate-900/80 border-slate-700/80 shadow-xl shadow-slate-950/50'
      }`}
    >
      {/* Node Header */}
      <div className="p-4 bg-slate-950/70 border-b border-slate-800/80">
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => selectElement('node', node.id)}
          >
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 group-hover:bg-blue-600/20 border border-blue-500/20 transition-all">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <TooltipWrapper conceptId="node">
                  <h3 className="font-mono font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {node.name}
                  </h3>
                </TooltipWrapper>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    node.status === 'Ready'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {node.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                <span>IP: {node.ip}</span>
                <span>•</span>
                <span>Zone: {node.zone}</span>
              </div>
            </div>
          </div>

          {/* Node Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleNodeCordon(node.id)}
              className={`p-1.5 rounded-lg border text-xs transition-all ${
                isCordoned
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/30'
              }`}
              title={isCordoned ? 'Uncordon Node (Enable scheduling)' : 'Cordon Node (Disable scheduling)'}
            >
              <Slash className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => drainNode(node.id)}
              className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all text-xs"
              title="Drain Node (Evacuate all pods)"
            >
              <PowerOff className="w-3.5 h-3.5" />
            </button>

            {state.nodes.length > 1 && (
              <button
                onClick={() => removeNode(node.id)}
                className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all text-xs"
                title="Remove Node from cluster"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Daemons status & Resource Meters */}
        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/50">
          {/* CPU Meter */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                CPU ({node.cpuAllocated}/{node.cpuTotal} Cores)
              </span>
              <span className="font-bold text-slate-300">{cpuPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  cpuPercent > 80 ? 'bg-rose-500' : cpuPercent > 50 ? 'bg-amber-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${cpuPercent}%` }}
              />
            </div>
          </div>

          {/* Memory Meter */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-purple-400" />
                RAM ({node.memAllocated}/{node.memTotal} MB)
              </span>
              <span className="font-bold text-slate-300">{memPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  memPercent > 80 ? 'bg-rose-500' : memPercent > 50 ? 'bg-amber-500' : 'bg-purple-500'
                }`}
                style={{ width: `${memPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Node Daemons Badges */}
        <div className="flex items-center gap-2 mt-2.5">
          <TooltipWrapper conceptId="kubelet">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-slate-300 flex items-center gap-1 hover:border-cyan-500/40">
              <Activity className="w-3 h-3 text-emerald-400" />
              kubelet: active
            </span>
          </TooltipWrapper>

          <TooltipWrapper
            customTitle="kube-proxy"
            customContent="Maintains network rules on nodes and handles request forwarding to Pod endpoints."
          >
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-slate-300 flex items-center gap-1 hover:border-cyan-500/40">
              <Radio className="w-3 h-3 text-cyan-400" />
              kube-proxy: active
            </span>
          </TooltipWrapper>
        </div>
      </div>

      {/* Hosted Pods Grid */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Hosted Pods ({nodePods.length})
          </span>
          {isCordoned && (
            <span className="text-[10px] text-amber-400 font-mono italic">
              Scheduling Disabled (Cordoned)
            </span>
          )}
        </div>

        {nodePods.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-xl text-center">
            <div className="text-slate-600 mb-1">
              <Server className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-xs text-slate-500 font-mono">No Pods scheduled on this node</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Scale deployments to schedule pods here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {nodePods.map(pod => (
              <PodCard key={pod.id} pod={pod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
