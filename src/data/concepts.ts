import { EducationalConcept } from '../types/k8s';

export const K8S_CONCEPTS: Record<string, EducationalConcept> = {
  'api-server': {
    id: 'api-server',
    name: 'kube-apiserver',
    kind: 'Control Plane Component',
    category: 'control-plane',
    shortDescription: 'The central gateway and brain of the entire Kubernetes cluster.',
    analogy: 'Think of the API Server like the Airport Control Tower or Main Receptionist. Everything and everyone (users, kubectl, nodes, controllers) must talk to it.',
    whyItMatters: [
      'Exposes the Kubernetes REST API to accept YAML manifests and commands.',
      'Authenticates, authorizes, and validates all incoming requests before storing them.',
      'Acts as the ONLY component allowed to communicate directly with etcd (the database).',
      'Scales horizontally across master nodes for high availability.'
    ],
    keyAttributes: [
      { label: 'Default Port', description: '6443 (HTTPS)' },
      { label: 'Protocols', description: 'REST over HTTP/JSON & Protocol Buffers' },
      { label: 'Role', description: 'Stateless API Gateway & Coordinator' }
    ],
    kubectlCommands: [
      { command: 'kubectl cluster-info', explanation: 'Prints the address of the API server & active control plane' },
      { command: 'kubectl api-resources', explanation: 'Lists all available API resources served by api-server' },
      { command: 'kubectl get --raw /livez', explanation: 'Direct health check endpoint of the API Server' }
    ],
    yamlSnippet: `# Static Pod definition for kube-apiserver
apiVersion: v1
kind: Pod
metadata:
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - name: kube-apiserver
    image: registry.k8s.io/kube-apiserver:v1.30.0
    command:
    - kube-apiserver
    - --etcd-servers=https://127.0.0.1:2379
    - --service-cluster-ip-range=10.96.0.0/12`,
    iconName: 'Server',
    color: '#3b82f6'
  },
  'etcd': {
    id: 'etcd',
    name: 'etcd Key-Value Store',
    kind: 'Control Plane Component',
    category: 'control-plane',
    shortDescription: 'Consistent, highly available distributed key-value store holding the complete state of the cluster.',
    analogy: 'The master database or permanent ledger of the cluster. If a resource isn\'t in etcd, Kubernetes doesn\'t know it exists!',
    whyItMatters: [
      'Stores the entire cluster state, configuration, secrets, and real-time status.',
      'Uses the Raft consensus algorithm for strong consistency across distributed nodes.',
      'Supports "watch" notifications so controllers can react instantaneously when state changes.',
      'Critical disaster recovery point—backing up etcd means backing up the entire cluster.'
    ],
    keyAttributes: [
      { label: 'Consensus Algorithm', description: 'Raft (Quorum: (N/2)+1)' },
      { label: 'Port', description: '2379 (Client), 2380 (Peer communication)' },
      { label: 'Storage Type', description: 'B-tree / Memory-mapped MVCC store' }
    ],
    kubectlCommands: [
      { command: 'etcdctl member list', explanation: 'Lists all cluster etcd peers in the consensus group' },
      { command: 'etcdctl snapshot save backup.db', explanation: 'Takes an instant point-in-time snapshot backup of the cluster' }
    ],
    yamlSnippet: `# etcd static pod snippet
apiVersion: v1
kind: Pod
metadata:
  name: etcd
  namespace: kube-system
spec:
  containers:
  - name: etcd
    image: registry.k8s.io/etcd:3.5.12-0
    command:
    - etcd
    - --data-dir=/var/lib/etcd
    - --listen-client-urls=https://127.0.0.1:2379`,
    iconName: 'Database',
    color: '#06b6d4'
  },
  'scheduler': {
    id: 'scheduler',
    name: 'kube-scheduler',
    kind: 'Control Plane Component',
    category: 'control-plane',
    shortDescription: 'Watches for newly created unscheduled Pods and assigns them to the best Worker Node.',
    analogy: 'The Logistics Matchmaker or Hotel Concierge. It checks each guest (Pod) requirements and matches them with an empty room (Node) that has enough beds (CPU/RAM).',
    whyItMatters: [
      'Evaluates resource constraints (CPU, RAM, GPUs requested).',
      'Enforces node affinity, anti-affinity, taints, tolerations, and topology spreads.',
      'Performs two phases: Filtering (finding feasible nodes) and Scoring (ranking the best node).',
      'Never runs containers itself—it merely writes the node assignment back to the API Server.'
    ],
    keyAttributes: [
      { label: 'Two-Phase Algorithm', description: 'Filtering (Predicates) -> Scoring (Priorities)' },
      { label: 'Customization', description: 'Support for multiple custom schedulers & plugins' }
    ],
    kubectlCommands: [
      { command: 'kubectl get events --sort-by=.metadata.creationTimestamp', explanation: 'See scheduler decisions & pod placement events' },
      { command: 'kubectl describe pod <name> | grep Node:', explanation: 'Check which node the scheduler assigned a pod to' }
    ],
    yamlSnippet: `# How a Pod asks the scheduler for constraints
apiVersion: v1
kind: Pod
metadata:
  name: nginx-scheduled
spec:
  nodeSelector:
    disktype: ssd
  containers:
  - name: nginx
    image: nginx:alpine
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"`,
    iconName: 'Compass',
    color: '#a855f7'
  },
  'controller-manager': {
    id: 'controller-manager',
    name: 'kube-controller-manager',
    kind: 'Control Plane Component',
    category: 'control-plane',
    shortDescription: 'Runs core control loop processes to continuously reconcile current state with desired state.',
    analogy: 'The Autopilot & Thermostat of Kubernetes. If you asked for 3 replicas and only 2 are alive, it notices the difference and creates the 3rd.',
    whyItMatters: [
      'Bundles multiple controllers: Node Controller, ReplicaSet Controller, EndpointSlice Controller, ServiceAccount Controller.',
      'Implements the fundamental declarative loop: "Observe -> Compare -> Reconcile".',
      'Handles node failure detection and evicts pods after node timeouts.'
    ],
    keyAttributes: [
      { label: 'Control Loop Frequency', description: 'Continuous / Event-driven sync loops' },
      { label: 'Design Principle', description: 'Level-triggered declarative reconciliation' }
    ],
    kubectlCommands: [
      { command: 'kubectl get deployments -w', explanation: 'Watch controller-manager scale up or down replicas in real time' }
    ],
    yamlSnippet: `# Desired state declared by user, reconciled by Controller Manager
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  replicas: 4 # Controller Manager guarantees 4 are always running!
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:latest`,
    iconName: 'Cpu',
    color: '#ec4899'
  },
  'node': {
    id: 'node',
    name: 'Worker Node',
    kind: 'Compute Infrastructure',
    category: 'compute',
    shortDescription: 'A physical or virtual machine in the cluster that runs containerized workloads.',
    analogy: 'A cargo freighter in a shipping port. Each ship has a specific deck capacity (CPU and Memory) to hold shipping containers (Pods).',
    whyItMatters: [
      'Provides raw compute (CPU, RAM, GPU, Disk) for your applications.',
      'Runs the Kubelet daemon, container runtime (containerd/CRI-O), and kube-proxy.',
      'Can be dynamically cordoned, drained for maintenance, or auto-scaled.'
    ],
    keyAttributes: [
      { label: 'Key Daemons', description: 'kubelet, kube-proxy, container runtime' },
      { label: 'Lifecycle States', description: 'Ready, NotReady, Cordoned (SchedulingDisabled), Draining' }
    ],
    kubectlCommands: [
      { command: 'kubectl get nodes -o wide', explanation: 'Lists all cluster nodes with IP addresses, OS, and status' },
      { command: 'kubectl top nodes', explanation: 'Displays real-time CPU & Memory consumption per node' },
      { command: 'kubectl cordon <node-name>', explanation: 'Prevents new pods from being scheduled on this node' },
      { command: 'kubectl drain <node-name> --ignore-daemonsets', explanation: 'Safely evicts all running pods for maintenance' }
    ],
    yamlSnippet: `# Node Object specification in Kubernetes
apiVersion: v1
kind: Node
metadata:
  name: worker-node-01
  labels:
    node.kubernetes.io/instance-type: m5.large
    topology.kubernetes.io/zone: us-east-1a
status:
  capacity:
    cpu: "4"
    memory: "16384Mi"
    pods: "110"`,
    iconName: 'Layers',
    color: '#3b82f6'
  },
  'kubelet': {
    id: 'kubelet',
    name: 'kubelet Agent',
    kind: 'Node Agent',
    category: 'compute',
    shortDescription: 'The primary agent running on each worker node ensuring containers described in PodSpecs are alive and healthy.',
    analogy: 'The Ship Captain on each freighter. It receives orders from the central office (API Server), downloads container images, starts them, and regularly checks if they are alive.',
    whyItMatters: [
      'Talks to the container runtime via CRI (Container Runtime Interface).',
      'Executes Liveness, Readiness, and Startup health probes.',
      'Mounts secrets, configmaps, and storage volumes into containers.',
      'Reports node and pod status back to the API server.'
    ],
    keyAttributes: [
      { label: 'Port', description: '10250 (HTTPS)' },
      { label: 'Interface', description: 'CRI (Container Runtime Interface), CNI, CSI' }
    ],
    kubectlCommands: [
      { command: 'systemctl status kubelet', explanation: 'Check node kubelet systemd service status on Linux host' },
      { command: 'journalctl -u kubelet -f', explanation: 'Stream live kubelet runtime logs' }
    ],
    yamlSnippet: `# Kubelet executes container lifecycle & health probes
spec:
  containers:
  - name: app
    image: myapp:v1
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 10`,
    iconName: 'Activity',
    color: '#10b981'
  },
  'pod': {
    id: 'pod',
    name: 'Pod',
    kind: 'Workload Primitive',
    category: 'workload',
    shortDescription: 'The smallest and simplest deployable unit in Kubernetes, representing a single instance of a running process.',
    analogy: 'A pod of dolphins or a shipping container hold. A Pod encapsulates one or more closely tied containers that share localhost networking and storage volumes.',
    whyItMatters: [
      'Every Pod gets its own unique Cluster IP address.',
      'All containers inside the same Pod share `localhost` and network namespace.',
      'Containers in a Pod can share storage volumes mounted at different paths.',
      'Pods are ephemeral (mortal) by design—they should be managed by Deployments or StatefulSets.'
    ],
    keyAttributes: [
      { label: 'IP Assignment', description: 'Unique IP per Pod (flat network)' },
      { label: 'Multi-Container Patterns', description: 'Sidecar, Ambassador, Adapter patterns' },
      { label: 'Phases', description: 'Pending -> ContainerCreating -> Running -> Succeeded/Failed' }
    ],
    kubectlCommands: [
      { command: 'kubectl get pods -o wide', explanation: 'Lists all pods with status, node placement, IP, and restarts' },
      { command: 'kubectl logs <pod-name> -c <container>', explanation: 'Streams stdout logs from a specific container' },
      { command: 'kubectl exec -it <pod-name> -- /bin/sh', explanation: 'Opens an interactive shell inside a running pod' },
      { command: 'kubectl delete pod <pod-name>', explanation: 'Deletes a pod (triggers self-healing if under a Deployment)' }
    ],
    yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: web-frontend
  labels:
    app: frontend
    tier: web
spec:
  containers:
  - name: web
    image: nginx:1.25-alpine
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "256Mi"
        cpu: "500m"`,
    iconName: 'Box',
    color: '#10b981'
  },
  'deployment': {
    id: 'deployment',
    name: 'Deployment',
    kind: 'Workload Controller',
    category: 'workload',
    shortDescription: 'Declarative manager for Pods and ReplicaSets that provides zero-downtime rolling updates, rollbacks, and self-healing.',
    analogy: 'The Fleet Commander. Instead of managing individual ships, you tell the commander "Keep 5 ships running version 2.0 at all times".',
    whyItMatters: [
      'Self-Healing: Automatically recreates dead or crashed pods immediately.',
      'Rolling Updates: Seamlessly updates pods one-by-one without taking the service down.',
      'Rollbacks: 1-command undo (`kubectl rollout undo`) if a bad version is deployed.',
      'Declarative Scaling: Easily scale up/down with `kubectl scale` or HPA.'
    ],
    keyAttributes: [
      { label: 'Default Strategy', description: 'RollingUpdate (maxSurge: 25%, maxUnavailable: 25%)' },
      { label: 'Under the Hood', description: 'Manages ReplicaSets, which in turn manage Pods' }
    ],
    kubectlCommands: [
      { command: 'kubectl scale deployment <name> --replicas=5', explanation: 'Scales the deployment to 5 pod replicas' },
      { command: 'kubectl set image deployment/<name> app=nginx:1.26', explanation: 'Triggers a zero-downtime rolling update' },
      { command: 'kubectl rollout status deployment/<name>', explanation: 'Watches the rolling update progress' },
      { command: 'kubectl rollout undo deployment/<name>', explanation: 'Instantly rolls back to the previous revision' }
    ],
    yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: node:20-alpine
        ports:
        - containerPort: 3000`,
    iconName: 'Layers',
    color: '#06b6d4'
  },
  'replicaset': {
    id: 'replicaset',
    name: 'ReplicaSet',
    kind: 'Workload Controller',
    category: 'workload',
    shortDescription: 'Ensures a specified number of identical Pod replicas are running at any given time.',
    analogy: 'The Factory Floor Manager whose single job is to make sure exactly N widgets are always on the shelf.',
    whyItMatters: [
      'Uses label selectors to identify and own matching Pods.',
      'Creates new Pods if count drops; deletes extra Pods if count is exceeded.',
      'Usually created and managed automatically by Deployments rather than created manually.'
    ],
    keyAttributes: [
      { label: 'Managed By', description: 'Higher-level Deployments' },
      { label: 'Key Selector', description: 'MatchLabels & MatchExpressions' }
    ],
    kubectlCommands: [
      { command: 'kubectl get rs', explanation: 'Lists all active ReplicaSets and desired vs current pod counts' },
      { command: 'kubectl describe rs <name>', explanation: 'Inspects ReplicaSet events and owned Pods' }
    ],
    yamlSnippet: `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend-rs
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: php-redis:v1`,
    iconName: 'Copy',
    color: '#8b5cf6'
  },
  'service': {
    id: 'service',
    name: 'Service (K8s Service)',
    kind: 'Networking Primitive',
    category: 'networking',
    shortDescription: 'An abstract way to expose an application running on a set of Pods with a stable IP, DNS name, and load balancing.',
    analogy: 'A Reception Desk with a permanent phone number. Pods come and go and change IP addresses constantly, but the Service has one permanent internal DNS name and forwards callers to healthy Pods.',
    whyItMatters: [
      'Provides a permanent virtual ClusterIP and stable internal DNS (`service-name.namespace.svc.cluster.local`).',
      'Automatically load-balances incoming traffic across all healthy Pods matching its selector.',
      'Decouples frontend clients from the ephemeral lifecycle and shifting IPs of backend Pods.',
      'Available in 4 flavors: ClusterIP (Internal), NodePort (Node port exposure), LoadBalancer (Cloud LB), and Headless (DNS-only).'
    ],
    keyAttributes: [
      { label: 'Types', description: 'ClusterIP, NodePort (30000-32767), LoadBalancer, Headless' },
      { label: 'Mechanism', description: 'Implemented by kube-proxy using iptables or IPVS' }
    ],
    kubectlCommands: [
      { command: 'kubectl get svc', explanation: 'Lists services, ClusterIPs, External IPs, and open ports' },
      { command: 'kubectl describe svc <name>', explanation: 'Shows backend target endpoints (healthy matching pod IPs)' },
      { command: 'kubectl port-forward svc/<name> 8080:80', explanation: 'Forwards local port 8080 directly to the cluster service' }
    ],
    yamlSnippet: `apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP # Or NodePort / LoadBalancer
  selector:
    app: api      # Finds Pods with label "app: api"
  ports:
  - protocol: TCP
    port: 80        # Service Port
    targetPort: 3000 # Pod Port`,
    iconName: 'Share2',
    color: '#f59e0b'
  },
  'ingress': {
    id: 'ingress',
    name: 'Ingress & Ingress Controller',
    kind: 'Networking Primitive',
    category: 'networking',
    shortDescription: 'Manages external HTTP/HTTPS routing into services within the cluster based on hostnames and URL paths.',
    analogy: 'The Grand Entrance and Directory Board of a skyscraper. Visitors arrive at `company.com/shop` and the security desk directs them to the 3rd floor (Shop Service).',
    whyItMatters: [
      'Consolidates routing rules: exposes 100s of internal services behind a single public IP address.',
      'Provides SSL/TLS termination, path rewriting, and host-based virtual hosting (`app.example.com` vs `api.example.com`).',
      'Requires an Ingress Controller (e.g., NGINX Ingress, Traefik, AWS ALB Controller) to execute the rules.'
    ],
    keyAttributes: [
      { label: 'Layer', description: 'Application Layer 7 (HTTP/HTTPS)' },
      { label: 'Key Features', description: 'Path-based routing, Host routing, TLS Termination' }
    ],
    kubectlCommands: [
      { command: 'kubectl get ingress', explanation: 'Lists ingress resources, public hosts, and addresses' },
      { command: 'kubectl describe ingress <name>', explanation: 'Displays paths, backend service targets, and TLS certs' }
    ],
    yamlSnippet: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80`,
    iconName: 'Globe',
    color: '#10b981'
  },
  'configmap': {
    id: 'configmap',
    name: 'ConfigMap',
    kind: 'Configuration Object',
    category: 'config',
    shortDescription: 'Stores non-confidential configuration data in key-value pairs to keep application code decoupled from environment configs.',
    analogy: 'The Settings File or `.env` configuration passed into the app when starting up.',
    whyItMatters: [
      'Separates container images from specific environments (dev, staging, prod).',
      'Can be injected into Pods as Environment Variables, CLI command arguments, or mounted as configuration files.',
      'Updates to mounted ConfigMaps can be hot-reloaded without rebuilding container images.'
    ],
    keyAttributes: [
      { label: 'Data Limit', description: '1 MiB max per ConfigMap' },
      { label: 'Injection Modes', description: 'Env vars (valueFrom / envFrom) or Volume mounts' }
    ],
    kubectlCommands: [
      { command: 'kubectl create configmap app-config --from-literal=APP_COLOR=blue', explanation: 'Quickly creates a ConfigMap from CLI' },
      { command: 'kubectl get configmaps', explanation: 'Lists all stored ConfigMaps' }
    ],
    yamlSnippet: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
  database.properties: |
    host=db.internal.svc
    pool_size=20`,
    iconName: 'Sliders',
    color: '#06b6d4'
  },
  'secret': {
    id: 'secret',
    name: 'Secret',
    kind: 'Configuration Object',
    category: 'config',
    shortDescription: 'Stores and manages sensitive information such as passwords, OAuth tokens, and SSH keys.',
    analogy: 'A Digital Safety Deposit Box. It stores sensitive credentials separately from application manifests and mounts them in memory (tmpfs) inside containers.',
    whyItMatters: [
      'Base64 encoded by default; can be encrypted at rest in etcd with KMS keys.',
      'Mounted into Pod containers as in-memory files (RAM) so they never touch physical node disk.',
      'Restricts RBAC access so only authorized service accounts and namespaces can read credentials.'
    ],
    keyAttributes: [
      { label: 'Storage Mechanism', description: 'tmpfs (in-memory RAM) when mounted in Pods' },
      { label: 'Secret Types', description: 'Opaque, kubernetes.io/tls, kubernetes.io/dockerconfigjson' }
    ],
    kubectlCommands: [
      { command: 'kubectl create secret generic db-secret --from-literal=password=SuperSecret123', explanation: 'Creates an encrypted secret' },
      { command: 'kubectl get secrets', explanation: 'Lists stored secret names without revealing plain values' }
    ],
    yamlSnippet: `apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  # Base64 encoded values
  username: YWRtaW4= # admin
  password: c2VjcmV0cGFzc3dvcmQ= # secretpassword`,
    iconName: 'Lock',
    color: '#ef4444'
  },
  'pvc': {
    id: 'pvc',
    name: 'PersistentVolumeClaim (PVC)',
    kind: 'Storage Primitive',
    category: 'storage',
    shortDescription: 'A user\'s request for persistent storage with specific capacity and access modes.',
    analogy: 'A Storage Ticket or Voucher. A Pod requests a 50GB SSD volume (PVC); Kubernetes finds or provisions a matching Physical Hard Drive (PersistentVolume) and binds them together.',
    whyItMatters: [
      'Pod containers have ephemeral filesystems by default—data is erased if a pod crashes or restarts.',
      'PVCs allow databases (Postgres, MySQL, MongoDB) to retain data across pod restarts, upgrades, and node migrations.',
      'Decouples developers (who create PVCs) from cluster admins / storage drivers (who provision PVs).'
    ],
    keyAttributes: [
      { label: 'Access Modes', description: 'ReadWriteOnce (RWO), ReadOnlyMany (ROX), ReadWriteMany (RWX)' },
      { label: 'Dynamic Provisioning', description: 'Automatically provisioned via StorageClasses (e.g. AWS EBS, GCP PD)' }
    ],
    kubectlCommands: [
      { command: 'kubectl get pvc', explanation: 'Checks claim status (Bound, Pending, Lost) and volume binding' },
      { command: 'kubectl get pv', explanation: 'Lists physical cluster storage volumes' }
    ],
    yamlSnippet: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  storageClassName: standard-ssd`,
    iconName: 'HardDrive',
    color: '#8b5cf6'
  },
  'hpa': {
    id: 'hpa',
    name: 'HorizontalPodAutoscaler (HPA)',
    kind: 'Scalability Primitive',
    category: 'scaling',
    shortDescription: 'Automatically scales the number of Pod replicas in a Deployment based on observed CPU/Memory utilization or custom metrics.',
    analogy: 'An Elastic Team. When the store gets crowded on Black Friday, HPA calls more cashiers; when foot traffic slows, it safely scales down.',
    whyItMatters: [
      'Prevents application outages during traffic spikes by automatically scaling up.',
      'Saves cloud infrastructure costs by scaling down pods when idle.',
      'Works with standard metrics (CPU, RAM) as well as custom metrics (HTTP requests/sec, Kafka queue lag).'
    ],
    keyAttributes: [
      { label: 'Evaluation Period', description: 'Every 15 seconds by default' },
      { label: 'Scaling Formula', description: 'desiredReplicas = ceil[currentReplicas * (currentMetric / targetMetric)]' }
    ],
    kubectlCommands: [
      { command: 'kubectl get hpa', explanation: 'Inspects HPA current targets, min/max pods, and current replicas' },
      { command: 'kubectl autoscale deployment api --min=2 --max=10 --cpu-percent=75', explanation: 'Creates an HPA rule with 1 command' }
    ],
    yamlSnippet: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-autoscaler
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70`,
    iconName: 'TrendingUp',
    color: '#10b981'
  },
  'namespace': {
    id: 'namespace',
    name: 'Namespace',
    kind: 'Cluster Virtualization',
    category: 'control-plane',
    shortDescription: 'Provides a mechanism for isolating groups of resources and environments within a single physical cluster.',
    analogy: 'Apartments in a large building. Each family (team/environment) has their own space (`dev`, `staging`, `prod`) while sharing the building\'s foundation.',
    whyItMatters: [
      'Prevents naming collisions (you can have a service named `api` in `dev` and another `api` in `prod`).',
      'Enables granular ResourceQuotas and RBAC permission boundaries.',
      'Default built-in namespaces: `default`, `kube-system`, `kube-public`, `kube-node-lease`.'
    ],
    keyAttributes: [
      { label: 'Scope', description: 'Scoped: Pods, Deployments, Services. Cluster-wide: Nodes, PVs, Namespaces' }
    ],
    kubectlCommands: [
      { command: 'kubectl get namespaces', explanation: 'Lists all cluster namespaces' },
      { command: 'kubectl config set-context --current --namespace=production', explanation: 'Switches default CLI namespace' }
    ],
    yamlSnippet: `apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    environment: prod`,
    iconName: 'Folder',
    color: '#64748b'
  }
};
