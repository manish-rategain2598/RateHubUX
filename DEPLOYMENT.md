# RateHubUX Deployment Guide

This guide covers deploying RateHubUX to DigitalOcean using Docker, Jenkins, Rancher, and Tailscale VPN.

## Architecture Overview

- **Frontend:** React + Vite application
- **Container:** Docker with Nginx
- **CI/CD:** Jenkins pipeline
- **Orchestration:** Kubernetes via Rancher
- **Hosting:** DigitalOcean Droplets
- **VPN:** Tailscale for secure access

---

## Prerequisites

### 1. DigitalOcean Setup
- DigitalOcean account with active droplets
- Kubernetes cluster set up (or single droplet with Docker)
- Domain name pointed to your droplet IP

### 2. Tools Installed
- Docker & Docker Compose
- kubectl CLI
- Jenkins server running
- Rancher server running
- Tailscale installed on servers

### 3. Access Credentials
- GitHub Personal Access Token
- Docker registry credentials (Docker Hub or private registry)
- Kubernetes cluster access (kubeconfig)

---

## Part 1: Local Testing with Docker

### 1.1 Build and Test Locally

```bash
# Build the Docker image
docker build -t ratehub-frontend:local .

# Run the container
docker run -d -p 8080:80 --name ratehub-test ratehub-frontend:local

# Test the application
curl http://localhost:8080

# View logs
docker logs ratehub-test

# Stop and remove
docker stop ratehub-test && docker rm ratehub-test
```

### 1.2 Test with Docker Compose

```bash
# Start the application
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Access: http://localhost:8080

---

## Part 2: Tailscale VPN Setup

### 2.1 Install Tailscale on DigitalOcean Droplets

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate
sudo tailscale up

# Check status
tailscale status
```

### 2.2 Configure Tailscale Access

```bash
# Get your Tailscale IP
tailscale ip -4

# Update firewall to allow Tailscale
ufw allow in on tailscale0
```

### 2.3 Access via Tailscale

- Your services will be accessible via: `http://[tailscale-ip]:port`
- Example: `http://100.x.x.x:8080`

---

## Part 3: Docker Registry Setup

### Option A: Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag ratehub-frontend:latest your-dockerhub-username/ratehub-frontend:latest

# Push image
docker push your-dockerhub-username/ratehub-frontend:latest
```

### Option B: Private Registry

```bash
# Tag for private registry
docker tag ratehub-frontend:latest registry.yourdomain.com/ratehub-frontend:latest

# Push to private registry
docker push registry.yourdomain.com/ratehub-frontend:latest
```

---

## Part 4: Jenkins CI/CD Setup

### 4.1 Configure Jenkins Credentials

In Jenkins Dashboard → Manage Jenkins → Credentials:

1. **GitHub Credentials**
   - Kind: Username with password
   - ID: `github-credentials`
   - Username: your GitHub username
   - Password: your GitHub Personal Access Token

2. **Docker Registry Credentials**
   - Kind: Username with password
   - ID: `docker-registry-credentials`
   - Username: your registry username
   - Password: your registry password/token

3. **Kubeconfig Credentials**
   - Kind: Secret file
   - ID: `kubeconfig-credentials`
   - File: Upload your kubeconfig file from Rancher

### 4.2 Create Jenkins Pipeline Job

1. New Item → Pipeline
2. Name: `RateHubUX-Deploy`
3. Pipeline Definition: Pipeline script from SCM
4. SCM: Git
   - Repository URL: `https://github.com/manish-rategain2598/RateHubUX.git`
   - Credentials: Select your GitHub credentials
   - Branch: `*/main`
5. Script Path: `Jenkinsfile`
6. Save

### 4.3 Update Jenkinsfile Variables

Edit `Jenkinsfile` and update:
```groovy
DOCKER_REGISTRY = 'your-registry.com'  // or 'docker.io' for Docker Hub
IMAGE_NAME = 'ratehub-frontend'
NAMESPACE = 'production'
```

### 4.4 Install Required Jenkins Plugins

- Docker Pipeline
- Kubernetes CLI
- Git plugin
- Pipeline plugin

---

## Part 5: Rancher & Kubernetes Deployment

### 5.1 Access Rancher Dashboard

```bash
# Access Rancher via Tailscale IP
https://[rancher-tailscale-ip]
```

### 5.2 Import/Create Kubernetes Cluster

1. In Rancher, go to Cluster Management
2. Either import existing cluster or create new one on DigitalOcean
3. Download the kubeconfig file

### 5.3 Create Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### 5.4 Create Docker Registry Secret

```bash
kubectl create secret docker-registry docker-registry-secret \
  --docker-server=your-registry.com \
  --docker-username=your-username \
  --docker-password=your-password \
  --docker-email=your-email \
  -n production
```

### 5.5 Update Kubernetes Manifests

Edit the following files with your actual values:

**k8s/deployment.yaml:**
```yaml
image: your-docker-registry.com/ratehub-frontend:latest
```

**k8s/ingress.yaml:**
```yaml
- host: ratehub.yourdomain.com  # Your actual domain
```

### 5.6 Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment status
kubectl get deployments -n production
kubectl get pods -n production
kubectl get services -n production
kubectl get ingress -n production

# View logs
kubectl logs -f deployment/ratehub-frontend -n production
```

---

## Part 6: Domain & SSL Configuration

### 6.1 Configure DNS

Point your domain to DigitalOcean LoadBalancer IP:

```
A Record: ratehub.yourdomain.com → your-loadbalancer-ip
```

### 6.2 Install Cert-Manager (for SSL)

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

---

## Part 7: Complete Deployment Flow

### 7.1 Initial Deployment

```bash
# 1. Build and push Docker image manually (first time)
docker build -t your-registry.com/ratehub-frontend:v1.0.0 .
docker push your-registry.com/ratehub-frontend:v1.0.0

# 2. Deploy to Kubernetes
kubectl apply -f k8s/

# 3. Verify deployment
kubectl get all -n production
```

### 7.2 CI/CD Deployment (via Jenkins)

1. Push code to GitHub
2. Jenkins pipeline automatically triggers
3. Pipeline builds Docker image
4. Pushes to registry
5. Updates Kubernetes deployment
6. Performs rolling update

### 7.3 Manual Jenkins Trigger

1. Go to Jenkins Dashboard
2. Select `RateHubUX-Deploy` job
3. Click "Build Now"
4. Monitor build logs

---

## Part 8: Monitoring & Troubleshooting

### 8.1 Check Application Status

```bash
# Pod status
kubectl get pods -n production -w

# Deployment status
kubectl describe deployment ratehub-frontend -n production

# Service endpoints
kubectl get endpoints -n production

# Ingress status
kubectl describe ingress ratehub-frontend-ingress -n production
```

### 8.2 View Logs

```bash
# Application logs
kubectl logs -f deployment/ratehub-frontend -n production

# Previous pod logs (if crashed)
kubectl logs -f deployment/ratehub-frontend -n production --previous

# All pods logs
kubectl logs -f -l app=ratehub-frontend -n production
```

### 8.3 Access Pod Shell

```bash
kubectl exec -it deployment/ratehub-frontend -n production -- /bin/sh
```

### 8.4 Common Issues

**Issue 1: ImagePullBackOff**
```bash
# Check if registry secret exists
kubectl get secret docker-registry-secret -n production

# Recreate secret if needed
kubectl delete secret docker-registry-secret -n production
kubectl create secret docker-registry docker-registry-secret ...
```

**Issue 2: CrashLoopBackOff**
```bash
# Check logs
kubectl logs deployment/ratehub-frontend -n production

# Check events
kubectl get events -n production --sort-by='.lastTimestamp'
```

**Issue 3: Ingress not working**
```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress configuration
kubectl describe ingress ratehub-frontend-ingress -n production
```

---

## Part 9: Access URLs

After complete deployment:

1. **Local Development:** http://localhost:5173
2. **Docker Local Test:** http://localhost:8080
3. **Tailscale VPN Access:** http://[tailscale-ip]:8080
4. **Production URL:** https://ratehub.yourdomain.com
5. **Rancher Dashboard:** https://[rancher-ip]
6. **Jenkins Dashboard:** http://[jenkins-ip]:8080

---

## Part 10: Scaling & Updates

### Scale Deployment

```bash
# Scale to 3 replicas
kubectl scale deployment ratehub-frontend --replicas=3 -n production

# Auto-scaling (HPA)
kubectl autoscale deployment ratehub-frontend \
  --cpu-percent=80 \
  --min=2 \
  --max=5 \
  -n production
```

### Rolling Update

```bash
# Update image
kubectl set image deployment/ratehub-frontend \
  ratehub-frontend=your-registry.com/ratehub-frontend:v2.0.0 \
  -n production

# Check rollout status
kubectl rollout status deployment/ratehub-frontend -n production

# Rollback if needed
kubectl rollout undo deployment/ratehub-frontend -n production
```

---

## Part 11: Backup & Recovery

### Backup Kubernetes Resources

```bash
# Backup all resources
kubectl get all -n production -o yaml > backup-production.yaml

# Backup specific resources
kubectl get deployment ratehub-frontend -n production -o yaml > deployment-backup.yaml
```

### Restore

```bash
kubectl apply -f backup-production.yaml
```

---

## Security Best Practices

1. ✅ Use Tailscale VPN for internal access
2. ✅ Enable SSL/TLS with Let's Encrypt
3. ✅ Use Kubernetes secrets for sensitive data
4. ✅ Implement Network Policies
5. ✅ Regular security updates
6. ✅ Use non-root containers
7. ✅ Enable pod security policies
8. ✅ Regular backups

---

## Support & Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Rebuild and redeploy
docker build -t ratehub-frontend:latest .
docker push your-registry.com/ratehub-frontend:latest
kubectl rollout restart deployment/ratehub-frontend -n production
```

### Health Checks

- Monitor application logs
- Check pod health status
- Review ingress access logs
- Monitor resource usage (CPU/Memory)

---

## Quick Reference Commands

```bash
# Build
docker build -t ratehub-frontend .

# Deploy
kubectl apply -f k8s/

# Status
kubectl get all -n production

# Logs
kubectl logs -f deployment/ratehub-frontend -n production

# Scale
kubectl scale deployment ratehub-frontend --replicas=3 -n production

# Update
kubectl set image deployment/ratehub-frontend ratehub-frontend=image:tag -n production

# Rollback
kubectl rollout undo deployment/ratehub-frontend -n production
```

---

## Contact & Support

For issues or questions:
- GitHub: https://github.com/manish-rategain2598/RateHubUX
- Documentation: Check this file and README.md

---

**Last Updated:** March 6, 2026

