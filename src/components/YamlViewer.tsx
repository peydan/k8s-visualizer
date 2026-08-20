import React, { useState } from 'react';
import { useCluster } from '../context/ClusterContext';
import { Copy, Check, Download, FileCode, Layers, Share2, Globe, Sliders, Lock, HardDrive } from 'lucide-react';

export const YamlViewer: React.FC = () => {
  const { state } = useCluster();
  const [selectedResource, setSelectedResource] = useState<'all' | 'deployments' | 'services' | 'ingress' | 'config' | 'storage'>('all');
  const [copied, setCopied] = useState(false);

  // Generate real YAML manifests based on cluster state
  const generateYaml = () => {
    const yamlChunks: string[] = [];

    // Namespace
    if (state.activeNamespace !== 'default') {
      yamlChunks.push(`apiVersion: v1
kind: Namespace
metadata:
  name: ${state.activeNamespace}`);
    }

    // ConfigMaps
    if (selectedResource === 'all' || selectedResource === 'config') {
      state.configMaps.forEach(cm => {
        let entries = '';
        Object.entries(cm.data).forEach(([k, v]) => {
          entries += `  ${k}: "${v}"\n`;
        });
        yamlChunks.push(`apiVersion: v1
kind: ConfigMap
metadata:
  name: ${cm.name}
  namespace: ${cm.namespace}
data:
${entries.trimEnd()}`);
      });
    }

    // Secrets
    if (selectedResource === 'all' || selectedResource === 'config') {
      state.secrets.forEach(sec => {
        let entries = '';
        Object.entries(sec.data).forEach(([k, v]) => {
          entries += `  ${k}: ${btoa(v)}\n`;
        });
        yamlChunks.push(`apiVersion: v1
kind: Secret
metadata:
  name: ${sec.name}
  namespace: ${sec.namespace}
type: ${sec.type}
data:
${entries.trimEnd()}`);
      });
    }

    // PVCs
    if (selectedResource === 'all' || selectedResource === 'storage') {
      state.pvcs.forEach(pvc => {
        yamlChunks.push(`apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ${pvc.name}
  namespace: ${pvc.namespace}
spec:
  accessModes:
    - ${pvc.accessModes.join('\n    - ')}
  resources:
    requests:
      storage: ${pvc.capacity}
  storageClassName: ${pvc.storageClass}`);
      });
    }

    // Deployments
    if (selectedResource === 'all' || selectedResource === 'deployments') {
      state.deployments.forEach(dep => {
        let envBlock = '';
        if (dep.container.env) {
          envBlock = `        env:\n` + Object.entries(dep.container.env).map(([k, v]) => `        - name: ${k}\n          value: "${v}"`).join('\n');
        }

        yamlChunks.push(`apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${dep.name}
  namespace: ${dep.namespace}
  labels:
    ${Object.entries(dep.selector).map(([k, v]) => `${k}: ${v}`).join('\n    ')}
spec:
  replicas: ${dep.replicas}
  selector:
    matchLabels:
      ${Object.entries(dep.selector).map(([k, v]) => `${k}: ${v}`).join('\n      ')}
  strategy:
    type: ${dep.strategy}
  template:
    metadata:
      labels:
        ${Object.entries(dep.selector).map(([k, v]) => `${k}: ${v}`).join('\n        ')}
    spec:
      containers:
      - name: ${dep.container.name}
        image: ${dep.container.image}
        ports:
        - containerPort: ${dep.container.port}
        resources:
          requests:
            cpu: "${dep.container.cpuRequest * 1000}m"
            memory: "${dep.container.memRequest}Mi"
${envBlock ? envBlock : ''}`.trimEnd());
      });
    }

    // Services
    if (selectedResource === 'all' || selectedResource === 'services') {
      state.services.forEach(svc => {
        yamlChunks.push(`apiVersion: v1
kind: Service
metadata:
  name: ${svc.name}
  namespace: ${svc.namespace}
spec:
  type: ${svc.type}
  selector:
    ${Object.entries(svc.selector).map(([k, v]) => `${k}: ${v}`).join('\n    ')}
  ports:
  - protocol: TCP
    port: ${svc.port}
    targetPort: ${svc.targetPort}`);
      });
    }

    // Ingress
    if ((selectedResource === 'all' || selectedResource === 'ingress') && state.ingress) {
      const ing = state.ingress;
      let pathBlocks = '';
      ing.rules.forEach(r => {
        pathBlocks += `      - path: ${r.path}
        pathType: Prefix
        backend:
          service:
            name: ${r.serviceName}
            port:
              number: ${r.servicePort}\n`;
      });

      yamlChunks.push(`apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${ing.name}
  namespace: ${ing.namespace}
  annotations:
    kubernetes.io/ingress.class: ${ing.controller}
    nginx.ingress.kubernetes.io/ssl-redirect: "${Boolean(ing.tlsEnabled)}"
spec:
  rules:
  - host: ${ing.rules[0]?.host || 'app.example.com'}
    http:
      paths:
${pathBlocks.trimEnd()}`);
    }

    // HPA
    if (state.hpa && (selectedResource === 'all' || selectedResource === 'deployments')) {
      const h = state.hpa;
      const targetDep = state.deployments.find(d => d.id === h.targetDeploymentId);
      yamlChunks.push(`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${h.name}
  namespace: ${h.namespace}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${targetDep?.name || 'app'}
  minReplicas: ${h.minReplicas}
  maxReplicas: ${h.maxReplicas}
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: ${h.targetCpuUtilization}`);
    }

    return yamlChunks.join('\n---\n');
  };

  const yamlOutput = generateYaml();

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yamlOutput], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `k8s-manifest-${state.activeNamespace}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <FileCode className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-mono">
                Live Kubernetes YAML Generator
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Production Manifests
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Declarative Kubernetes manifest matching your visual cluster setup in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy YAML'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download .yaml</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'all', label: 'All Resources', icon: FileCode },
            { id: 'deployments', label: 'Deployments & HPA', icon: Layers },
            { id: 'services', label: 'Services', icon: Share2 },
            { id: 'ingress', label: 'Ingress', icon: Globe },
            { id: 'config', label: 'ConfigMaps & Secrets', icon: Sliders },
            { id: 'storage', label: 'PVC Storage', icon: HardDrive }
          ] as const
        ).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedResource(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedResource === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Code Editor Preview */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-slate-300 font-bold">manifests.yaml</span>
          </div>
          <span>Syntax: YAML (k8s standard v1)</span>
        </div>

        <pre className="p-6 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed max-h-[600px] selection:bg-cyan-500/30">
          <code>{yamlOutput || '# No active resources found in cluster.'}</code>
        </pre>
      </div>
    </div>
  );
};
