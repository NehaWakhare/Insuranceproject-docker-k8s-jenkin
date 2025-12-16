pipeline {
    agent any
    
    environment {
        GIT_REPO = 'https://github.com/NehaWakhare/Insuranceproject-docker-k8s-jenkin.git'
        GIT_BRANCH = 'main'
        DOCKER_BACKEND = 'neha676/insurance-backend:latest'
        DOCKER_FRONTEND = 'neha676/insurance-frontend:latest'
        BUILD_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('1. Git Checkout') {
            steps {
                echo '📥 Cloning repository...'
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
                sh 'git log -1'
            }
        }
        
        stage('2. Pull Docker Images') {
            steps {
                echo '🐳 Pulling Docker images from Docker Hub...'
                sh '''
                    docker pull ${DOCKER_BACKEND}
                    docker pull ${DOCKER_FRONTEND}
                    docker pull mysql:8.0
                '''
            }
        }
        
        stage('3. Tag Images with Build Number') {
            steps {
                echo '🏷️ Tagging images...'
                sh '''
                    docker tag ${DOCKER_BACKEND} neha676/insurance-backend:${BUILD_TAG}
                    docker tag ${DOCKER_FRONTEND} neha676/insurance-frontend:${BUILD_TAG}
                '''
            }
        }
        
        stage('4. Remove Old Kubernetes Deployments') {
            steps {
                echo '🗑️ Cleaning old deployments...'
                sh '''
                    kubectl delete deployment backend frontend mysql --ignore-not-found=true
                    kubectl delete svc backend frontend mysql --ignore-not-found=true
                    kubectl delete pvc mysql-pvc --ignore-not-found=true
                    kubectl delete pv --all --ignore-not-found=true
                    sleep 10
                '''
            }
        }
        
        stage('5. Deploy MySQL') {
            steps {
                echo '💾 Deploying MySQL...'
                sh '''
                    kubectl apply -f k8s-mysql.yaml
                    sleep 20
                    kubectl get pods -l app=mysql
                '''
            }
        }
        
        stage('6. Deploy Backend') {
            steps {
                echo '⚙️ Deploying Backend...'
                sh '''
                    kubectl apply -f k8s-backend.yaml
                    sleep 15
                    kubectl get pods -l app=backend
                '''
            }
        }
        
        stage('7. Deploy Frontend') {
            steps {
                echo '🎨 Deploying Frontend...'
                sh '''
                    kubectl apply -f k8s-frontend.yaml
                    sleep 15
                    kubectl get pods -l app=frontend
                '''
            }
        }
        
        stage('8. Verify Deployment') {
            steps {
                echo '✅ Verifying deployment...'
                sh '''
                    echo "=== PODS ==="
                    kubectl get pods
                    
                    echo ""
                    echo "=== SERVICES ==="
                    kubectl get svc
                '''
            }
        }
        
        stage('9. Health Check') {
            steps {
                echo '🏥 Running health checks...'
                sh '''
                    sleep 30
                    kubectl get pods | grep -i running || echo "Waiting for pods..."
                    echo "Frontend: http://3.137.181.97:30082"
                    echo "Backend: http://3.137.181.97:30081"
                '''
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            sh 'docker system prune -f || true'
        }
        success {
            echo '✅✅✅ DEPLOYMENT SUCCESSFUL! ✅✅✅'
            echo """
            ================================================
            🎉 Insurance Project Deployed Successfully!
            ================================================
            
            📦 Build Number: ${BUILD_NUMBER}
            🐳 Backend Image: ${DOCKER_BACKEND}
            🐳 Frontend Image: ${DOCKER_FRONTEND}
            
            🌐 Access URLs:
            Frontend: http://3.137.181.97:30082
            Backend: http://3.137.181.97:30081
            
            ================================================
            """
        }
        failure {
            echo '❌ DEPLOYMENT FAILED!'
        }
    }
}
