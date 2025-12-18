
  # we are add the Agent in pipeline then install java,docker,kubectl on agent server 
  
  # install java 
  
  sudo apt update
sudo apt install fontconfig openjdk-21-jre
java -version


# Install Docker
sudo apt-get install -y docker.io

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group (so Jenkins can run docker without sudo)
sudo usermod -aG docker ubuntu

# Verify installation
docker --version



# install Kubernetes  instance t2.large ghene == kubeadam cluster

Fresh Kubernetes Installation with kubeadm
bash# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Disable swap (required for Kubernetes)
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Load kernel modules
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Configure sysctl
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

sudo sysctl --system

# Install containerd
sudo apt-get install -y containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd
sudo systemctl enable containerd

# Install dependencies
sudo apt-get install -y apt-transport-https ca-certificates curl gpg conntrack

# Add Kubernetes repository
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

# Install Kubernetes components
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
sudo systemctl enable kubelet

echo "✅ Prerequisites installed!"
Step 3: Initialize Kubernetes Cluster
bash# Initialize cluster
sudo kubeadm init --pod-network-cidr=10.244.0.0/16

# Configure kubectl for ubuntu user
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

echo "✅ Cluster initialized!"
Step 4: Install Network Plugin
bash# Install Flannel network plugin
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

# Wait for network to be ready (30 seconds)
echo "Waiting for network plugin..."
sleep 30
Step 5: Allow Workloads on Control Plane
bash# Remove taint to allow pods on master (single-node setup)
kubectl taint nodes --all node-role.kubernetes.io/control-plane-

echo "✅ Cluster ready for workloads!"
Step 6: Verify Installation
bash# Check nodes (should be Ready)
kubectl get nodes

# Check system pods (all should be Running)
kubectl get pods -n kube-system

# Check cluster info
kubectl cluster-info

echo "🎉 Kubernetes cluster is ready!"

# Exit root session and switch to ubuntu user
exit
su - ubuntu

# Create .kube directory
mkdir -p /home/ubuntu/.kube

# Copy kubeconfig from root
sudo cp /etc/kubernetes/admin.conf /home/ubuntu/.kube/config

# Set ownership to ubuntu user
sudo chown ubuntu:ubuntu /home/ubuntu/.kube/config

# Set proper permissions
chmod 600 /home/ubuntu/.kube/config

# Verify it works
kubectl get nodes
kubectl get pods -A

