# [Deploy Grafana on Kubernetes](https://grafana.com/docs/grafana/latest/setup-grafana/installation/kubernetes/)

## Create a Grafana Kubernetes manifest
```yaml
# kubectl apply -f << EOF -
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: grafana-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: grafana
  name: grafana
spec:
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      securityContext:
        fsGroup: 472
        supplementalGroups:
          - 0
      containers:
        - name: grafana
          image: grafana/grafana:9.1.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
              name: http-grafana
              protocol: TCP
          readinessProbe:
            failureThreshold: 3
            httpGet:
              path: /robots.txt
              port: 3000
              scheme: HTTP
            initialDelaySeconds: 10
            periodSeconds: 30
            successThreshold: 1
            timeoutSeconds: 2
          livenessProbe:
            failureThreshold: 3
            initialDelaySeconds: 30
            periodSeconds: 10
            successThreshold: 1
            tcpSocket:
              port: 3000
            timeoutSeconds: 1
          resources:
            requests:
              cpu: 250m
              memory: 750Mi
          volumeMounts:
            - mountPath: /var/lib/grafana
              name: grafana-pv
      volumes:
        - name: grafana-pv
          persistentVolumeClaim:
            claimName: grafana-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: grafana
spec:
  ports:
    - port: 3000
      protocol: TCP
      targetPort: http-grafana
  selector:
    app: grafana
  sessionAffinity: None
  type: LoadBalancer
  
# EOF
```

Check that it worked by running the following command:
```shell
kubectl port-forward service/grafana 3000:3000

# Navigate to localhost:3000 in your browser. You should see a Grafana login page.
# Use admin for both the username and password to login.
```

## [Setup Prometheus Monitoring](https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/)
- additional files: [kubernetes-prometheus](https://github.com/techiescamp/kubernetes-prometheus)

### Connect to your Kubernetes cluster and make sure you have admin privileges to create cluster roles.
- If you are using Google cloud GKE, you need to run the following commands as you need privileges to create cluster roles for this Prometheus setup.
```shell
ACCOUNT=$(gcloud info --format='value(config.account)')

kubectl create clusterrolebinding owner-cluster-admin-binding \
    --clusterrole cluster-admin \
    --user $ACCOUNT
    
#> clusterrolebinding.rbac.authorization.k8s.io/owner-cluster-admin-binding created
```

### Create a namespace for Prometheus and Grafana.
```shell
kubectl create namespace monitoring
```

### Create clusterRole and clusterRoleBinding for Prometheus.
```yaml
# kubectl apply -f << EOF -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - apiGroups: [""]
    resources:
      - nodes
      - nodes/proxy
      - services
      - endpoints
      - pods
    verbs: ["get", "list", "watch"]
  - apiGroups:
      - extensions
    resources:
      - ingresses
    verbs: ["get", "list", "watch"]
  - nonResourceURLs: ["/metrics"]
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
  - kind: ServiceAccount
    name: default
    namespace: default #monitoring
# EOF
```

### Create a Config Map To Externalize Prometheus Configurations.
All configurations for Prometheus are part of prometheus.yaml file and all the alert rules for Alert Manager are configured in prometheus.rules file.

By externalizing Prometheus configs to a Kubernetes config map, you don’t have to build the Prometheus image whenever you need to add or remove a configuration. 
You need to update the config map and restart the Prometheus pods to apply the new configuration.

The config map with all the Prometheus scrape config and alerting rules gets mounted to the Prometheus container in 
/etc/prometheus location as prometheus.yaml and prometheus.rules files.

```shell
#  works only from file 
kubectl apply -f config-map.yaml
```
> Note: In Prometheus terms, the config for collecting metrics from a collection of endpoints is called a job. 

The prometheus.yaml contains all the configurations to discover pods and services running in the Kubernetes cluster dynamically. 
We have the following scrape jobs in our Prometheus scrape configuration.
    1. **kubernetes-apiservers**: It gets all the metrics from the API servers.
    2. **kubernetes-nodes**: It collects all the kubernetes node metrics.
    3. **kubernetes-pods**: All the pod metrics get discovered if the pod metadata is annotated with prometheus.io/scrape and prometheus.io/port annotations.
    4. **kubernetes-cadvisor**: Collects all cAdvisor metrics.
    5. **kubernetes-service-endpoints**: All the Service endpoints are scrapped if the service metadata is annotated with prometheus.io/scrape and prometheus.io/port annotations. 
        It can be used for black-box monitoring.

### Create a Prometheus Deployment

> Also, we are not using any persistent storage volumes for Prometheus storage as it is a basic setup. 
> When setting up Prometheus for production uses cases, make sure you add persistent storage to the deployment.

```yaml
# prometheus-deployment.yaml
# kubectl create -f << EOF - 
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus-deployment
  namespace: default # monitoring
  labels:
    app: prometheus-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus-server
  template:
    metadata:
      labels:
        app: prometheus-server
    spec:
      containers:
        - name: prometheus
          image: prom/prometheus
          args:
            - "--storage.tsdb.retention.time=12h"
            - "--config.file=/etc/prometheus/prometheus.yml"
            - "--storage.tsdb.path=/prometheus/"
          ports:
            - containerPort: 9090
          resources:
            requests:
              cpu: 500m
              memory: 500M
            limits:
              cpu: 1
              memory: 1Gi
          volumeMounts:
            - name: prometheus-config-volume
              mountPath: /etc/prometheus/
            - name: prometheus-storage-volume
              mountPath: /prometheus/
      volumes:
        - name: prometheus-config-volume
          configMap:
            defaultMode: 420
            name: prometheus-server-conf

        - name: prometheus-storage-volume
          emptyDir: {}
# EOF
```

check that installation succeed:
```shell
kubectl get deployments #-n monitoring
kubectl get pods #-n monitoring
```


### Connecting To Prometheus Dashboard

You can view the deployed Prometheus dashboard in three different ways.
- Using Kubectl port forwarding
- Exposing the Prometheus deployment as a service with NodePort or a Load Balancer.
- Adding an Ingress object if you have an Ingress controller deployed.

#### Method 1: Using Kubectl port forwarding
```shell
kubectl get pods #--namespace=monitoring
kubectl port-forward prometheus-deployment-5d8b5f4d9d-7j2xh 9090:9090 #--namespace=monitoring
```

#### Method 2: Exposing the Prometheus deployment as a service with NodePort or a Load Balancer.
```yaml
# prometheus-service.yaml
# kubectl create -f << EOF - 
apiVersion: v1
kind: Service
metadata:
  name: prometheus-service
  namespace: default #monitoring
  labels:
    app: prometheus-server
spec:
  type: LoadBalancer
  ports:
    - port: 9090
      targetPort: 9090
  selector:
    app: prometheus-server
# EOF
```

#### Method 3: Adding an Ingress object if you have an Ingress controller deployed.
```yaml
# prometheus-ingress.yaml
# kubectl apply -f << EOF - 
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: prometheus-ingress
  namespace: default #monitoring
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: prometheus.techiescamp.com
      http:
        paths:
          - path: /
            backend:
              serviceName: prometheus-service
              servicePort: 9090
# EOF
```

### Create a Grafana Deployment
```yaml
# grafana-deployment.yaml
# kubectl apply -f << EOF - 
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana-deployment
  namespace: default #monitoring
  labels:
    app: grafana
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
        - name: grafana
          image: grafana/grafana
          ports:
            - containerPort: 3000
          volumeMounts:
            - name: grafana-storage-volume
              mountPath: /var/lib/grafana
      volumes:
        - name: grafana-storage-volume
          emptyDir: {}
# EOF
```
