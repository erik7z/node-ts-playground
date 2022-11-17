
## Links: 
[Add basic authentication to Kubernetes Ingress nginx](https://blog.petehouston.com/add-basic-authentication-to-kubernetes-ingress-nginx/)
[NGINX Ingress Controller on Google Kubernetes Engine](https://www.cloudskillsboost.google/focuses/872?parent=catalog)

## Deploy basic application:

```sh
kubectl apply -f << EOF -
# Deployment:
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-gke
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-gke
  template:
    metadata:
      labels:
        app: hello-gke
    spec:
      containers:
        - name: hello-kubernetes
          image: paulbouwer/hello-kubernetes:1.5
          ports:
            - containerPort: 8080

# Service:
---
apiVersion: v1
kind: Service
metadata:
  name: hello-gke
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 8080
  selector:
    app: hello-gke
    
EOF

```

## Prepare your cluster:

- Check Helm availability and install charts:
```shell
helm version
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx
```

- Deploy NGINX Ingress Controller
```shell

kubectl get service

kubectl get ingress-nginx-controller
# Get your NGINX Ingress Controller IP
kubectl get services ingress-nginx-controller --output jsonpath='{.status.loadBalancer.ingress[0].ip}'
# 35.198.77.107
```


## Setup nginx
### Step 1: Generate user and password

First thing to do is to generate user and password for the basic authentication, we will use the htpasswd:
```shell
#  Let say we want to generate user admin and password verysecret, we will issue this command:
htpasswd -nb 'admin' 'verysecret' | base64
# YWRtaW46JGFwcjEkNnNCNFgzSG8kMFJmekpaNGM4Ym5lVncuTWVmc1NLMAoK
```

### Step 2: Create the secret
```shell
kubectl apply -f << EOF -
# mysecret.yaml
---
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: basic-auth
data:
  auth: "YWRtaW46JGFwcjEkNnNCNFgzSG8kMFJmekpaNGM4Ym5lVncuTWVmc1NLMAoK"
EOF
```

### Step 3: Create Ingress
```shell


kubectl apply -f << EOF -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/auth-type: basic   
    nginx.ingress.kubernetes.io/auth-secret: basic-auth 
    nginx.ingress.kubernetes.io/auth-realm: "Authentication Required"
spec:
  rules:
  - host: '35.198.77.107.nip.io' # formerly fetched ip
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hello-gke
            port:
              number: 8080
EOF
```
