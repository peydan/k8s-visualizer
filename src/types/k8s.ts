export type K8sComponentCategory =
  | 'control-plane'
  | 'compute'
  | 'workload'
  | 'networking'
  | 'config'
  | 'storage'
  | 'scaling';

export interface EducationalConcept {
  id: string;
  name: string;
  kind?: string;
  category: K8sComponentCategory;
  shortDescription: string;
  analogy: string;
  whyItMatters: string[];
  keyAttributes: { label: string; description: string }[];
  kubectlCommands: { command: string; explanation: string }[];
  yamlSnippet: string;
  iconName: string;
  color: string;
}

export type PodStatus = 'Running' | 'Pending' | 'ContainerCreating' | 'CrashLoopBackOff' | 'Terminating' | 'Completed';

export interface ContainerSpec {
  name: string;
  image: string;
  port: number;
  cpuRequest: number; // e.g. 0.2
  memRequest: number; // e.g. 128 (MB)
  env?: { [key: string]: string };
}

export interface PodInstance {
  id: string;
  name: string;
  deploymentId?: string;
  nodeId: string;
  namespace: string;
  status: PodStatus;
  ip: string;
  containers: ContainerSpec[];
  restartCount: number;
  cpuUsage: number; // percentage
  memoryUsage: number; // MB
  createdAt: number;
  configMapRefs?: string[];
  secretRefs?: string[];
  pvcRefs?: string[];
  labels: { [key: string]: string };
}

export type NodeType = 'master' | 'worker';
export type NodeStatus = 'Ready' | 'NotReady' | 'Cordoned' | 'Draining';

export interface K8sNode {
  id: string;
  name: string;
  type: NodeType;
  status: NodeStatus;
  ip: string;
  zone: string;
  cpuTotal: number; // e.g. 4 Cores
  cpuAllocated: number;
  memTotal: number; // e.g. 8192 MB
  memAllocated: number;
  pods: string[]; // Pod IDs assigned to this node
  roles: string[];
  kubeletStatus: 'Healthy' | 'Degraded';
  kubeProxyStatus: 'Active' | 'Inactive';
}

export interface K8sDeployment {
  id: string;
  name: string;
  namespace: string;
  replicas: number;
  selector: { [key: string]: string };
  container: ContainerSpec;
  strategy: 'RollingUpdate' | 'Recreate';
  configMaps: string[];
  secrets: string[];
  pvc?: string;
  hpaEnabled?: boolean;
}

export type ServiceType = 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'Headless';

export interface K8sService {
  id: string;
  name: string;
  namespace: string;
  type: ServiceType;
  clusterIP: string;
  nodePort?: number;
  externalIP?: string;
  port: number;
  targetPort: number;
  selector: { [key: string]: string };
  matchedPodIds: string[];
}

export interface IngressRule {
  host: string;
  path: string;
  serviceName: string;
  servicePort: number;
}

export interface K8sIngress {
  id: string;
  name: string;
  namespace: string;
  controller: 'nginx' | 'traefik' | 'alb';
  rules: IngressRule[];
  tlsEnabled?: boolean;
}

export interface K8sConfigMap {
  id: string;
  name: string;
  namespace: string;
  data: { [key: string]: string };
}

export interface K8sSecret {
  id: string;
  name: string;
  namespace: string;
  type: 'Opaque' | 'kubernetes.io/tls' | 'kubernetes.io/dockerconfigjson';
  data: { [key: string]: string }; // plaintext representation with toggle
}

export interface K8sPVC {
  id: string;
  name: string;
  namespace: string;
  capacity: string; // e.g. "10Gi"
  accessModes: string[];
  storageClass: string;
  status: 'Bound' | 'Pending' | 'Lost';
  boundPvId?: string;
}

export interface K8sHPA {
  id: string;
  name: string;
  namespace: string;
  targetDeploymentId: string;
  minReplicas: number;
  maxReplicas: number;
  targetCpuUtilization: number; // e.g. 70%
  currentCpuUtilization: number;
}

export interface SimulatedPacket {
  id: string;
  path: 'ingress' | 'service' | 'pod' | 'completed' | 'dropped';
  from: string;
  to: string;
  method: 'GET' | 'POST';
  url: string;
  statusCode?: number;
  targetPodId?: string;
  progress: number; // 0 to 100
}

export interface ClusterLog {
  id: string;
  timestamp: string;
  source: 'API-Server' | 'Kubelet' | 'Scheduler' | 'ControllerManager' | 'Kube-Proxy' | 'Ingress' | 'ChaosMonkey' | 'HPA';
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface MissionCheck {
  id: string;
  description: string;
  isComplete: (state: ClusterState) => boolean;
}

export interface LearningMission {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  description: string;
  keyLearning: string;
  hints: string[];
  recommendedPreset?: string;
  checks: MissionCheck[];
}

export interface ClusterState {
  nodes: K8sNode[];
  deployments: K8sDeployment[];
  pods: PodInstance[];
  services: K8sService[];
  ingress?: K8sIngress;
  configMaps: K8sConfigMap[];
  secrets: K8sSecret[];
  pvcs: K8sPVC[];
  hpa?: K8sHPA;
  activeNamespace: string;
  isTrafficActive: boolean;
  cpuLoadSimulation: number; // 0 to 100%
  logs: ClusterLog[];
  selectedElement: {
    type: 'concept' | 'node' | 'pod' | 'deployment' | 'service' | 'ingress' | 'configMap' | 'secret' | 'pvc' | 'controlPlane';
    id: string;
  } | null;
}
