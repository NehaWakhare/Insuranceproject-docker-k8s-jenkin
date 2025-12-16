# Jenkins Pipeline Setup for Insurance Project

## Prerequisites
1. Jenkins server with Docker and kubectl installed
2. Docker Hub account
3. Kubernetes cluster access

## Step-by-Step Setup

### 1. Install Required Jenkins Plugins
- Docker Pipeline
- Kubernetes CLI
- Git
- Pipeline

### 2. Configure Credentials in Jenkins
Go to Jenkins → Manage Jenkins → Credentials → Add Credentials:

**Docker Hub Credentials:**
- Kind: Username with password
- ID: `docker-hub-credentials`
- Username: Your Docker Hub username
- Password: Your Docker Hub password

**Kubeconfig File:**
- Kind: Secret file
- ID: `kubeconfig-file`
- File: Upload your kubeconfig file

### 3. Create Jenkins Pipeline Job

1. **New Item** → **Pipeline** → Enter name: `insurance-project-pipeline`

2. **Pipeline Configuration:**
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: Your Git repository URL
   - Script Path: `Jenkinsfile`

### 4. Update Jenkinsfile Variables
Edit the Jenkinsfile and update:
```groovy
git branch: 'main', url: 'https://github.com/YOUR-USERNAME/InsuranceProject.git'
```

### 5. Project Structure Required
```
InsuranceProject/
├── Jenkinsfile
├── Dockerfile (for frontend)
├── backend.Dockerfile (for backend)
├── k8s-mysql.yaml
├── k8s-backend.yaml
├── k8s-frontend.yaml
├── package.json
└── src/
```

### 6. Run Pipeline
1. Go to your pipeline job
2. Click **Build Now**
3. Monitor the build progress

## Pipeline Stages Explained

1. **Checkout**: Downloads code from Git repository
2. **Build Frontend**: Runs `npm install` and `npm run build`
3. **Build Docker Images**: Creates Docker images for frontend and backend
4. **Push to Docker Hub**: Uploads images to Docker registry
5. **Deploy to Kubernetes**: Applies K8s manifests and deploys application
6. **Health Check**: Verifies all pods are running

## Monitoring
- Check Jenkins console output for build status
- Use `kubectl get pods` to verify deployment
- Access application via Kubernetes service URLs

## Troubleshooting
- Ensure Docker daemon is running on Jenkins agent
- Verify kubeconfig has proper cluster access
- Check Docker Hub credentials are correct
- Ensure all required files exist in repository
