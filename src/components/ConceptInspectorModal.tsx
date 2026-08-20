import React, { useState } from 'react';
import { useCluster } from '../context/ClusterContext';
import { K8S_CONCEPTS } from '../data/concepts';
import {
  X,
  BookOpen,
  Terminal,
  FileCode,
  Copy,
  Check,
  Sparkles,
  Server,
  Activity,
  Layers,
  Box,
  Share2,
  Globe,
  Sliders,
  Lock,
  HardDrive,
  TrendingUp,
  Cpu,
  Database
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Server,
  Database,
  Compass: Globe,
  Cpu,
  Layers,
  Activity,
  Box,
  Copy,
  Share2,
  Globe,
  Sliders,
  Lock,
  HardDrive,
  TrendingUp
};

export const ConceptInspectorModal: React.FC = () => {
  const { state, clearSelection, killPod, scaleDeployment } = useCluster();
  const [activeTab, setActiveTab] = useState<'overview' | 'commands' | 'yaml' | 'live'>('overview');
  const [copied, setCopied] = useState(false);

  if (!state.selectedElement) return null;

  const { type, id } = state.selectedElement;

  // Find concept or instance
  let conceptKey = id;
  let instanceDetails: any = null;

  if (type === 'concept' || type === 'controlPlane') {
    conceptKey = id;
  } else if (type === 'pod') {
    conceptKey = 'pod';
    instanceDetails = state.pods.find(p => p.id === id);
  } else if (type === 'node') {
    conceptKey = 'node';
    instanceDetails = state.nodes.find(n => n.id === id);
  } else if (type === 'deployment') {
    conceptKey = 'deployment';
    instanceDetails = state.deployments.find(d => d.id === id);
  } else if (type === 'service') {
    conceptKey = 'service';
    instanceDetails = state.services.find(s => s.id === id);
  } else if (type === 'ingress') {
    conceptKey = 'ingress';
    instanceDetails = state.ingress;
  } else if (type === 'configMap') {
    conceptKey = 'configmap';
    instanceDetails = state.configMaps.find(c => c.id === id);
  } else if (type === 'secret') {
    conceptKey = 'secret';
    instanceDetails = state.secrets.find(s => s.id === id);
  } else if (type === 'pvc') {
    conceptKey = 'pvc';
    instanceDetails = state.pvcs.find(p => p.id === id);
  }

  const concept = K8S_CONCEPTS[conceptKey] || K8S_CONCEPTS['pod'];
  const IconComponent = iconMap[concept.iconName] || Box;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(50, 108, 229, 0.25)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl flex items-center justify-center ring-1 ring-white/10"
              style={{ backgroundColor: `${concept.color}20`, color: concept.color }}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-mono tracking-tight">
                  {instanceDetails?.name || concept.name}
                </h2>
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${concept.color}15`,
                    color: concept.color,
                    borderColor: `${concept.color}40`
                  }}
                >
                  {concept.kind || concept.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {concept.shortDescription}
              </p>
            </div>
          </div>

          <button
            onClick={clearSelection}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-900/50 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'text-cyan-400 border-cyan-400 bg-cyan-950/20'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Concept & Analogy
          </button>

          {instanceDetails && (
            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
                activeTab === 'live'
                  ? 'text-emerald-400 border-emerald-400 bg-emerald-950/20'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Live Instance Inspector
            </button>
          )}

          <button
            onClick={() => setActiveTab('commands')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'commands'
                ? 'text-purple-400 border-purple-400 bg-purple-950/20'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Kubectl Commands
          </button>

          <button
            onClick={() => setActiveTab('yaml')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'yaml'
                ? 'text-amber-400 border-amber-400 bg-amber-950/20'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            YAML Manifest
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Analogy Card */}
              {concept.analogy && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1.5 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Real-World Analogy
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {concept.analogy}
                  </p>
                </div>
              )}

              {/* Why it Matters */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Why It Matters & Key Roles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {concept.whyItMatters.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Attributes */}
              {concept.keyAttributes && concept.keyAttributes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                    Architecture Specification
                  </h3>
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-2 px-4 font-semibold">Attribute</th>
                          <th className="py-2 px-4 font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {concept.keyAttributes.map((attr, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="py-2 px-4 font-mono font-medium text-cyan-300">
                              {attr.label}
                            </td>
                            <td className="py-2 px-4 text-slate-300">{attr.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'live' && instanceDetails && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Status</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {instanceDetails.status || 'Active'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">IP Address</div>
                  <div className="text-sm font-bold text-cyan-300 mt-1 font-mono">
                    {instanceDetails.ip || instanceDetails.clusterIP || '10.96.0.1'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Namespace</div>
                  <div className="text-sm font-bold text-purple-300 mt-1 font-mono">
                    {instanceDetails.namespace || 'default'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Node / Zone</div>
                  <div className="text-sm font-bold text-amber-300 mt-1 font-mono truncate">
                    {instanceDetails.nodeId || instanceDetails.zone || 'worker-node-1'}
                  </div>
                </div>
              </div>

              {/* Dynamic Instance Controls */}
              {type === 'pod' && (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Simulate Pod Failure (Chaos Monkey)</h4>
                    <p className="text-[11px] text-slate-400">Trigger crash simulation to watch ReplicaSet self-heal this workload.</p>
                  </div>
                  <button
                    onClick={() => {
                      killPod(instanceDetails.id);
                      clearSelection();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-900/30"
                  >
                    Kill This Pod
                  </button>
                </div>
              )}

              {type === 'deployment' && (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200">Scale Replicas (Current: {instanceDetails.replicas})</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => scaleDeployment(instanceDetails.id, Math.max(1, instanceDetails.replicas - 1))}
                        className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold"
                      >
                        - 1
                      </button>
                      <button
                        onClick={() => scaleDeployment(instanceDetails.id, Math.min(8, instanceDetails.replicas + 1))}
                        className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                      >
                        + 1
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Mock Logs */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Container Stdout Stream
                </h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="text-slate-500">[2026-08-20 12:00:01] Container started in 240ms (image: {instanceDetails.containers?.[0]?.image || 'app:latest'})</div>
                  <div className="text-emerald-400">[2026-08-20 12:00:02] HTTP server listening on 0.0.0.0:{instanceDetails.containers?.[0]?.port || 80}</div>
                  <div className="text-slate-400">[2026-08-20 12:00:05] GET /healthz 200 OK - liveness probe passed</div>
                  <div className="text-cyan-400">[2026-08-20 12:00:10] Ingress traffic routed from Service: 200 OK</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Standard `kubectl` command line operations used by DevOps & Cloud engineers for this component:
                </p>
              </div>

              <div className="space-y-3">
                {concept.kubectlCommands.map((cmd, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 group hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">
                        {cmd.explanation}
                      </span>
                      <button
                        onClick={() => copyToClipboard(cmd.command)}
                        className="p-1 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                        title="Copy command"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="font-mono text-xs text-emerald-400 bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
                      <span className="text-slate-600 select-none">$</span>
                      <span className="select-all">{cmd.command}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'yaml' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Ready-to-apply Kubernetes YAML Manifest:
                </span>
                <button
                  onClick={() => copyToClipboard(concept.yamlSnippet)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 transition-colors border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy YAML'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed shadow-inner">
                <code>{concept.yamlSnippet}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
