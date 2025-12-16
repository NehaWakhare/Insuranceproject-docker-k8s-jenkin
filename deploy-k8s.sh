#!/bin/bash

echo "Starting minikube..."
minikube start

echo "Deploying MySQL..."
kubectl apply -f k8s-mysql.yaml

echo "Waiting for MySQL to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql --timeout=300s

echo "Deploying Backend..."
kubectl apply -f k8s-backend.yaml

echo "Waiting for Backend to be ready..."
kubectl wait --for=condition=ready pod -l app=backend --timeout=300s

echo "Deploying Frontend with nginx proxy..."
kubectl apply -f k8s-frontend.yaml

echo "Waiting for Frontend to be ready..."
kubectl wait --for=condition=ready pod -l app=frontend --timeout=300s

echo "Checking pod status..."
kubectl get pods

echo "Getting service URLs..."
echo "Frontend URL (access this in browser):"
minikube service frontend --url

echo "Backend URL (for direct API access):"
minikube service backend --url

echo "Deployment complete!"
echo "The frontend will proxy /api requests to the backend automatically."
