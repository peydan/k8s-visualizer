# ☸️ KubeVerse: Interactive Kubernetes Visual Learning Lab

An interactive, zero-dependency, single-file web application designed for mastering Kubernetes (k8s) concepts visually and hands-on.

🌐 **Live Website**: [https://peydan.github.io/k8s-visualizer/](https://peydan.github.io/k8s-visualizer/)

---

## ✨ Features

- 🏗️ **Interactive Visual Cluster Canvas**:
  - **Control Plane**: Master node components (`kube-apiserver`, `etcd`, `kube-scheduler`, `kube-controller-manager`) with live health indicators.
  - **Worker Nodes**: Real-time CPU and Memory allocation meters, status badges (Ready, Cordoned), kubelet, and kube-proxy indicators.
  - **Workloads & Pods**: Standalone Pods vs. Deployment-managed pods with self-healing lifecycle transitions.
  - **Networking & Routing**: Multi-Ingress Controller support (NGINX, Traefik, Envoy, Kong, ALB), Services (ClusterIP, LoadBalancer, Headless).
  - **Virtual Isolation**: Namespace filtering across all workloads.
  - **Configuration & Storage**: ConfigMaps, Secrets (with show/hide toggle), and PersistentVolumeClaims (PVCs).
  - **Auto-Scaling**: Horizontal Pod Autoscaler (HPA) with live CPU load tracking.

- 🗺️ **Dedicated Traffic Route Map & Packet Tracer**:
  - 4-Hop animated pipeline tracing: `Client Browser` ➔ `Ingress Controller (L7)` ➔ `Service / kube-proxy (L4 VIP & DNAT)` ➔ `Target Pod Container`.
  - 1-Click Behavior Scenarios: Round-Robin balancing, `/api` Path Routing, 404 Route Miss, Chaos Failover mid-stream, 503 Zero Endpoints.
  - Pacing speed controls (`Slow 1.8s`, `Medium 1.2s`, `Fast 0.6s`) and manual step-by-step tracing.
  - Live HTTP response and kube-proxy iptables DNAT JSON inspector.

- 💡 **High-Contrast Solid White Tooltips & Inspector**:
  - Solid pure white cards with dark high-contrast typography and glowing cyan accents.
  - Category Badges, Real-World Analogies, Architecture Rules, and `$ kubectl` commands for every element.

- ⚡ **Live Simulations & Chaos Testing**:
  - **Chaos Monkey**: Terminate pods to observe Controller Manager self-healing vs. standalone pod eviction.
  - **CPU Load Generator**: Trigger automatic HPA horizontal replica scaling.
  - **Node Drain**: Safely evacuate running pods onto remaining healthy worker nodes.

- 📜 **Live YAML Manifest Generator & Kubectl CLI**:
  - Generates ready-to-deploy `networking.k8s.io/v1` Ingress, `apps/v1` Deployment, `v1` Service, and `v1` Pod manifests.
  - Interactive terminal executing `kubectl get pods`, `kubectl get nodes`, `kubectl get svc`, `kubectl get ingress`, `kubectl run`.

---

## 🚀 Running the Project

This project is completely **standalone** and requires **no build tools, Node.js, or web server**.

### Option 1: Open Directly
Double-click [`index.html`](index.html) or drag it into any modern web browser.

### Option 2: Live Website
Visit [https://peydan.github.io/k8s-visualizer/](https://peydan.github.io/k8s-visualizer/).
