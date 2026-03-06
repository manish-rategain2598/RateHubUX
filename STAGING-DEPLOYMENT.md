# RateHubUX - Staging Deployment Quick Guide

This guide provides quick steps to deploy RateHubUX to your **staging environment** on DigitalOcean with Rancher, Jenkins, and Tailscale.

---

## 🚀 Quick Start - Staging Deployment

### Step 1: Test Locally with Docker

```bash
cd /Users/manishkumar/Downloads/RateHubUX

# Build the Docker image
docker build -t ratehub-frontend:staging .

# Test locally
docker-compose up -d

# Verify it's running
curl http://localhost:8080

# View logs
docker-compose logs -f

# When done testing
docker-compose down
```

---

### Step 2: Push Docker Image to Registry

**Option A: Docker Hub**
```bash
# Login
docker login

# Tag for Docker Hub
docker tag ratehub-frontend:staging YOUR_DOCKERHUB_USERNAME/ratehub-frontend:staging

# Push
docker push YOUR_DOCKERHUB_USERNAME/ratehub-frontend:staging
```

**Option B: Private Registry**
```bash
# Tag for private registry
docker tag ratehub-frontend:staging your-registry.com/ratehub-frontend:staging

# Login and push
docker login your-registry.com
docker push your-registry.com/ratehub-frontend:staging
```

---

### Step 3: Update Configuration Files

Before deploying, update these files with your actual values:

#### 1. `k8s/deployment.yaml` (Line 28)
```yaml
image: your-registry.com/ratehub-frontend:staging  # Your actual registry
```

#### 2. `k8s/ingress.yaml` (Lines 13 & 15)
```yaml
- host: staging-ratehub.yourdomain.com  # Your staging domain
```

#### 3. `Jenkinsfile` (Line 5)
```groovy
DOCKER_REGISTRY = 'your-registry.com'  # Your actual registry
```

---

### Step 4: Setup Tailscale VPN (One-time setup)

On your DigitalOcean staging server:

```bash
# SSH to your staging server
ssh root@your-staging-server-ip

# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate
sudo tailscale up

# Get Tailscale IP
tailscale ip -4
# Example output: 100.x.x.x

# Allow Tailscale in firewall
ufw allow in on tailscale0
```

---

### Step 5: Deploy to Kubernetes via Rancher

#### A. Create Docker Registry Secret

```bash
# Get kubeconfig from Rancher dashboard
# Then run:

kubectl create secret docker-registry docker-registry-secret \
  --docker-server=your-registry.com \
  --docker-username=your-username \
  --docker-password=your-password \
  --docker-email=your-email \
  -n staging
```

#### B. Deploy Application

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment status
kubectl get all -n staging

# Watch pods coming up
kubectl get pods -n staging -w

# Check logs
kubectl logs -f deployment/ratehub-frontend -n staging
```

---

### Step 6: Configure DNS (For custom domain)

Point your staging domain to your cluster:

```
A Record: staging-ratehub.yourdomain.com → your-loadbalancer-ip
```

Or use Tailscale IP for internal access:
```
http://[tailscale-ip]:8080
```

---

### Step 7: Setup Jenkins Pipeline (Optional - for CI/CD)

#### In Jenkins Dashboard:

1. **Add Credentials** (Manage Jenkins → Credentials):
   - Docker Registry credentials (ID: `docker-registry-credentials`)
   - Kubeconfig file (ID: `kubeconfig-credentials`)

2. **Create Pipeline Job**:
   - New Item → Pipeline
   - Name: `RateHubUX-Staging`
   - Pipeline from SCM → Git
   - Repository: `https://github.com/manish-rategain2598/RateHubUX.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`

3. **Trigger Build**:
   - Click "Build Now"
   - Monitor console output

---

## 📋 Verification Checklist

After deployment, verify everything is working:

```bash
# 1. Check namespace
kubectl get namespace staging

# 2. Check pods are running
kubectl get pods -n staging
# Should show: ratehub-frontend-xxxx  1/1  Running

# 3. Check service
kubectl get svc -n staging
# Should show: ratehub-frontend-service

# 4. Check ingress
kubectl get ingress -n staging
# Should show your domain

# 5. Test application logs
kubectl logs -f deployment/ratehub-frontend -n staging

# 6. Test application endpoint
curl http://[service-ip]
# Or visit: https://staging-ratehub.yourdomain.com
```

---

## 🔗 Access URLs for Staging

After deployment, access your application via:

1. **Direct Pod Access (internal):**
   ```bash
   kubectl port-forward -n staging deployment/ratehub-frontend 8080:80
   # Then visit: http://localhost:8080
   ```

2. **Via Tailscale VPN:**
   ```
   http://[tailscale-ip]:8080
   ```

3. **Via Staging Domain:**
   ```
   https://staging-ratehub.yourdomain.com
   ```

4. **Via Kubernetes Service (internal):**
   ```
   kubectl get svc -n staging
   # Use the ClusterIP
   ```

---

## 🛠️ Common Operations

### Update Application (Rolling Update)

```bash
# Build new image
docker build -t your-registry.com/ratehub-frontend:v2 .
docker push your-registry.com/ratehub-frontend:v2

# Update deployment
kubectl set image deployment/ratehub-frontend \
  ratehub-frontend=your-registry.com/ratehub-frontend:v2 \
  -n staging

# Watch rollout
kubectl rollout status deployment/ratehub-frontend -n staging
```

### Rollback Deployment

```bash
# Rollback to previous version
kubectl rollout undo deployment/ratehub-frontend -n staging

# Check rollout history
kubectl rollout history deployment/ratehub-frontend -n staging
```

### Scale Application

```bash
# Scale to 3 replicas
kubectl scale deployment ratehub-frontend --replicas=3 -n staging

# Verify
kubectl get pods -n staging
```

### View Logs

```bash
# Current logs
kubectl logs -f deployment/ratehub-frontend -n staging

# Previous crashed pod
kubectl logs -f deployment/ratehub-frontend -n staging --previous

# All pods
kubectl logs -f -l app=ratehub-frontend -n staging
```

### Restart Application

```bash
# Restart all pods
kubectl rollout restart deployment/ratehub-frontend -n staging
```

### Delete Deployment

```bash
# Delete everything in staging namespace
kubectl delete -f k8s/

# Or delete namespace (removes everything)
kubectl delete namespace staging
```

---

## 🐛 Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl describe pod -n staging [pod-name]

# Check events
kubectl get events -n staging --sort-by='.lastTimestamp'

# Check logs
kubectl logs -n staging [pod-name]
```

### ImagePullBackOff Error

```bash
# Check if secret exists
kubectl get secret docker-registry-secret -n staging

# Recreate secret if needed
kubectl delete secret docker-registry-secret -n staging
kubectl create secret docker-registry docker-registry-secret \
  --docker-server=your-registry.com \
  --docker-username=your-username \
  --docker-password=your-password \
  -n staging
```

### Cannot Access Application

```bash
# Check if pods are running
kubectl get pods -n staging

# Check service endpoints
kubectl get endpoints -n staging

# Check ingress
kubectl describe ingress ratehub-frontend-ingress -n staging

# Port forward for direct access
kubectl port-forward -n staging deployment/ratehub-frontend 8080:80
```

---

## 🔄 CI/CD Workflow (with Jenkins)

Once Jenkins is configured, the workflow is:

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Jenkins automatically:**
   - Detects the push
   - Builds Docker image
   - Pushes to registry
   - Updates Kubernetes deployment
   - Performs rolling update

3. **Monitor in Jenkins:**
   - Go to Jenkins Dashboard
   - Check build logs
   - Verify deployment success

---

## 📊 Monitoring

### Resource Usage

```bash
# Pod resource usage
kubectl top pods -n staging

# Node resource usage
kubectl top nodes
```

### Application Health

```bash
# Check pod health
kubectl get pods -n staging

# Describe deployment
kubectl describe deployment ratehub-frontend -n staging

# Check replica status
kubectl get rs -n staging
```

---

## 🔐 Security Notes for Staging

- ✅ Use Tailscale VPN for internal-only access
- ✅ Limit staging to authorized users only
- ✅ Use separate credentials from production
- ✅ Regular updates and security patches
- ✅ Monitor logs for suspicious activity

---

## 📝 Configuration Summary

| Component | Value | Update Required |
|-----------|-------|-----------------|
| Namespace | `staging` | ✅ Already set |
| Domain | `staging-ratehub.yourdomain.com` | ⚠️ Update in k8s/ingress.yaml |
| Docker Image | `your-registry.com/ratehub-frontend:staging` | ⚠️ Update in k8s/deployment.yaml |
| Registry | `your-registry.com` | ⚠️ Update in Jenkinsfile |
| Replicas | 2 | ✅ Default set |
| Port | 80 (internal), 8080 (exposed) | ✅ Already set |

---

## 🎯 Next Steps After Staging

Once staging is tested and working:

1. ✅ Test all features in staging
2. ✅ Verify performance
3. ✅ Check logs and monitoring
4. ✅ Test with real-world scenarios
5. 🚀 Deploy to production (update namespace to `production`)

---

## 📞 Quick Reference Commands

```bash
# Deploy
kubectl apply -f k8s/

# Status
kubectl get all -n staging

# Logs
kubectl logs -f deployment/ratehub-frontend -n staging

# Update
kubectl rollout restart deployment/ratehub-frontend -n staging

# Scale
kubectl scale deployment ratehub-frontend --replicas=3 -n staging

# Delete
kubectl delete -f k8s/
```

---

## 📚 Additional Resources

- Full deployment guide: `DEPLOYMENT.md`
- Kubernetes manifests: `k8s/` folder
- Jenkins pipeline: `Jenkinsfile`
- Docker config: `Dockerfile`, `docker-compose.yml`

---

**Ready to deploy to staging!** 🚀

Follow the steps above, and your application will be running on your staging environment.

