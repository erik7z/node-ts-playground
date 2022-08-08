# [Setting up HTTP(S) Load Balancing with Ingress](https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer)

## Deploying a web application
```shell
# Set defaults for the gcloud command-line tool
gcloud config set compute/zone us-east4-a

# Create a container cluster
gcloud container clusters create loadbalancedcluster

# retrieve cluster credentials and configure kubectl command-line tool
gcloud container clusters get-credentials loadbalancedcluster

# Apply the resource to the cluster: (web-deployment.yaml)
kubectl apply -f << EOF -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: default
spec:
  selector:
    matchLabels:
      run: web
  template:
    metadata:
      labels:
        run: web
    spec:
      containers:
        - image: us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0
          imagePullPolicy: IfNotPresent
          name: web
          ports:
            - containerPort: 8080
              protocol: TCP
---
EOF

# Exposing your Deployment inside your cluster: (web-service.yaml)
kubectl apply -f << EOF -
apiVersion: v1
kind: Service
metadata:
  name: web
  namespace: default
spec:
  ports:
    - port: 8080
      protocol: TCP
      targetPort: 8080
  selector:
    run: web
  type: NodePort
---
EOF

# Creating an Ingress resource: (basic-ingress.yaml)
kubectl apply -f << EOF -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: basic-ingress
spec:
  defaultBackend:
    service:
      name: web
      port:
        number: 8080
---
EOF

# Find out the external IP address of the load balancer serving your application by running:
kubectl get ingress basic-ingress # wait 5 minutes until address appear and ingress connected to service
```

## Configuring a static IP address

By default, GKE allocates ephemeral external IP addresses for HTTP applications exposed through an Ingress. 
Ephemeral addresses are subject to change. If you are planning to run your application for a long time, 
you must use a static external IP address.

*Note that after you configure a static IP for the Ingress resource, deleting the Ingress does not delete the static IP address associated with it. 
Make sure to clean up the static IP addresses you configured when you no longer plan to use them again.*

```shell
# Reserve a static external IP address named web-static-ip:
gcloud compute addresses create web-static-ip --global
gcloud compute addresses list 

# Apply updated resource to the cluster: (basic-ingress-static.yaml)
kubectl apply -f << EOF -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: basic-ingress
  annotations:
    kubernetes.io/ingress.global-static-ip-name: "web-static-ip"
spec:
  defaultBackend:
    service:
      name: web
      port:
        number: 8080
---
EOF

# after few minutes check updated external IP address:
kubectl get ingress basic-ingress

```

## Serving multiple applications on a load balancer
You can run multiple services on a single load balancer and public IP by configuring routing rules on the Ingress. 
By hosting multiple services on the same Ingress, you can avoid creating additional load balancers (which are billable resources) 
for every Service that you expose to the internet.

```sh
# create another deployment: (web-deployment-v2.yaml)
kubectl apply -f << EOF -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web2
  namespace: default
spec:
  selector:
    matchLabels:
      run: web2
  template:
    metadata:
      labels:
        run: web2
    spec:
      containers:
      - image: us-docker.pkg.dev/google-samples/containers/gke/hello-app:2.0
        imagePullPolicy: IfNotPresent
        name: web2
        ports:
        - containerPort: 8080
          protocol: TCP
---
EOF


# create service for above deployment:
kubectl apply -f << EOF -
apiVersion: v1
kind: Service
metadata:
  name: web2
  namespace: default
spec:
  ports:
  - port: 8080
    protocol: TCP
    targetPort: 8080
  selector:
    run: web2
  type: NodePort
---
EOF
```
Create Ingress resource that:
routes the requests with path starting with /v2/ to the web2 Service
routes all other requests to the web Service

```sh
kubectl apply -f << EOF -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fanout-ingress
spec:
  rules:
  - http:
      paths:
      - path: /*
        pathType: ImplementationSpecific
        backend:
          service:
            name: web
            port:
              number: 8080
      - path: /v2/*
        pathType: ImplementationSpecific
        backend:
          service:
            name: web2
            port:
              number: 8080
---
EOF
kubectl create -f fanout-ingress.yaml

#After the Ingress is deployed, run
kubectl get ingress fanout-ingress

```

### Clean up

```sh
kubectl delete ingress basic-ingress
kubectl delete ingress fanout-ingress
gcloud compute addresses delete web-static-ip --global
gcloud container clusters delete loadbalancedcluster
```
