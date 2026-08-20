# ☸️ KubeVerse: Interactive Kubernetes Visual Learning Lab

An interactive, single-page web application designed for mastering Kubernetes (k8s) concepts visually and hands-on.

![Kubernetes Learning](https://raw.githubusercontent.com/kubernetes/kubernetes/master/logo/logo.svg)

---

## ✨ Features

- 🏗️ **Interactive Visual Cluster Canvas**:
  - **Control Plane**: Master node components (`kube-apiserver`, `etcd`, `kube-scheduler`, `kube-controller-manager`) with live health indicators.
  - **Worker Nodes**: Real-time CPU and Memory allocation meters, status badges (Ready, Cordoned), kubelet and kube-proxy indicators.
  - **Workloads & Pods**: Interactive Pod cards inside nodes with status transitions (`Running`, `ContainerCreating`, `CrashLoopBackOff`, `Terminating`), IP addresses, container specifications, and mount badges.
  - **Networking & Routing**: Ingress Controller (host & path rules), Services (ClusterIP, NodePort, LoadBalancer, Headless) with dynamic selector matching.
  - **Configuration & Storage**: ConfigMaps, Secrets (with show/hide toggle), and PersistentVolumeClaims (PVCs).
  - **Auto-Scaling**: Horizontal Pod Autoscaler (HPA) with live CPU load tracking.

- 🛠️ **Architecture Setup Builder**:
  - Floating builder toolbox to add Worker Nodes, Deployments, Services, Ingress routes, ConfigMaps, Secrets, and PVCs.
  - 5 one-click production-grade architecture presets:
    1. *Hello Pod & Node Basics*
    2. *Web App with Service & Ingress*
    3. *High Availability & Auto-Scaling (HPA)*
    4. *Stateful Database with PVC & Secret*
    5. *Multi-Tier Microservices Mesh*

- 💡 **Vibrant Educational Tooltips & Inspector**:
  - Every single element has a glowing tooltip detailing:
    - **Simple Analogy** (e.g. airport control tower, cargo ships, reception desk)
    - **Purpose & Why It Matters**
    - **Key Technical Attributes**
    - **Common `kubectl` commands**
  - Interactive deep-dive modal with live instance inspection, container stdout stream, command cheat sheets, and YAML snippets.

- ⚡ **Live Simulations & Playground**:
  - **Send Traffic**: Watch animated HTTP packet particles route through Ingress → Service → load-balanced across healthy Pods.
  - **Chaos Monkey / Kill Pod**: Simulate pod failures and watch the ReplicaSet & Controller Manager automatically self-heal and schedule replacement pods.
  - **Spike CPU Load**: Adjust simulated CPU load to watch the HPA auto-scale deployment replicas.
  - **Drain & Cordon Nodes**: Evacuate pods off a node to watch them safely migrate to remaining healthy worker nodes.

- 🎯 **Guided Interactive Missions**:
  - Step-by-step challenges with automated state verification and confetti celebrations upon completion.

- 📜 **Live YAML Manifest Generator**:
  - Dynamically produces valid, ready-to-deploy Kubernetes YAML manifests for the entire active setup with 1-click copy and download.

- 💻 **Kubectl Terminal Simulator**:
  - Interactive in-browser terminal executing real commands (`kubectl get all`, `kubectl get pods -o wide`, `kubectl get nodes`, `kubectl scale deployment ...`, `kubectl describe ...`, `kubectl cluster-info`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build production bundle
npm run build
```
