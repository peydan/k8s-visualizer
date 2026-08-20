import React, { useState } from 'react';
import { useCluster } from '../context/ClusterContext';
import {
  Plus,
  Server,
  Layers,
  Share2,
  Globe,
  Sliders,
  Lock,
  HardDrive,
  ChevronDown,
  ChevronUp,
  Wrench
} from 'lucide-react';

export const ToolboxDrawer: React.FC = () => {
  const {
    addNode,
    addDeployment,
    addService,
    setIngressRule,
    addConfigMap,
    addSecret,
    addPVC,
    state
  } = useCluster();

  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<
    'deployment' | 'service' | 'ingress' | 'configMap' | 'secret' | 'pvc' | null
  >(null);

  // Form states
  const [depName, setDepName] = useState('web-app');
  const [depImage, setDepImage] = useState('nginx:alpine');
  const [depPort, setDepPort] = useState(80);
  const [depReplicas, setDepReplicas] = useState(2);

  const [svcName, setSvcName] = useState('web-svc');
  const [svcType, setSvcType] = useState<'ClusterIP' | 'NodePort' | 'LoadBalancer'>('ClusterIP');
  const [svcPort, setSvcPort] = useState(80);
  const [svcTargetPort, setSvcTargetPort] = useState(80);
  const [svcSelectorKey, setSvcSelectorKey] = useState('app');
  const [svcSelectorVal, setSvcSelectorVal] = useState('web-app');

  const [ingHost, setIngHost] = useState('app.example.com');
  const [ingPath, setIngPath] = useState('/');
  const [ingSvcName, setIngSvcName] = useState(state.services[0]?.name || 'web-svc');
  const [ingSvcPort, setIngSvcPort] = useState(80);

  const [cmName, setCmName] = useState('app-config');
  const [cmKey, setCmKey] = useState('FEATURE_FLAG');
  const [cmVal, setCmVal] = useState('enabled');

  const [secName, setSecName] = useState('db-auth');
  const [secKey, setSecKey] = useState('DB_PASSWORD');
  const [secVal, setSecVal] = useState('Secret2026!');

  const [pvcName, setPvcName] = useState('data-volume');
  const [pvcCap, setPvcCap] = useState('10Gi');

  const handleCreateDeployment = (e: React.FormEvent) => {
    e.preventDefault();
    addDeployment(depName, depImage, Number(depPort), Number(depReplicas));
    setActiveModal(null);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    addService(svcName, svcType, Number(svcPort), Number(svcTargetPort), svcSelectorKey, svcSelectorVal);
    setActiveModal(null);
  };

  const handleCreateIngress = (e: React.FormEvent) => {
    e.preventDefault();
    setIngressRule(ingHost, ingPath, ingSvcName, Number(ingSvcPort));
    setActiveModal(null);
  };

  const handleCreateConfigMap = (e: React.FormEvent) => {
    e.preventDefault();
    addConfigMap(cmName, { [cmKey]: cmVal });
    setActiveModal(null);
  };

  const handleCreateSecret = (e: React.FormEvent) => {
    e.preventDefault();
    addSecret(secName, { [secKey]: secVal });
    setActiveModal(null);
  };

  const handleCreatePVC = (e: React.FormEvent) => {
    e.preventDefault();
    addPVC(pvcName, pvcCap);
    setActiveModal(null);
  };

  return (
    <>
      {/* Floating Bottom Builder Toolbar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-2 flex items-center gap-1.5 ring-1 ring-white/10">
          <div className="px-3 py-1 text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 border-r border-slate-800 pr-3">
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span>Architecture Builder:</span>
          </div>

          {/* Add Worker Node */}
          <button
            onClick={addNode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600/30 text-xs font-semibold text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all"
            title="Add a new Worker Node to the cluster"
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>+ Node</span>
          </button>

          {/* Add Deployment */}
          <button
            onClick={() => setActiveModal('deployment')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-600/30 text-xs font-semibold text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all"
            title="Add a new Deployment with pod replicas"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Deployment</span>
          </button>

          {/* Add Service */}
          <button
            onClick={() => setActiveModal('service')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-600/30 text-xs font-semibold text-slate-200 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 transition-all"
            title="Add a Kubernetes Service"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Service</span>
          </button>

          {/* Add Ingress */}
          <button
            onClick={() => setActiveModal('ingress')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-xs font-semibold text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 transition-all"
            title="Add Ingress HTTP routing"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Ingress</span>
          </button>

          {/* Add Config */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
            <button
              onClick={() => setActiveModal('configMap')}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-all"
              title="Add ConfigMap"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            <button
              onClick={() => setActiveModal('secret')}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-slate-300 hover:text-rose-300 border border-slate-700 transition-all"
              title="Add Secret"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
            </button>

            <button
              onClick={() => setActiveModal('pvc')}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-purple-600/30 text-slate-300 hover:text-purple-300 border border-slate-700 transition-all"
              title="Add PVC Storage"
            >
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Add Deployment */}
      {activeModal === 'deployment' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Create New Deployment
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeployment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Deployment Name</label>
                <input
                  type="text"
                  value={depName}
                  onChange={(e) => setDepName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Container Image</label>
                <input
                  type="text"
                  value={depImage}
                  onChange={(e) => setDepImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Container Port</label>
                  <input
                    type="number"
                    value={depPort}
                    onChange={(e) => setDepPort(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Replicas (Pods)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={depReplicas}
                    onChange={(e) => setDepReplicas(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Create Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Service */}
      {activeModal === 'service' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                Create New Service
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Service Name</label>
                <input
                  type="text"
                  value={svcName}
                  onChange={(e) => setSvcName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Service Type</label>
                <select
                  value={svcType}
                  onChange={(e) => setSvcType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                >
                  <option value="ClusterIP">ClusterIP (Internal cluster network)</option>
                  <option value="NodePort">NodePort (Expose on Node IP:30000-32767)</option>
                  <option value="LoadBalancer">LoadBalancer (Cloud external public IP)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Service Port</label>
                  <input
                    type="number"
                    value={svcPort}
                    onChange={(e) => setSvcPort(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Target Port (Pod Port)</label>
                  <input
                    type="number"
                    value={svcTargetPort}
                    onChange={(e) => setSvcTargetPort(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Selector Key</label>
                  <input
                    type="text"
                    value={svcSelectorKey}
                    onChange={(e) => setSvcSelectorKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Selector Value</label>
                  <input
                    type="text"
                    value={svcSelectorVal}
                    onChange={(e) => setSvcSelectorVal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Ingress */}
      {activeModal === 'ingress' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                Configure Ingress Routing
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIngress} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Host Domain</label>
                <input
                  type="text"
                  value={ingHost}
                  onChange={(e) => setIngHost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Path Prefix</label>
                <input
                  type="text"
                  value={ingPath}
                  onChange={(e) => setIngPath(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Backend Service</label>
                  <select
                    value={ingSvcName}
                    onChange={(e) => setIngSvcName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    {state.services.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Service Port</label>
                  <input
                    type="number"
                    value={ingSvcPort}
                    onChange={(e) => setIngSvcPort(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Set Ingress Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add ConfigMap */}
      {activeModal === 'configMap' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Create ConfigMap
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateConfigMap} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">ConfigMap Name</label>
                <input
                  type="text"
                  value={cmName}
                  onChange={(e) => setCmName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Key</label>
                  <input
                    type="text"
                    value={cmKey}
                    onChange={(e) => setCmKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Value</label>
                  <input
                    type="text"
                    value={cmVal}
                    onChange={(e) => setCmVal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Save ConfigMap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Secret */}
      {activeModal === 'secret' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                Create Encrypted Secret
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSecret} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Secret Name</label>
                <input
                  type="text"
                  value={secName}
                  onChange={(e) => setSecName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Secret Key</label>
                  <input
                    type="text"
                    value={secKey}
                    onChange={(e) => setSecKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-rose-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Secret Value (Plaintext)</label>
                  <input
                    type="text"
                    value={secVal}
                    onChange={(e) => setSecVal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-rose-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Save Secret
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add PVC */}
      {activeModal === 'pvc' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                Create PersistentVolumeClaim
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePVC} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Claim Name</label>
                <input
                  type="text"
                  value={pvcName}
                  onChange={(e) => setPvcName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Storage Capacity</label>
                <input
                  type="text"
                  value={pvcCap}
                  onChange={(e) => setPvcCap(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-purple-500 focus:outline-none"
                  placeholder="e.g. 10Gi, 50Gi"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Create PVC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
