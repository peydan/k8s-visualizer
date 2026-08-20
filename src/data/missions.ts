import { LearningMission } from '../types/k8s';

export const LEARNING_MISSIONS: LearningMission[] = [
  {
    id: 'mission-1',
    number: 1,
    title: 'The Core Building Blocks',
    subtitle: 'Understand Nodes, Pods, and the Control Plane',
    category: 'Fundamentals',
    badge: 'Stage 1',
    description: 'Learn how Kubernetes organizes workloads on worker nodes and how the Control Plane orchestrates everything.',
    keyLearning: 'A Pod is the smallest deployable unit. Nodes provide hardware resources (CPU/RAM). The Control Plane (API Server, Scheduler, etcd, Controller Manager) coordinates them.',
    hints: [
      'Hover over the Control Plane components (API Server, etcd, Scheduler) to read their responsibilities.',
      'Click on a Worker Node to inspect its CPU and Memory allocation.',
      'Click on a Pod to inspect its container status and IP address.'
    ],
    recommendedPreset: 'single-node-pod',
    checks: [
      {
        id: 'c1',
        description: 'Have at least 1 Worker Node in Ready state',
        isComplete: (state) => state.nodes.some(n => n.status === 'Ready')
      },
      {
        id: 'c2',
        description: 'Have at least 1 running Pod in the cluster',
        isComplete: (state) => state.pods.some(p => p.status === 'Running')
      }
    ]
  },
  {
    id: 'mission-2',
    number: 2,
    title: 'Self-Healing & Scaling',
    subtitle: 'Deployments, ReplicaSets & Crash Recovery',
    category: 'Workloads',
    badge: 'Stage 2',
    description: 'Discover how Deployments guarantee that the desired number of Pod replicas remain running even when disasters strike.',
    keyLearning: 'When a Pod fails or is killed, the Controller Manager detects the difference between the desired and actual replica count, and immediately orders the Scheduler to launch a replacement.',
    hints: [
      'Click the "Chaos Monkey / Kill Pod" button or click the red trash icon on any Pod to simulate a crash.',
      'Watch how the ReplicaSet automatically provisions a replacement Pod in real time!',
      'Use the Scale slider in the Builder or click "+ Scale" to increase replicas to 3 or more.'
    ],
    recommendedPreset: 'single-node-pod',
    checks: [
      {
        id: 'c1',
        description: 'Scale any Deployment to 3 or more replicas',
        isComplete: (state) => state.deployments.some(d => d.replicas >= 3)
      },
      {
        id: 'c2',
        description: 'Experience self-healing (Kill at least 1 pod and watch it recover)',
        isComplete: (state) => state.logs.some(l => l.source === 'ChaosMonkey' || (l.message.includes('Self-healing') || l.message.includes('Recreated pod')))
      }
    ]
  },
  {
    id: 'mission-3',
    number: 3,
    title: 'Exposing with Services',
    subtitle: 'Stable Networking & Load Balancing',
    category: 'Networking',
    badge: 'Stage 3',
    description: 'Pods are ephemeral and change IPs when recreated. Learn how Services provide a permanent IP and load-balance across healthy pods.',
    keyLearning: 'A Service uses label selectors (e.g. `app: webapp`) to dynamically find matching Pods and distribute incoming traffic across them.',
    hints: [
      'Load the "Web App with Service & Ingress" preset or add a Service using the Toolbox.',
      'Click "Send Traffic" at the top to watch requests balance across healthy pods.',
      'Check the Service card to see which Pod IPs are currently registered in its Endpoints.'
    ],
    recommendedPreset: 'web-service-ingress',
    checks: [
      {
        id: 'c1',
        description: 'Have at least 1 Service configured with matching Pods',
        isComplete: (state) => state.services.some(s => s.matchedPodIds.length > 0)
      },
      {
        id: 'c2',
        description: 'Send simulated network traffic through the cluster',
        isComplete: (state) => state.logs.some(l => l.source === 'Kube-Proxy' || l.source === 'Ingress')
      }
    ]
  },
  {
    id: 'mission-4',
    number: 4,
    title: 'External Ingress Routing',
    subtitle: 'Layer 7 HTTP Routing & Domain Management',
    category: 'Networking',
    badge: 'Stage 4',
    description: 'Expose multiple internal cluster services to the internet using a single entrypoint with host and path routing rules.',
    keyLearning: 'Ingress operates at HTTP Layer 7. It routes `domain.com/` to one service and `domain.com/api` to another, handling SSL/TLS termination.',
    hints: [
      'Inspect the Ingress component at the top of the canvas.',
      'Hover over Ingress to see its routing rules and annotations.',
      'Send traffic and watch the packet route through the Ingress controller.'
    ],
    recommendedPreset: 'web-service-ingress',
    checks: [
      {
        id: 'c1',
        description: 'Have an active Ingress resource with at least 1 path rule',
        isComplete: (state) => Boolean(state.ingress && state.ingress.rules.length > 0)
      }
    ]
  },
  {
    id: 'mission-5',
    number: 5,
    title: 'Decoupling Config & Secrets',
    subtitle: 'ConfigMaps, Secrets and 12-Factor Apps',
    category: 'Configuration',
    badge: 'Stage 5',
    description: 'Keep passwords and environment-specific settings out of your container images using ConfigMaps and Secrets.',
    keyLearning: 'ConfigMaps store plain text configuration (e.g. API endpoints), while Secrets protect sensitive data like API keys and database credentials.',
    hints: [
      'Load the "Stateful Database" or "Web App" preset.',
      'Open the Config & Storage drawer at the bottom.',
      'Click the Secret card and toggle the visibility eye icon to reveal the password.'
    ],
    recommendedPreset: 'stateful-database',
    checks: [
      {
        id: 'c1',
        description: 'Attach at least 1 ConfigMap or Secret to a Deployment',
        isComplete: (state) => state.deployments.some(d => d.configMaps.length > 0 || d.secrets.length > 0)
      }
    ]
  },
  {
    id: 'mission-6',
    number: 6,
    title: 'High Availability & Auto-Scaling',
    subtitle: 'Horizontal Pod Autoscaler & Multi-Zone Resilience',
    category: 'Production',
    badge: 'Stage 6',
    description: 'Build a production-grade resilient cluster that automatically scales up under heavy CPU load.',
    keyLearning: 'The Horizontal Pod Autoscaler (HPA) continuously monitors CPU/memory metrics and automatically adjusts the replica count to handle peak load.',
    hints: [
      'Load the "High Availability & Auto-Scaling" preset.',
      'Click "Spike CPU Load" in the top bar to simulate heavy user traffic (>70% CPU).',
      'Watch HPA trigger the creation of additional Pod replicas across the 3 worker nodes!'
    ],
    recommendedPreset: 'high-availability-hpa',
    checks: [
      {
        id: 'c1',
        description: 'Have at least 2 Worker Nodes in different zones',
        isComplete: (state) => state.nodes.length >= 2
      },
      {
        id: 'c2',
        description: 'Trigger HPA auto-scaling during high CPU load',
        isComplete: (state) => Boolean(state.hpa && (state.logs.some(l => l.source === 'HPA') || state.cpuLoadSimulation >= 70))
      }
    ]
  }
];
