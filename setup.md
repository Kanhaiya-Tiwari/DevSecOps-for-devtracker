# 🚀 DevTracker Infrastructure & Setup Guide

This document explains the current infrastructure deployed on your EC2 instance (`100.48.45.91`) and how to manage the monitoring and deployment tools.

## 1. 🏗️ Current Stack Overview
The following components are installed and running:
*   **K3s Kubernetes**: The core orchestrator.
*   **NGINX Ingress Controller**: Handles traffic on Port 80.
*   **ArgoCD**: GitOps continuous delivery (Namespace: `argocd`).
*   **Prometheus**: Metrics collection (Namespace: `monitoring`).
*   **Grafana**: Data visualization dashboards (Namespace: `monitoring`).
*   **PostgreSQL & Redis**: Application database and cache.

---

## 2. 🔌 Required Ports (AWS Security Group)
Ensure your AWS EC2 Security Group has these rules:

| Port Range | Protocol | Purpose |
| :--- | :--- | :--- |
| `80` | TCP | Public Web Traffic (Frontend) |
| `443` | TCP | Secure Web Traffic (HTTPS) |
| `22` | TCP | SSH Access |
| `30000-32767` | TCP | Kubernetes NodePorts (For direct service access) |

---

## 3. 🚢 Managing the Application
Your app is deployed in the `devtracker` namespace.

*   **Check Status**: `kubectl get all -n devtracker`
*   **Frontend URL**: [http://100.48.45.91](http://100.48.45.91)
*   **Backend Health**: [http://100.48.45.91/health](http://100.48.45.91/health)

---

## 4. 🐙 ArgoCD Setup (Continuous Delivery)
ArgoCD allows you to visualize your Kubernetes cluster and sync code changes automatically.

*   **URL**: [https://44.192.106.221:30443](https://44.192.106.221:30443) (Accept self-signed cert warning)
*   **User**: `admin`
*   **Get Password**: 
```bash
KUBECONFIG=/etc/rancher/k3s/k3s.yaml kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

---

## 5. 📊 Prometheus & Grafana Setup (Monitoring)
### Grafana (Dashboards)
*   **URL**: [http://44.192.106.221:30300](http://44.192.106.221:30300)
*   **User**: `admin`
*   **Password**: `admin123`

### Prometheus (Metrics)
*   **URL**: [http://44.192.106.221:30900](http://44.192.106.221:30900)

---

## 6. 🛠️ Troubleshooting Commands
If something is wrong, check the bootstrap logs:
*   **Ansible/Startup Logs**: `sudo tail -f /var/log/devtracker-bootstrap.log`
*   **K3s Logs**: `sudo journalctl -u k3s -f`
*   **Pod Logs**: `kubectl logs -l component=backend -n devtracker`
