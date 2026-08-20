import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  ClusterState,
  K8sNode,
  K8sDeployment,
  PodInstance,
  K8sService,
  K8sIngress,
  K8sConfigMap,
  K8sSecret,
  K8sPVC,
  K8sHPA,
  ClusterLog,
  SimulatedPacket,
} from '../types/k8s';
import { ARCHITECTURE_PRESETS } from '../data/presets';
import confetti from 'canvas-confetti';

export type ViewMode = 'canvas' | 'missions' | 'yaml' | 'terminal' | 'glossary';

export type ElementType = NonNullable<ClusterState['selectedElement']>['type'];

interface ClusterContextType {
  state: ClusterState;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activePresetId: string;
  activeMissionId: string | null;
  setActiveMissionId: (id: string | null) => void;
  packets: SimulatedPacket[];
  
  // Actions
  loadPreset: (presetId: string) => void;
  resetCluster: () => void;
  selectElement: (type: ElementType, id: string) => void;
  clearSelection: () => void;
  
  // Compute & Nodes
  addNode: () => void;
  removeNode: (nodeId: string) => void;
  toggleNodeCordon: (nodeId: string) => void;
  drainNode: (nodeId: string) => void;
  
  // Workloads
  addDeployment: (name: string, image: string, port: number, replicas: number) => void;
  scaleDeployment: (deploymentId: string, replicas: number) => void;
  deleteDeployment: (deploymentId: string) => void;
  killPod: (podId: string) => void;
  
  // Networking
  addService: (name: string, type: K8sService['type'], port: number, targetPort: number, selectorKey: string, selectorValue: string) => void;
  deleteService: (serviceId: string) => void;
  setIngressRule: (host: string, path: string, serviceName: string, servicePort: number) => void;
  deleteIngress: () => void;
  
  // Config & Storage
  addConfigMap: (name: string, data: { [key: string]: string }) => void;
  addSecret: (name: string, data: { [key: string]: string }) => void;
  addPVC: (name: string, capacity: string) => void;
  
  // Simulations
  sendTraffic: () => void;
  triggerChaosMonkey: () => void;
  simulateCpuSpike: (percent: number) => void;
  clearLogs: () => void;
  
  // Terminal
  runKubectl: (cmd: string) => string;
}

const ClusterContext = createContext<ClusterContextType | undefined>(undefined);

const initialPreset = ARCHITECTURE_PRESETS[1]; // Web App with Service & Ingress

export const ClusterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');
  const [activePresetId, setActivePresetId] = useState<string>(initialPreset.id);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [packets, setPackets] = useState<SimulatedPacket[]>([]);
  
  const [state, setState] = useState<ClusterState>({
    nodes: initialPreset.state.nodes,
    deployments: initialPreset.state.deployments,
    pods: initialPreset.state.pods,
    services: initialPreset.state.services,
    ingress: initialPreset.state.ingress,
    configMaps: initialPreset.state.configMaps,
    secrets: initialPreset.state.secrets,
    pvcs: initialPreset.state.pvcs,
    hpa: initialPreset.state.hpa,
    activeNamespace: initialPreset.state.activeNamespace,
    isTrafficActive: false,
    cpuLoadSimulation: 30,
    logs: [
      {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString(),
        source: 'API-Server',
        type: 'info',
        message: 'Kubernetes cluster initialized in ready state.'
      },
      {
        id: 'log-2',
        timestamp: new Date().toLocaleTimeString(),
        source: 'ControllerManager',
        type: 'success',
        message: `Deployment "${initialPreset.state.deployments[0]?.name}" healthy with ${initialPreset.state.pods.length} replicas.`
      }
    ],
    selectedElement: null
  });

  const addLog = useCallback((source: ClusterLog['source'], type: ClusterLog['type'], message: string) => {
    setState(prev => ({
      ...prev,
      logs: [
        {
          id: 'log-' + Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          source,
          type,
          message
        },
        ...prev.logs.slice(0, 49) // keep last 50
      ]
    }));
  }, []);

  const selectElement = useCallback((type: ElementType, id: string) => {
    setState(prev => ({
      ...prev,
      selectedElement: { type, id }
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedElement: null }));
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const preset = ARCHITECTURE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setActivePresetId(presetId);
    setState(prev => ({
      ...prev,
      nodes: JSON.parse(JSON.stringify(preset.state.nodes)),
      deployments: JSON.parse(JSON.stringify(preset.state.deployments)),
      pods: JSON.parse(JSON.stringify(preset.state.pods)),
      services: JSON.parse(JSON.stringify(preset.state.services)),
      ingress: preset.state.ingress ? JSON.parse(JSON.stringify(preset.state.ingress)) : undefined,
      configMaps: JSON.parse(JSON.stringify(preset.state.configMaps)),
      secrets: JSON.parse(JSON.stringify(preset.state.secrets)),
      pvcs: JSON.parse(JSON.stringify(preset.state.pvcs)),
      hpa: preset.state.hpa ? JSON.parse(JSON.stringify(preset.state.hpa)) : undefined,
      activeNamespace: preset.state.activeNamespace,
      selectedElement: null
    }));
    addLog('API-Server', 'info', `Loaded architecture preset: "${preset.name}".`);
  }, [addLog]);

  const resetCluster = useCallback(() => {
    loadPreset(activePresetId);
  }, [activePresetId, loadPreset]);

  // Recalculate Service Endpoints and Node Pod allocations whenever pods/services change
  useEffect(() => {
    setState(prev => {
      // 1. Update node pod lists
      const updatedNodes = prev.nodes.map(node => {
        const assignedPodIds = prev.pods
          .filter(p => p.nodeId === node.id && p.status !== 'Terminating')
          .map(p => p.id);
        const cpuAllocated = prev.pods
          .filter(p => p.nodeId === node.id && p.status !== 'Terminating')
          .reduce((sum, p) => sum + (p.containers[0]?.cpuRequest || 0.25), 0);
        const memAllocated = prev.pods
          .filter(p => p.nodeId === node.id && p.status !== 'Terminating')
          .reduce((sum, p) => sum + (p.containers[0]?.memRequest || 128), 0);

        return {
          ...node,
          pods: assignedPodIds,
          cpuAllocated: Math.min(node.cpuTotal, Number(cpuAllocated.toFixed(2))),
          memAllocated: Math.min(node.memTotal, memAllocated)
        };
      });

      // 2. Update service matched pod IDs based on selector matching
      const updatedServices = prev.services.map(svc => {
        const matched = prev.pods.filter(pod => {
          if (pod.status !== 'Running') return false;
          if (pod.namespace !== svc.namespace) return false;
          return Object.entries(svc.selector).every(([k, v]) => pod.labels && pod.labels[k] === v);
        }).map(p => p.id);

        return {
          ...svc,
          matchedPodIds: matched
        };
      });

      return {
        ...prev,
        nodes: updatedNodes,
        services: updatedServices
      };
    });
  }, [state.pods.length, state.deployments.length]);

  // Node operations
  const addNode = useCallback(() => {
    const nextIndex = state.nodes.length + 1;
    const zones = ['us-east-1a', 'us-east-1b', 'us-east-1c', 'us-west-2a'];
    const newNode: K8sNode = {
      id: `node-worker-${Date.now().toString().slice(-4)}`,
      name: `worker-node-${nextIndex}`,
      type: 'worker',
      status: 'Ready',
      ip: `192.168.1.${100 + nextIndex}`,
      zone: zones[nextIndex % zones.length],
      cpuTotal: 4,
      cpuAllocated: 0,
      memTotal: 8192,
      memAllocated: 0,
      pods: [],
      roles: ['worker'],
      kubeletStatus: 'Healthy',
      kubeProxyStatus: 'Active'
    };

    setState(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    addLog('API-Server', 'success', `Node "${newNode.name}" joined the cluster with Ready status.`);
  }, [state.nodes.length, addLog]);

  const removeNode = useCallback((nodeId: string) => {
    setState(prev => {
      const nodeToRemove = prev.nodes.find(n => n.id === nodeId);
      if (!nodeToRemove) return prev;

      // Reassign pods on this node to other ready nodes
      const availableNodes = prev.nodes.filter(n => n.id !== nodeId && n.status === 'Ready');
      const updatedPods = prev.pods.map(pod => {
        if (pod.nodeId === nodeId) {
          const targetNode = availableNodes[Math.floor(Math.random() * availableNodes.length)];
          return {
            ...pod,
            nodeId: targetNode ? targetNode.id : 'unassigned',
            status: targetNode ? 'Running' : 'Pending'
          } as PodInstance;
        }
        return pod;
      });

      return {
        ...prev,
        nodes: prev.nodes.filter(n => n.id !== nodeId),
        pods: updatedPods
      };
    });
    addLog('API-Server', 'warning', `Worker node removed. Pods rescheduled onto remaining nodes.`);
  }, [addLog]);

  const toggleNodeCordon = useCallback((nodeId: string) => {
    setState(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => {
        if (n.id === nodeId) {
          const newStatus = n.status === 'Cordoned' ? 'Ready' : 'Cordoned';
          return { ...n, status: newStatus };
        }
        return n;
      })
    }));
    addLog('Scheduler', 'info', `Node scheduling status toggled.`);
  }, [addLog]);

  const drainNode = useCallback((nodeId: string) => {
    setState(prev => {
      const availableNodes = prev.nodes.filter(n => n.id !== nodeId && n.status === 'Ready');
      if (availableNodes.length === 0) {
        return prev;
      }

      const updatedPods = prev.pods.map(pod => {
        if (pod.nodeId === nodeId) {
          const target = availableNodes[Math.floor(Math.random() * availableNodes.length)];
          return { ...pod, nodeId: target.id };
        }
        return pod;
      });

      const updatedNodes = prev.nodes.map(n => n.id === nodeId ? { ...n, status: 'Cordoned' as const, pods: [] } : n);

      return {
        ...prev,
        nodes: updatedNodes,
        pods: updatedPods
      };
    });
    addLog('ControllerManager', 'warning', `Drained node: Evacuated all pods to healthy worker nodes.`);
  }, [addLog]);

  // Deployment operations
  const addDeployment = useCallback((name: string, image: string, port: number, replicas: number) => {
    const depId = `dep-${Date.now().toString().slice(-4)}`;
    const selector = { app: name.toLowerCase().replace(/\s+/g, '-') };
    const readyNodes = state.nodes.filter(n => n.status === 'Ready');
    
    if (readyNodes.length === 0) {
      addLog('Scheduler', 'error', `Failed to schedule: No Ready nodes available.`);
      return;
    }

    const newPods: PodInstance[] = [];
    for (let i = 0; i < replicas; i++) {
      const targetNode = readyNodes[i % readyNodes.length];
      const podId = `pod-${name.toLowerCase()}-${Math.random().toString(36).substring(2, 6)}`;
      newPods.push({
        id: podId,
        name: `${name.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}-${i + 1}`,
        deploymentId: depId,
        nodeId: targetNode.id,
        namespace: state.activeNamespace,
        status: 'Running',
        ip: `10.244.${(i % 3) + 1}.${10 + i}`,
        containers: [{
          name: name.toLowerCase(),
          image,
          port,
          cpuRequest: 0.2,
          memRequest: 128
        }],
        restartCount: 0,
        cpuUsage: 15,
        memoryUsage: 80,
        createdAt: Date.now(),
        labels: selector
      });
    }

    const newDep: K8sDeployment = {
      id: depId,
      name,
      namespace: state.activeNamespace,
      replicas,
      selector,
      container: {
        name: name.toLowerCase(),
        image,
        port,
        cpuRequest: 0.2,
        memRequest: 128
      },
      strategy: 'RollingUpdate',
      configMaps: [],
      secrets: []
    };

    setState(prev => ({
      ...prev,
      deployments: [...prev.deployments, newDep],
      pods: [...prev.pods, ...newPods]
    }));

    addLog('API-Server', 'success', `Created Deployment "${name}" with ${replicas} replicas.`);
    addLog('Scheduler', 'info', `Assigned ${replicas} Pods across available worker nodes.`);
  }, [state.nodes, state.activeNamespace, addLog]);

  const scaleDeployment = useCallback((deploymentId: string, targetReplicas: number) => {
    setState(prev => {
      const dep = prev.deployments.find(d => d.id === deploymentId);
      if (!dep) return prev;

      const currentPods = prev.pods.filter(p => p.deploymentId === deploymentId && p.status !== 'Terminating');
      const readyNodes = prev.nodes.filter(n => n.status === 'Ready');
      const diff = targetReplicas - currentPods.length;

      let updatedPods = [...prev.pods];

      if (diff > 0 && readyNodes.length > 0) {
        // Scale UP
        for (let i = 0; i < diff; i++) {
          const targetNode = readyNodes[(currentPods.length + i) % readyNodes.length];
          const newPod: PodInstance = {
            id: `pod-${dep.name}-${Math.random().toString(36).substring(2, 6)}`,
            name: `${dep.name}-${Math.random().toString(36).substring(2, 7)}-${currentPods.length + i + 1}`,
            deploymentId: dep.id,
            nodeId: targetNode.id,
            namespace: dep.namespace,
            status: 'Running',
            ip: `10.244.${(i % 3) + 1}.${Math.floor(Math.random() * 200) + 10}`,
            containers: [dep.container],
            restartCount: 0,
            cpuUsage: 18,
            memoryUsage: 90,
            createdAt: Date.now(),
            labels: dep.selector,
            configMapRefs: dep.configMaps,
            secretRefs: dep.secrets
          };
          updatedPods.push(newPod);
        }
      } else if (diff < 0) {
        // Scale DOWN
        const podsToRemove = currentPods.slice(0, Math.abs(diff)).map(p => p.id);
        updatedPods = updatedPods.filter(p => !podsToRemove.includes(p.id));
      }

      return {
        ...prev,
        deployments: prev.deployments.map(d => d.id === deploymentId ? { ...d, replicas: targetReplicas } : d),
        pods: updatedPods
      };
    });

    addLog('ControllerManager', 'info', `Deployment scaled to ${targetReplicas} replicas.`);
  }, [addLog]);

  const deleteDeployment = useCallback((deploymentId: string) => {
    setState(prev => {
      const dep = prev.deployments.find(d => d.id === deploymentId);
      return {
        ...prev,
        deployments: prev.deployments.filter(d => d.id !== deploymentId),
        pods: prev.pods.filter(p => p.deploymentId !== deploymentId)
      };
    });
    addLog('API-Server', 'warning', `Deleted deployment & purged associated pods.`);
  }, [addLog]);

  // Kill Pod with self-healing demonstration
  const killPod = useCallback((podId: string) => {
    const pod = state.pods.find(p => p.id === podId);
    if (!pod) return;

    addLog('ChaosMonkey', 'error', `Terminated Pod "${pod.name}" on ${pod.nodeId}. Simulating container crash.`);

    // 1. Mark pod as CrashLoopBackOff / Terminating
    setState(prev => ({
      ...prev,
      pods: prev.pods.map(p => p.id === podId ? { ...p, status: 'CrashLoopBackOff' as const } : p)
    }));

    // 2. Controller Manager notices replica deficit and recreates pod
    setTimeout(() => {
      setState(prev => {
        const deadPod = prev.pods.find(p => p.id === podId);
        if (!deadPod || !deadPod.deploymentId) {
          // If standalone pod, remove it
          return { ...prev, pods: prev.pods.filter(p => p.id !== podId) };
        }

        const dep = prev.deployments.find(d => d.id === deadPod.deploymentId);
        const readyNodes = prev.nodes.filter(n => n.status === 'Ready');
        const targetNode = readyNodes[Math.floor(Math.random() * readyNodes.length)] || prev.nodes[0];

        // Replacement pod
        const replacementPod: PodInstance = {
          id: `pod-${deadPod.deploymentId}-${Math.random().toString(36).substring(2, 6)}`,
          name: `${dep?.name || 'pod'}-${Math.random().toString(36).substring(2, 7)}-heal`,
          deploymentId: deadPod.deploymentId,
          nodeId: targetNode ? targetNode.id : 'unassigned',
          namespace: deadPod.namespace,
          status: 'ContainerCreating',
          ip: `10.244.1.${Math.floor(Math.random() * 150) + 20}`,
          containers: deadPod.containers,
          restartCount: deadPod.restartCount + 1,
          cpuUsage: 10,
          memoryUsage: 64,
          createdAt: Date.now(),
          labels: deadPod.labels,
          configMapRefs: deadPod.configMapRefs,
          secretRefs: deadPod.secretRefs
        };

        return {
          ...prev,
          pods: [...prev.pods.filter(p => p.id !== podId), replacementPod]
        };
      });

      addLog('ControllerManager', 'warning', `Self-healing triggered: ReplicaSet detected missing replica.`);
      addLog('Scheduler', 'info', `Assigned new replacement Pod to healthy worker node.`);

      // 3. Mark newly created pod as Running
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          pods: prev.pods.map(p => p.status === 'ContainerCreating' ? { ...p, status: 'Running' as const } : p)
        }));
        addLog('Kubelet', 'success', `Container started and passed liveness/readiness probes. Pod is Ready!`);
      }, 1400);
    }, 1000);
  }, [state.pods, addLog]);

  // Service operations
  const addService = useCallback((name: string, type: K8sService['type'], port: number, targetPort: number, selectorKey: string, selectorValue: string) => {
    const svcId = `svc-${Date.now().toString().slice(-4)}`;
    const selector = { [selectorKey]: selectorValue };
    const matched = state.pods.filter(p => p.labels && p.labels[selectorKey] === selectorValue && p.status === 'Running').map(p => p.id);

    const newSvc: K8sService = {
      id: svcId,
      name,
      namespace: state.activeNamespace,
      type,
      clusterIP: type === 'Headless' ? 'None' : `10.96.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}`,
      externalIP: type === 'LoadBalancer' ? `35.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}.12` : undefined,
      port,
      targetPort,
      selector,
      matchedPodIds: matched
    };

    setState(prev => ({
      ...prev,
      services: [...prev.services, newSvc]
    }));

    addLog('API-Server', 'success', `Created Service "${name}" (${type}) on port ${port}. Matched ${matched.length} backend pods.`);
  }, [state.pods, state.activeNamespace, addLog]);

  const deleteService = useCallback((serviceId: string) => {
    setState(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
    addLog('API-Server', 'warning', `Deleted Service.`);
  }, [addLog]);

  const setIngressRule = useCallback((host: string, path: string, serviceName: string, servicePort: number) => {
    setState(prev => ({
      ...prev,
      ingress: {
        id: 'ing-' + Date.now().toString().slice(-4),
        name: 'cluster-ingress',
        namespace: prev.activeNamespace,
        controller: 'nginx',
        rules: [
          ...(prev.ingress?.rules || []),
          { host, path, serviceName, servicePort }
        ],
        tlsEnabled: true
      }
    }));
    addLog('Ingress', 'success', `Configured Ingress routing: ${host}${path} -> ${serviceName}:${servicePort}`);
  }, [addLog]);

  const deleteIngress = useCallback(() => {
    setState(prev => ({ ...prev, ingress: undefined }));
    addLog('API-Server', 'warning', `Removed Ingress resource.`);
  }, [addLog]);

  // Config & Storage
  const addConfigMap = useCallback((name: string, data: { [key: string]: string }) => {
    const newCm: K8sConfigMap = {
      id: 'cm-' + Date.now().toString().slice(-4),
      name,
      namespace: state.activeNamespace,
      data
    };
    setState(prev => ({ ...prev, configMaps: [...prev.configMaps, newCm] }));
    addLog('API-Server', 'success', `ConfigMap "${name}" created with ${Object.keys(data).length} keys.`);
  }, [state.activeNamespace, addLog]);

  const addSecret = useCallback((name: string, data: { [key: string]: string }) => {
    const newSec: K8sSecret = {
      id: 'sec-' + Date.now().toString().slice(-4),
      name,
      namespace: state.activeNamespace,
      type: 'Opaque',
      data
    };
    setState(prev => ({ ...prev, secrets: [...prev.secrets, newSec] }));
    addLog('API-Server', 'success', `Secret "${name}" created (encrypted in etcd).`);
  }, [state.activeNamespace, addLog]);

  const addPVC = useCallback((name: string, capacity: string) => {
    const newPvc: K8sPVC = {
      id: 'pvc-' + Date.now().toString().slice(-4),
      name,
      namespace: state.activeNamespace,
      capacity,
      accessModes: ['ReadWriteOnce'],
      storageClass: 'standard-ssd',
      status: 'Bound',
      boundPvId: 'pv-' + Math.random().toString(36).substring(2, 7)
    };
    setState(prev => ({ ...prev, pvcs: [...prev.pvcs, newPvc] }));
    addLog('ControllerManager', 'success', `PVC "${name}" bound to dynamic PersistentVolume ${newPvc.boundPvId}.`);
  }, [state.activeNamespace, addLog]);

  // Traffic Simulation with animated packets
  const sendTraffic = useCallback(() => {
    if (state.services.length === 0) {
      addLog('Ingress', 'warning', `No services found in cluster to route HTTP traffic.`);
      return;
    }

    const randomSvc = state.services[0];
    const availablePods = state.pods.filter(p => randomSvc.matchedPodIds.includes(p.id) && p.status === 'Running');

    if (availablePods.length === 0) {
      addLog('Kube-Proxy', 'error', `503 Service Unavailable: No healthy pods matched service selector.`);
      return;
    }

    const chosenPod = availablePods[Math.floor(Math.random() * availablePods.length)];
    const packetId = 'pkt-' + Math.random().toString(36).substring(2, 7);

    const packet: SimulatedPacket = {
      id: packetId,
      path: state.ingress ? 'ingress' : 'service',
      from: 'Client Browser (Internet)',
      to: chosenPod.name,
      method: 'GET',
      url: state.ingress ? `https://${state.ingress.rules[0]?.host || 'app.k8s'}/` : `http://${randomSvc.clusterIP}:${randomSvc.port}`,
      statusCode: 200,
      targetPodId: chosenPod.id,
      progress: 0
    };

    setPackets(prev => [...prev, packet]);
    addLog('Ingress', 'info', `Incoming HTTP GET request from client.`);

    // Progress animation loop
    let step = 0;
    const interval = setInterval(() => {
      step += 25;
      setPackets(prev => prev.map(p => {
        if (p.id === packetId) {
          const nextPath = step >= 75 ? 'pod' : step >= 40 ? 'service' : 'ingress';
          return { ...p, progress: step, path: nextPath };
        }
        return p;
      }));

      if (step >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPackets(prev => prev.filter(p => p.id !== packetId));
          addLog('Kube-Proxy', 'success', `200 OK: Request served by Pod "${chosenPod.name}" on ${chosenPod.nodeId} (4ms latency).`);
        }, 500);
      }
    }, 250);
  }, [state.services, state.pods, state.ingress, addLog]);

  const triggerChaosMonkey = useCallback(() => {
    const runningPods = state.pods.filter(p => p.status === 'Running');
    if (runningPods.length === 0) {
      addLog('ChaosMonkey', 'warning', `No running pods found to kill.`);
      return;
    }
    const victim = runningPods[Math.floor(Math.random() * runningPods.length)];
    killPod(victim.id);
  }, [state.pods, killPod, addLog]);

  const simulateCpuSpike = useCallback((targetPercent: number) => {
    setState(prev => ({ ...prev, cpuLoadSimulation: targetPercent }));
    addLog('HPA', targetPercent >= 70 ? 'warning' : 'info', `Simulated cluster CPU load adjusted to ${targetPercent}%.`);

    // If HPA is active and CPU > target, trigger autoscaling!
    if (state.hpa && targetPercent >= state.hpa.targetCpuUtilization) {
      const dep = state.deployments.find(d => d.id === state.hpa?.targetDeploymentId);
      if (dep && dep.replicas < state.hpa.maxReplicas) {
        const scaledCount = Math.min(state.hpa.maxReplicas, dep.replicas + 2);
        setTimeout(() => {
          scaleDeployment(dep.id, scaledCount);
          addLog('HPA', 'success', `Autoscaler detected CPU > 70%. Scaled deployment "${dep.name}" up to ${scaledCount} replicas!`);
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 }
          });
        }, 1200);
      }
    }
  }, [state.hpa, state.deployments, scaleDeployment, addLog]);

  const clearLogs = useCallback(() => {
    setState(prev => ({ ...prev, logs: [] }));
  }, []);

  // Terminal command interpreter
  const runKubectl = useCallback((cmdStr: string): string => {
    const parts = cmdStr.trim().split(/\s+/);
    if (parts[0] !== 'kubectl') {
      return `Command not found: "${parts[0]}". Try "kubectl get pods", "kubectl get nodes", "kubectl cluster-info", etc.`;
    }

    const sub = parts[1];
    const resource = parts[2];

    if (!sub || sub === 'help' || sub === '--help') {
      return `Kubernetes CLI Simulator. Available commands:
  kubectl get (pods | nodes | deployments | services | ingress | configmaps | secrets | pvc | all)
  kubectl describe (pod | node | deployment | svc) <name>
  kubectl scale deployment <name> --replicas=<num>
  kubectl delete pod <name>
  kubectl cluster-info
  kubectl logs <pod-name>
  kubectl top nodes`;
    }

    if (sub === 'cluster-info') {
      return `Kubernetes control plane is running at https://127.0.0.1:6443
CoreDNS is running at https://127.0.0.1:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
etcd-cluster is healthy (consensus active)
Metrics-Server is running`;
    }

    if (sub === 'top' && resource === 'nodes') {
      let output = `NAME                 CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%\n`;
      state.nodes.forEach(n => {
        const cpuPct = Math.round((n.cpuAllocated / n.cpuTotal) * 100);
        const memPct = Math.round((n.memAllocated / n.memTotal) * 100);
        output += `${n.name.padEnd(20)} ${(n.cpuAllocated + ' cores').padEnd(12)} ${cpuPct}%    ${(n.memAllocated + 'Mi').padEnd(15)} ${memPct}%\n`;
      });
      return output;
    }

    if (sub === 'get') {
      if (!resource || resource === 'all') {
        let res = `=== PODS ===\nNAME                                  READY   STATUS    RESTARTS   AGE     NODE\n`;
        state.pods.forEach(p => {
          res += `${p.name.padEnd(37)} 1/1     ${p.status.padEnd(9)} ${p.restartCount}          12m     ${p.nodeId}\n`;
        });
        res += `\n=== SERVICES ===\nNAME                 TYPE        CLUSTER-IP       EXTERNAL-IP     PORT(S)\n`;
        state.services.forEach(s => {
          res += `${s.name.padEnd(20)} ${s.type.padEnd(11)} ${(s.clusterIP).padEnd(16)} ${(s.externalIP || '<none>').padEnd(15)} ${s.port}:${s.targetPort}/TCP\n`;
        });
        res += `\n=== DEPLOYMENTS ===\nNAME                 READY   UP-TO-DATE   AVAILABLE   AGE\n`;
        state.deployments.forEach(d => {
          const ready = state.pods.filter(p => p.deploymentId === d.id && p.status === 'Running').length;
          res += `${d.name.padEnd(20)} ${ready}/${d.replicas}     ${d.replicas}            ${ready}           15m\n`;
        });
        return res;
      }

      if (resource === 'pods' || resource === 'pod' || resource === 'po') {
        let res = `NAME                                  READY   STATUS    RESTARTS   AGE     IP            NODE\n`;
        state.pods.forEach(p => {
          res += `${p.name.padEnd(37)} 1/1     ${p.status.padEnd(9)} ${p.restartCount}          12m     ${p.ip.padEnd(13)} ${p.nodeId}\n`;
        });
        return res;
      }

      if (resource === 'nodes' || resource === 'node' || resource === 'no') {
        let res = `NAME                 STATUS   ROLES    AGE   VERSION   INTERNAL-IP\n`;
        state.nodes.forEach(n => {
          res += `${n.name.padEnd(20)} ${n.status.padEnd(8)} worker   18d   v1.30.2   ${n.ip}\n`;
        });
        return res;
      }

      if (resource === 'deployments' || resource === 'deployment' || resource === 'deploy') {
        let res = `NAME                 READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES\n`;
        state.deployments.forEach(d => {
          const ready = state.pods.filter(p => p.deploymentId === d.id && p.status === 'Running').length;
          res += `${d.name.padEnd(20)} ${ready}/${d.replicas}     ${d.replicas}            ${ready}           15m   ${d.container.name}        ${d.container.image}\n`;
        });
        return res;
      }

      if (resource === 'services' || resource === 'svc') {
        let res = `NAME                 TYPE        CLUSTER-IP       EXTERNAL-IP     PORT(S)         AGE\n`;
        state.services.forEach(s => {
          res += `${s.name.padEnd(20)} ${s.type.padEnd(11)} ${(s.clusterIP).padEnd(16)} ${(s.externalIP || '<none>').padEnd(15)} ${s.port}:${s.targetPort}/TCP   15m\n`;
        });
        return res;
      }

      if (resource === 'ingress' || resource === 'ing') {
        if (!state.ingress) return `No ingress resources found in ${state.activeNamespace} namespace.`;
        let res = `NAME             CLASS   HOSTS                 ADDRESS         PORTS     AGE\n`;
        const hosts = state.ingress.rules.map(r => r.host).join(',');
        res += `${state.ingress.name.padEnd(16)} nginx   ${hosts.padEnd(21)} 35.240.11.8     80, 443   15m\n`;
        return res;
      }

      if (resource === 'configmaps' || resource === 'cm') {
        let res = `NAME                 DATA   AGE\n`;
        state.configMaps.forEach(cm => {
          res += `${cm.name.padEnd(20)} ${Object.keys(cm.data).length}      25m\n`;
        });
        return res;
      }

      if (resource === 'secrets' || resource === 'secret') {
        let res = `NAME                 TYPE     DATA   AGE\n`;
        state.secrets.forEach(sec => {
          res += `${sec.name.padEnd(20)} Opaque   ${Object.keys(sec.data).length}      25m\n`;
        });
        return res;
      }

      if (resource === 'pvc') {
        let res = `NAME                 STATUS   VOLUME             CAPACITY   ACCESS MODES   STORAGECLASS   AGE\n`;
        state.pvcs.forEach(pvc => {
          res += `${pvc.name.padEnd(20)} ${pvc.status.padEnd(8)} ${(pvc.boundPvId || 'pending').padEnd(18)} ${pvc.capacity.padEnd(10)} RWO            ${pvc.storageClass}    30m\n`;
        });
        return res;
      }
    }

    if (sub === 'scale') {
      const depName = parts[3];
      const replArg = parts.find(p => p.startsWith('--replicas='));
      if (replArg) {
        const count = parseInt(replArg.split('=')[1], 10);
        const dep = state.deployments.find(d => d.name === depName || d.id === depName);
        if (dep && !isNaN(count)) {
          scaleDeployment(dep.id, count);
          return `deployment.apps/${dep.name} scaled to ${count}`;
        }
      }
      return `Usage: kubectl scale deployment <deployment-name> --replicas=<count>`;
    }

    if (sub === 'delete' && (resource === 'pod' || resource === 'po')) {
      const podName = parts[3];
      const pod = state.pods.find(p => p.name === podName || p.id === podName);
      if (pod) {
        killPod(pod.id);
        return `pod "${pod.name}" deleted (self-healing triggered)`;
      }
      return `Error from server (NotFound): pods "${podName}" not found`;
    }

    if (sub === 'logs') {
      const podName = parts[2];
      const pod = state.pods.find(p => p.name === podName || p.id === podName);
      if (pod) {
        return `[2026-08-20T12:00:01Z] [info] Starting ${pod.containers[0]?.name || 'app'} server on port ${pod.containers[0]?.port || 80}
[2026-08-20T12:00:02Z] [info] Readiness probe: HTTP GET /healthz 200 OK
[2026-08-20T12:00:05Z] [info] Connected to internal cluster network (${pod.ip})
[2026-08-20T12:00:10Z] [info] Ready to accept incoming TCP traffic`;
      }
      return `Error from server (NotFound): pods "${podName}" not found`;
    }

    return `Command executed: "${cmdStr}". (For list of commands type 'kubectl help')`;
  }, [state, scaleDeployment, killPod]);

  return (
    <ClusterContext.Provider
      value={{
        state,
        viewMode,
        setViewMode,
        activePresetId,
        activeMissionId,
        setActiveMissionId,
        packets,
        loadPreset,
        resetCluster,
        selectElement,
        clearSelection,
        addNode,
        removeNode,
        toggleNodeCordon,
        drainNode,
        addDeployment,
        scaleDeployment,
        deleteDeployment,
        killPod,
        addService,
        deleteService,
        setIngressRule,
        deleteIngress,
        addConfigMap,
        addSecret,
        addPVC,
        sendTraffic,
        triggerChaosMonkey,
        simulateCpuSpike,
        clearLogs,
        runKubectl
      }}
    >
      {children}
    </ClusterContext.Provider>
  );
};

export const useCluster = () => {
  const context = useContext(ClusterContext);
  if (!context) {
    throw new Error('useCluster must be used within a ClusterProvider');
  }
  return context;
};
