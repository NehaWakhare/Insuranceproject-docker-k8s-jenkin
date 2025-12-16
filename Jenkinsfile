pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        KUBECONFIG_CREDENTIALS = credentials('kubeconfig-file')
        IMAGE_TAG = "${BUILD_NUMBER}"
        FRONTEND_IMAGE = "neha676/insurance-frontend"
        BACKEND_IMAGE = "neha676/insurance-backend"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo/InsuranceProject.git'
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        script {
                            sh '''
                                docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} .
                                docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest
                            '''
                        }
                    }
                }
                stage('Build Backend Image') {
                    steps {
                        script {
                            sh '''
                                # Assuming backend Dockerfile exists
                                docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -f backend.Dockerfile .
                                docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    sh '''
                        echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest
                    '''
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh '''
                        # Setup kubectl
                        mkdir -p ~/.kube
                        cp $KUBECONFIG_CREDENTIALS ~/.kube/config
                        
                        # Update image tags in k8s files
                        sed -i "s|neha676/insurance-frontend:latest|${FRONTEND_IMAGE}:${IMAGE_TAG}|g" k8s-frontend.yaml
                        sed -i "s|neha676/insurance-backend:latest|${BACKEND_IMAGE}:${IMAGE_TAG}|g" k8s-backend.yaml
                        
                        # Deploy to Kubernetes
                        kubectl apply -f k8s-mysql.yaml
                        kubectl apply -f k8s-backend.yaml
                        kubectl apply -f k8s-frontend.yaml
                        
                        # Wait for deployment
                        kubectl rollout status deployment/mysql
                        kubectl rollout status deployment/backend
                        kubectl rollout status deployment/frontend
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    sh '''
                        # Wait for pods to be ready
                        kubectl wait --for=condition=ready pod -l app=mysql --timeout=300s
                        kubectl wait --for=condition=ready pod -l app=backend --timeout=300s
                        kubectl wait --for=condition=ready pod -l app=frontend --timeout=300s
                        
                        # Get service URLs
                        echo "Application deployed successfully!"
                        kubectl get services
                    '''
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
