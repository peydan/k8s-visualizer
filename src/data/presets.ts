import { ClusterState, K8sNode, K8sDeployment, PodInstance, K8sService, K8sIngress, K8sConfigMap, K8sSecret, K8sPVC, K8sHPA } from '../types/k8s';

export interface ArchitecturePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  state: Omit<ClusterState, 'isTrafficActive' | 'cpuLoadSimulation' | 'logs' | 'selectedElement'>;
}

export const ARCHITECTURE_PRESETS: ArchitecturePreset[] = [
  {
    id: 'single-node-pod',
    name: '1. Hello Pod & Node Basics',
    badge: 'Beginner',
    difficulty: 'Beginner',
    tags: ['Pod', 'Worker Node', 'Control Plane'],
    description: 'The fundamental building block: A single Worker Node hosting a simple NGINX web pod.',
    state: {
      activeNamespace: 'default',
      nodes: [
        {
          id: 'node-worker-1',
          name: 'worker-node-1',
          type: 'worker',
          status: 'Ready',
          ip: '192.168.1.101',
          zone: 'us-east-1a',
          cpuTotal: 4,
          cpuAllocated: 0.5,
          memTotal: 8192,
          memAllocated: 256,
          pods: ['pod-nginx-1'],
          roles: ['worker'],
          kubeletStatus: 'Healthy',
          kubeProxyStatus: 'Active'
        }
      ],
      deployments: [
        {
          id: 'dep-nginx',
          name: 'nginx-deployment',
          namespace: 'default',
          replicas: 1,
          selector: { app: 'nginx' },
          container: {
            name: 'nginx',
            image: 'nginx:1.25-alpine',
            port: 80,
            cpuRequest: 0.25,
            memRequest: 128
          },
          strategy: 'RollingUpdate',
          configMaps: [],
          secrets: []
        }
      ],
      pods: [
        {
          id: 'pod-nginx-1',
          name: 'nginx-deployment-78df49-p1',
          deploymentId: 'dep-nginx',
          nodeId: 'node-worker-1',
          namespace: 'default',
          status: 'Running',
          ip: '10.244.1.5',
          containers: [{ name: 'nginx', image: 'nginx:1.25-alpine', port: 80, cpuRequest: 0.25, memRequest: 128 }],
          restartCount: 0,
          cpuUsage: 12,
          memoryUsage: 48,
          createdAt: Date.now() - 3600000,
          labels: { app: 'nginx' }
        }
      ],
      services: [],
      configMaps: [],
      secrets: [],
      pvcs: []
    }
  },
  {
    id: 'web-service-ingress',
    name: '2. Web App with Service & Ingress',
    badge: 'Popular',
    difficulty: 'Intermediate',
    tags: ['Ingress', 'Service', 'Deployment', 'ConfigMap', 'LoadBalancer'],
    description: 'Production web setup: External Ingress routing traffic to a ClusterIP Service, load-balancing 3 Pod replicas with ConfigMap injected.',
    state: {
      activeNamespace: 'production',
      nodes: [
        {
          id: 'node-worker-1',
          name: 'k8s-node-alpha',
          type: 'worker',
          status: 'Ready',
          ip: '192.168.1.101',
          zone: 'us-east-1a',
          cpuTotal: 4,
          cpuAllocated: 0.5,
          memTotal: 8192,
          memAllocated: 512,
          pods: ['pod-web-1', 'pod-web-2'],
          roles: ['worker'],
          kubeletStatus: 'Healthy',
          kubeProxyStatus: 'Active'
        },
        {
          id: 'node-worker-2',
          name: 'k8s-node-beta',
          type: 'worker',
          status: 'Ready',
          ip: '192.168.1.102',
          zone: 'us-east-1b',
          cpuTotal: 4,
          cpuAllocated: 0.25,
          memTotal: 8192,
          memAllocated: 256,
          pods: ['pod-web-3'],
          roles: ['worker'],
          kubeletStatus: 'Healthy',
          kubeProxyStatus: 'Active'
        }
      ],
      deployments: [
        {
          id: 'dep-webapp',
          name: 'web-frontend',
          namespace: 'production',
          replicas: 3,
          selector: { app: 'webapp' },
          container: {
            name: 'frontend',
            image: 'frontend-app:v2.1',
            port: 8080,
            cpuRequest: 0.25,
            memRequest: 256,
            env: { APP_ENV: 'production', PORT: '8080' }
          },
          strategy: 'RollingUpdate',
          configMaps: ['cm-app-settings'],
          secrets: []
        }
      ],
      pods: [
        {
          id: 'pod-web-1',
          name: 'web-frontend-9f7b6-x1',
          deploymentId: 'dep-webapp',
          nodeId: 'node-worker-1',
          namespace: 'production',
          status: 'Running',
          ip: '10.244.1.11',
          containers: [{ name: 'frontend', image: 'frontend-app:v2.1', port: 8080, cpuRequest: 0.25, memRequest: 256 }],
          restartCount: 0,
          cpuUsage: 24,
          memoryUsage: 140,
          createdAt: Date.now() - 7200000,
          configMapRefs: ['cm-app-settings'],
          labels: { app: 'webapp' }
        },
        {
          id: 'pod-web-2',
          name: 'web-frontend-9f7b6-x2',
          deploymentId: 'dep-webapp',
          nodeId: 'node-worker-1',
          namespace: 'production',
          status: 'Running',
          ip: '10.244.1.12',
          containers: [{ name: 'frontend', image: 'frontend-app:v2.1', port: 8080, cpuRequest: 0.25, memRequest: 256 }],
          restartCount: 0,
          cpuUsage: 19,
          memoryUsage: 135,
          createdAt: Date.now() - 7200000,
          configMapRefs: ['cm-app-settings'],
          labels: { app: 'webapp' }
        },
        {
          id: 'pod-web-3',
          name: 'web-frontend-9f7b6-x3',
          deploymentId: 'dep-webapp',
          nodeId: 'node-worker-2',
          namespace: 'production',
          status: 'Running',
          ip: '10.244.2.14',
          containers: [{ name: 'frontend', image: 'frontend-app:v2.1', port: 8080, cpuRequest: 0.25, memRequest: 256 }],
          restartCount: 0,
          cpuUsage: 28,
          memoryUsage: 148,
          createdAt: Date.now() - 7200000,
          configMapRefs: ['cm-app-settings'],
          labels: { app: 'webapp' }
        }
      ],
      services: [
        {
          id: 'svc-web',
          name: 'web-service',
          namespace: 'production',
          type: 'ClusterIP',
          clusterIP: '10.96.14.88',
          port: 80,
          targetPort: 8080,
          selector: { app: 'webapp' },
          matchedPodIds: ['pod-web-1', 'pod-web-2', 'pod-web-3']
        }
      ],
      ingress: {
        id: 'ing-main',
        name: 'web-ingress',
        namespace: 'production',
        controller: 'nginx',
        rules: [
          { host: 'kubeapp.io', path: '/', serviceName: 'web-service', servicePort: 80 }
        ],
        tlsEnabled: true
      },
      configMaps: [
        {
          id: 'cm-app-settings',
          name: 'app-settings',
          namespace: 'production',
          data: {
            FEATURE_DARK_MODE: 'true',
            API_TIMEOUT_MS: '5000',
            BRAND_TITLE: 'KubeVerse Portal'
          }
        }
      ],
      secrets: [],
      pvcs: []
    }
  },
  {
    id: 'high-availability-hpa',
    name: '3. High Availability & Auto-Scaling (HPA)',
    badge: 'Resilient',
    difficulty: 'Advanced',
    tags: ['HPA', 'Auto-scaling', 'Multi-Node', 'LoadBalancer', 'Self-Healing'],
    description: 'A 3-node cluster with Horizontal Pod Autoscaler monitoring CPU metrics and automatically scaling replicas from 2 up to 8.',
    state: {
      activeNamespace: 'default',
      nodes: [
        {
          id: 'node-worker-1',
          name: 'worker-zone-a',
          type: 'worker',
          status: 'Ready',
          ip: '10.0.1.10',
          zone: 'us-east-1a',
          cpuTotal: 8,
          cpuAllocated: 0.5,
          memTotal: 16384,
          memAllocated: 512,
          pods: ['pod-hpa-1'],
          roles: ['worker'],
          kubeletStatus: 'Healthy',
          kubeProxyStatus: 'Active'
        },
        {
          id: 'node-worker-2',
          name: 'worker-zone-b',
          type: 'worker',
          status: 'Ready',
          ip: '10.0.2.20',
          zone: 'us-east-1b',
          cpuTotal: 8,
          cpuAllocated: 0.5,
          memTotal: 16384,
          memAllocated: 512,
          pods: ['pod-hpa-2'],
          roles: ['worker'],
          kubeletStatus: 'Healthy',
          kubeProxyStatus: 'Active'
        },
        {
          id: 'node-worker-3',
          name: 'worker-zone-c',
          type: 'worker',
          status: 'Ready',
          ip: '10.0.3.30',
          zone: 'us-east-1c',
          cpuTotal: 8,
          cpuAllocated: 0.25,
          memTotal: 16384,
          memAllocated: 256,
          pods: ['pod-hpa-3'],
          roles: ['worker'],
          kubeletStatus: 'Healthy',
          kubeProxyStatus: 'Active'
        }
      ],
      deployments: [
        {
          id: 'dep-api-hpa',
          name: 'payment-api',
          namespace: 'default',
          replicas: 3,
          selector: { app: 'payment-api' },
          container: {
            name: 'api',
            image: 'payment-service:v3.0',
            port: 4000,
            cpuRequest: 0.5,
            memRequest: 512
          },
          strategy: 'RollingUpdate',
          configMaps: [],
          secrets: ['sec-api-keys'],
          hpaEnabled: true
        }
      ],
      pods: [
        {
          id: 'pod-hpa-1',
          name: 'payment-api-6b9f8-1a',
          deploymentId: 'dep-api-hpa',
          nodeId: 'node-worker-1',
          namespace: 'default',
          status: 'Running',
          ip: '10.244.1.20',
          containers: [{ name: 'api', image: 'payment-service:v3.0', port: 4000, cpuRequest: 0.5, memRequest: 512 }],
          restartCount: 0,
          cpuUsage: 45,
          memoryUsage: 310,
          createdAt: Date.now() - 10000000,
          secretRefs: ['sec-api-keys'],
          labels: { app: 'payment-api' }
        },
        {
          id: 'pod-hpa-2',
          name: 'payment-api-6b9f8-2b',
          deploymentId: 'dep-api-hpa',
          nodeId: 'node-worker-2',
          namespace: 'default',
          status: 'Running',
          ip: '10.244.2.35',
          containers: [{ name: 'api', image: 'payment-service:v3.0', port: 4000, cpuRequest: 0.5, memRequest: 512 }],
          restartCount: 0,
          cpuUsage: 50,
          memoryUsage: 320,
          createdAt: Date.now() - 10000000,
          secretRefs: ['sec-api-keys'],
          labels: { app: 'payment-api' }
        },
        {
          id: 'pod-hpa-3',
          name: 'payment-api-6b9f8-3c',
          deploymentId: 'dep-api-hpa',
          nodeId: 'node-worker-3',
          namespace: 'default',
          status: 'Running',
          ip: '10.244.3.42',
          containers: [{ name: 'api', image: 'payment-service:v3.0', port: 4000, cpuRequest: 0.5, memRequest: 512 }],
          restartCount: 0,
          cpuUsage: 42,
          memoryUsage: 295,
          createdAt: Date.now() - 10000000,
          secretRefs: ['sec-api-keys'],
          labels: { app: 'payment-api' }
        }
      ],
      services: [
        {
          id: 'svc-payment',
          name: 'payment-service',
          namespace: 'default',
          type: 'LoadBalancer',
          clusterIP: '10.96.88.190',
          externalIP: '34.120.45.99',
          port: 80,
          targetPort: 4000,
          selector: { app: 'payment-api' },
          matchedPodIds: ['pod-hpa-1', 'pod-hpa-2', 'pod-hpa-3']
        }
      ],
      ingress: {
        id: 'ing-api',
        name: 'api-gateway',
        namespace: 'default',
        controller: 'nginx',
        rules: [
          { host: 'api.enterprise.com', path: '/v1/pay', serviceName: 'payment-service', servicePort: 80 }
        ],
        tlsEnabled: true
      },
      configMaps: [],
      secrets: [
        {
          id: 'sec-api-keys',
          name: 'stripe-credentials',
          namespace: 'default',
          type: 'Opaque',
          data: {
            STRIPE_SECRET_KEY: 'sk_live_9837a4b8921893a',
            WEBHOOK_SECRET: 'whsec_991823abce'
          }
        }
      ],
      pvcs: [],
      hpa: {
        id: 'hpa-api',
        name: 'payment-api-hpa',
        namespace: 'default',
        targetDeploymentId: 'dep-api-hpa',
        minReplicas: 2,
        maxReplicas: 8,
        targetCpuUtilization: 70,
        currentCpuUtilization: 46
      }
    }
  },
  {
    id: 'stateful-database',
    name: '4. Stateful Database with PVC & Secret',
    badge: 'Database',
    difficulty: 'Advanced',
    tags: ['PVC', 'Storage', 'Secret', 'StatefulSet', 'Headless Service'],
    description: 'Postgres Database setup showcasing PersistentVolumeClaims for durable storage and Secrets for database credentials.',
    state: {
      activeNamespace: 'database',
      nodes: [
        {
          id: 'node-worker-db',
          name: 'storage-node-primary',
          type: 'worker',
          status: 'Ready',
          ip: '192.168.2.50',
          zone: 'us-east-1a',
          cpuTotal: 8,
          cpuAllocated: 1.0,
          memTotal: 16384,
          memAllocated: 2048,
          pods: ['pod-postgres-0'],
          roles: ['worker', 'storage-optimized'],
          kubeletStatus: 'Healthy',
          kubeProxyStatus: 'Active'
        }
      ],
      deployments: [
        {
          id: 'dep-postgres',
          name: 'postgres-db',
          namespace: 'database',
          replicas: 1,
          selector: { app: 'postgres' },
          container: {
            name: 'postgres',
            image: 'postgres:16-alpine',
            port: 5432,
            cpuRequest: 1.0,
            memRequest: 2048,
            env: { PGDATA: '/var/lib/postgresql/data/pgdata' }
          },
          strategy: 'Recreate',
          configMaps: [],
          secrets: ['sec-pg-auth'],
          pvc: 'pvc-postgres-data'
        }
      ],
      pods: [
        {
          id: 'pod-postgres-0',
          name: 'postgres-db-0',
          deploymentId: 'dep-postgres',
          nodeId: 'node-worker-db',
          namespace: 'database',
          status: 'Running',
          ip: '10.244.5.1',
          containers: [{ name: 'postgres', image: 'postgres:16-alpine', port: 5432, cpuRequest: 1.0, memRequest: 2048 }],
          restartCount: 0,
          cpuUsage: 18,
          memoryUsage: 890,
          createdAt: Date.now() - 15000000,
          secretRefs: ['sec-pg-auth'],
          pvcRefs: ['pvc-postgres-data'],
          labels: { app: 'postgres' }
        }
      ],
      services: [
        {
          id: 'svc-postgres-headless',
          name: 'postgres-headless',
          namespace: 'database',
          type: 'Headless',
          clusterIP: 'None',
          port: 5432,
          targetPort: 5432,
          selector: { app: 'postgres' },
          matchedPodIds: ['pod-postgres-0']
        }
      ],
      configMaps: [],
      secrets: [
        {
          id: 'sec-pg-auth',
          name: 'postgres-credentials',
          namespace: 'database',
          type: 'Opaque',
          data: {
            POSTGRES_DB: 'kubedb',
            POSTGRES_USER: 'pgadmin',
            POSTGRES_PASSWORD: 'SuperStrongDBPassword2026!'
          }
        }
      ],
      pvcs: [
        {
          id: 'pvc-postgres-data',
          name: 'postgres-data-pvc',
          namespace: 'database',
          capacity: '50Gi',
          accessModes: ['ReadWriteOnce'],
          storageClass: 'fast-ssd-sc',
          status: 'Bound',
          boundPvId: 'pv-ebs-vol-98124'
        }
      ]
    }
  },
  {
    id: 'microservices-mesh',
    name: '5. Multi-Tier Microservices Mesh',
    badge: 'Full Stack',
    difficulty: 'Advanced',
    tags: ['Multi-Tier', 'Frontend', 'Backend', 'Redis', 'Multi-Service'],
    description: 'A 3-tier architecture: Ingress -> Frontend UI Service -> Backend API Service -> In-Memory Redis Cache.',
    state: {
      activeNamespace: 'default',
      nodes: [
        {
          id: 'node-worker-1',
          name: 'worker-node-1',
          type: 'worker',
          status: 'Ready',
          ip: '192.168.10.1',
          zone: 'us-west-2a',
          cpuTotal: 4,
          cpuAllocated: 0.75,
          memTotal: 8192,
          memAllocated: 1024,
          pods: ['pod-frontend-1', 'pod-backend-1'],
          roles: ['worker'],
          kubeletStatus: 'Healthy',
          kubeProxyStatus: 'Active'
        },
        {
          id: 'node-worker-2',
          name: 'worker-node-2',
          type: 'worker',
          status: 'Ready',
          ip: '192.168.10.2',
          zone: 'us-west-2b',
          cpuTotal: 4,
          cpuAllocated: 0.75,
          memTotal: 8192,
          memAllocated: 1024,
          pods: ['pod-frontend-2', 'pod-redis-1'],
          roles: ['worker'],
          kubeletStatus: 'Healthy',
          kubeProxyStatus: 'Active'
        }
      ],
      deployments: [
        {
          id: 'dep-frontend',
          name: 'react-frontend',
          namespace: 'default',
          replicas: 2,
          selector: { tier: 'frontend' },
          container: { name: 'ui', image: 'nginx:alpine', port: 80, cpuRequest: 0.2, memRequest: 128 },
          strategy: 'RollingUpdate',
          configMaps: ['cm-mesh-config'],
          secrets: []
        },
        {
          id: 'dep-backend',
          name: 'go-backend-api',
          namespace: 'default',
          replicas: 1,
          selector: { tier: 'backend' },
          container: { name: 'api', image: 'golang:1.22-alpine', port: 8080, cpuRequest: 0.4, memRequest: 256 },
          strategy: 'RollingUpdate',
          configMaps: ['cm-mesh-config'],
          secrets: ['sec-jwt']
        },
        {
          id: 'dep-redis',
          name: 'redis-cache',
          namespace: 'default',
          replicas: 1,
          selector: { tier: 'cache' },
          container: { name: 'redis', image: 'redis:7.2-alpine', port: 6379, cpuRequest: 0.2, memRequest: 256 },
          strategy: 'Recreate',
          configMaps: [],
          secrets: []
        }
      ],
      pods: [
        {
          id: 'pod-frontend-1',
          name: 'react-frontend-ab89-1',
          deploymentId: 'dep-frontend',
          nodeId: 'node-worker-1',
          namespace: 'default',
          status: 'Running',
          ip: '10.244.1.61',
          containers: [{ name: 'ui', image: 'nginx:alpine', port: 80, cpuRequest: 0.2, memRequest: 128 }],
          restartCount: 0,
          cpuUsage: 14,
          memoryUsage: 64,
          createdAt: Date.now() - 5000000,
          configMapRefs: ['cm-mesh-config'],
          labels: { tier: 'frontend' }
        },
        {
          id: 'pod-frontend-2',
          name: 'react-frontend-ab89-2',
          deploymentId: 'dep-frontend',
          nodeId: 'node-worker-2',
          namespace: 'default',
          status: 'Running',
          ip: '10.244.2.62',
          containers: [{ name: 'ui', image: 'nginx:alpine', port: 80, cpuRequest: 0.2, memRequest: 128 }],
          restartCount: 0,
          cpuUsage: 18,
          memoryUsage: 72,
          createdAt: Date.now() - 5000000,
          configMapRefs: ['cm-mesh-config'],
          labels: { tier: 'frontend' }
        },
        {
          id: 'pod-backend-1',
          name: 'go-backend-api-44fc-1',
          deploymentId: 'dep-backend',
          nodeId: 'node-worker-1',
          namespace: 'default',
          status: 'Running',
          ip: '10.244.1.80',
          containers: [{ name: 'api', image: 'golang:1.22-alpine', port: 8080, cpuRequest: 0.4, memRequest: 256 }],
          restartCount: 0,
          cpuUsage: 32,
          memoryUsage: 180,
          createdAt: Date.now() - 5000000,
          configMapRefs: ['cm-mesh-config'],
          secretRefs: ['sec-jwt'],
          labels: { tier: 'backend' }
        },
        {
          id: 'pod-redis-1',
          name: 'redis-cache-77b1-1',
          deploymentId: 'dep-redis',
          nodeId: 'node-worker-2',
          namespace: 'default',
          status: 'Running',
          ip: '10.244.2.99',
          containers: [{ name: 'redis', image: 'redis:7.2-alpine', port: 6379, cpuRequest: 0.2, memRequest: 256 }],
          restartCount: 0,
          cpuUsage: 10,
          memoryUsage: 96,
          createdAt: Date.now() - 5000000,
          labels: { tier: 'cache' }
        }
      ],
      services: [
        {
          id: 'svc-frontend',
          name: 'frontend-svc',
          namespace: 'default',
          type: 'ClusterIP',
          clusterIP: '10.96.20.10',
          port: 80,
          targetPort: 80,
          selector: { tier: 'frontend' },
          matchedPodIds: ['pod-frontend-1', 'pod-frontend-2']
        },
        {
          id: 'svc-backend',
          name: 'backend-api-svc',
          namespace: 'default',
          type: 'ClusterIP',
          clusterIP: '10.96.20.20',
          port: 8080,
          targetPort: 8080,
          selector: { tier: 'backend' },
          matchedPodIds: ['pod-backend-1']
        },
        {
          id: 'svc-redis',
          name: 'redis-svc',
          namespace: 'default',
          type: 'ClusterIP',
          clusterIP: '10.96.20.30',
          port: 6379,
          targetPort: 6379,
          selector: { tier: 'cache' },
          matchedPodIds: ['pod-redis-1']
        }
      ],
      ingress: {
        id: 'ing-mesh',
        name: 'mesh-ingress',
        namespace: 'default',
        controller: 'nginx',
        rules: [
          { host: 'store.io', path: '/', serviceName: 'frontend-svc', servicePort: 80 },
          { host: 'store.io', path: '/api', serviceName: 'backend-api-svc', servicePort: 8080 }
        ],
        tlsEnabled: true
      },
      configMaps: [
        {
          id: 'cm-mesh-config',
          name: 'cluster-endpoints',
          namespace: 'default',
          data: {
            REDIS_HOST: 'redis-svc.default.svc.cluster.local:6379',
            BACKEND_URL: 'backend-api-svc.default.svc.cluster.local:8080'
          }
        }
      ],
      secrets: [
        {
          id: 'sec-jwt',
          name: 'jwt-auth-secret',
          namespace: 'default',
          type: 'Opaque',
          data: {
            JWT_SECRET_KEY: 'bXktc3VwZXItc2VjcmV0LWtleS0yMDI2'
          }
        }
      ],
      pvcs: []
    }
  }
];
