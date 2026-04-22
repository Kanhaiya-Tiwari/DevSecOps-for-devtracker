# DevTracker EC2 + k3s Deployment Guide

This guide explains how to deploy DevTracker on AWS EC2 using k3s (lightweight Kubernetes).

## Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────────────────────────────────┐
│  AWS ALB    │────▶│  EC2 Instance (Ubuntu)                  │
│  (Optional)   │     │  ┌─────────────────────────────────────┐│
└─────────────┘     │  │  k3s Kubernetes Cluster             ││
                    │  │  ┌─────────┐ ┌─────────┐ ┌────────┐││
                    │  │  │Frontend │ │ Backend │ │Database│││
                    │  │  │ (React) │ │(FastAPI)│ │(Postgres)│
                    │  │  │  :80    │ │ :8000   │ │  :5432 │││
                    │  │  └────┬────┘ └────┬────┘ └────┬───┘││
                    │  │       │           │           │     ││
                    │  │       └───────────┴───────────┘     ││
                    │  │              NGINX Ingress           ││
                    │  └─────────────────────────────────────┘│
                    └─────────────────────────────────────────┘
```

## Prerequisites

- AWS Account
- Terraform installed locally
- AWS CLI configured with credentials
- GitHub repository with DevTracker code

## Step 1: Update Terraform Variables

Edit `infra/terraform/EC2/variables.tf`:

```hcl
variable "key_name" {
  default = "your-ec2-keypair-name"
}

variable "instance_type" {
  default = "t3.medium"  # Minimum 2GB RAM for k3s
}
```

## Step 2: Deploy EC2 Instance

```bash
cd infra/terraform/EC2

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply deployment
terraform apply
```

## Step 3: Access Your EC2 Instance

```bash
# Get the public IP
terraform output public_ip

# SSH into instance
ssh -i ~/.ssh/your-key.pem ubuntu@$(terraform output -raw public_ip)
```

## Step 4: Verify k3s Installation

Once connected to EC2:

```bash
# Check k3s status
sudo kubectl get nodes

# Check all pods
sudo kubectl get pods -A

# Check DevTracker pods
export KUBECONFIG=/home/ubuntu/.kube/config
kubectl get all -n devtracker
```

## Step 5: Access DevTracker Application

### Option 1: Direct EC2 IP (Recommended)
```
http://<EC2-PUBLIC-IP>
```

### Option 2: Port Forwarding (for debugging)
```bash
# On your local machine
kubectl port-forward svc/devtracker-frontend-service 8080:80 -n devtracker --kubeconfig=/path/to/kubeconfig
```

Then open: `http://localhost:8080`

## Security Group Configuration

The Terraform script creates a security group with these ports:

| Port | Protocol | Source | Purpose |
|------|----------|--------|---------|
| 22 | TCP | Your IP | SSH Access |
| 80 | TCP | 0.0.0.0/0 | HTTP (Application) |
| 443 | TCP | 0.0.0.0/0 | HTTPS (Optional) |
| 6443 | TCP | Your IP | k3s API (Optional) |
| 10250 | TCP | Your IP | kubelet (Optional) |

## File Changes for EC2 Deployment

### Files Modified/Created:

1. **`userdata.sh`** - Updated for k3s + Ansible auto-deployment
2. **`ingress-ip.yml`** - Ingress using EC2 public IP (no domain required)
3. **`playbook-ec2.yml`** - Ansible playbook for complete deployment
4. **`nginx-configmap.yml`** - Nginx proxy configuration
5. **`README-EC2.md`** - This documentation

### Key Differences from Local (Kind):

| Feature | Local (Kind) | EC2 (k3s) |
|---------|--------------|-----------|
| Kubernetes | Kind cluster | k3s single node |
| Ingress | NodePort | LoadBalancer (AWS) |
| Storage | Manual PV/PVC | Dynamic (local-path) |
| Database | Same as app | Same as app |
| Access | localhost:8080 | EC2-Public-IP |

## Troubleshooting

### 1. k3s not starting
```bash
sudo systemctl status k3s
sudo journalctl -u k3s -f
```

### 2. Pods not running
```bash
kubectl describe pod <pod-name> -n devtracker
kubectl logs <pod-name> -n devtracker
```

### 3. Ingress not working
```bash
kubectl get ingress -n devtracker
kubectl get svc -n ingress-nginx
```

### 4. Database connection issues
```bash
kubectl exec -it postgres-0 -n devtracker -- psql -U postgres -c "\l"
```

**Note:** The system is configured by default to use the EC2 public IP via `ingress-ip.yml`.



## Cost Optimization

- Use `t3.small` for testing (2GB RAM)
- Use `t3.medium` for production (4GB RAM)
- Enable spot instances for non-critical workloads
- Use AWS Free Tier (750 hours t2.micro/t3.micro per month)

## Cleanup

To destroy all resources:

```bash
cd infra/terraform/EC2
terraform destroy
```

## Support

For issues:
1. Check logs: `kubectl logs <pod> -n devtracker`
2. Check events: `kubectl get events -n devtracker`
3. Check node: `kubectl describe node`
