pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-docker-registry.com' // Update with your registry
        IMAGE_NAME = 'ratehub-frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_CREDENTIALS_ID = 'docker-registry-credentials' // Jenkins credential ID
        KUBECONFIG_CREDENTIALS_ID = 'kubeconfig-credentials' // Jenkins credential ID
        NAMESPACE = 'production' // Kubernetes namespace
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git rev-parse --short HEAD > .git/commit-id'
                script {
                    env.GIT_COMMIT_SHORT = readFile('.git/commit-id').trim()
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
                    sh """
                        docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} .
                        docker tag ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                    """
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS_ID}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            echo \$DOCKER_PASS | docker login ${DOCKER_REGISTRY} -u \$DOCKER_USER --password-stdin
                            docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                            docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                        """
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS_ID}", variable: 'KUBECONFIG')]) {
                        sh """
                            kubectl --kubeconfig=\$KUBECONFIG set image deployment/ratehub-frontend \
                                ratehub-frontend=${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} \
                                -n ${NAMESPACE}
                            
                            kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/ratehub-frontend -n ${NAMESPACE}
                        """
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
            // Add notification here (Slack, email, etc.)
        }
        failure {
            echo 'Deployment failed!'
            // Add notification here
        }
        always {
            sh 'docker logout ${DOCKER_REGISTRY} || true'
            cleanWs()
        }
    }
}

