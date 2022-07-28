[Deploying PostgreSQL to Kubernetes Manually](https://adamtheautomator.com/postgres-to-kubernetes/)

### Creating a ConfigMap to Store Database Details

ConfigMap - is an API object used to store key-value pairs.

```shell
# Create ConfigMap postgres-secret for the postgres app
# Define default database name, user, and password

# postgres-configmap.yaml
kubectl apply -f << EOF -
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-secret
  labels:
    app: postgres
data:
  POSTGRES_DB: appdb
  POSTGRES_USER: appuser
  POSTGRES_PASSWORD: strongpasswordapp
EOF

kubectl get configmap # list config maps
```

### Creating PersistentVolume (PV) and PersistentVolumeClaim (PVC)

Create a PV and PVC for manual deployment to store PostgreSQL data on your Kubernetes host permanently.

```shell
# postgres-volume.yaml

kubectl apply -f << EOF -
apiVersion: v1
kind: PersistentVolume # Create PV 
metadata:
  name: postgres-volume # Sets PV name
  labels:
    type: local # Sets PV's type
    app: postgres
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi # Sets PV's size
  accessModes:
    - ReadWriteMany
  hostPath:
    path: /var/lib/data # Sets PV's host path
EOF


# create the PVC called postgres-volume-claim for your PostgreSQL deployment.
# postgres-pvc.yaml
kubectl apply -f << EOF -
apiVersion: v1
kind: PersistentVolumeClaim # Create PVC
metadata:
  name: postgres-volume-claim # Sets PVC's name
  labels:
    app: postgres # Defines app to create PVC for
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi # Sets PVC's size
EOF

# Get list of PersistentVolume
kubectl get pv

# Get list of PersistentVolumeClaim
kubectl get pvc
```

### Creating PostgreSQL Deployment

Create a PostgreSQL deployment and declare Pods configuration for the PostgreSQL in Kubernetes.

```shell
# postgres-deployment.yaml
kubectl apply -f << EOF -
apiVersion: apps/v1
kind: Deployment # Create a deployment
metadata:
  name: postgres # Set the name of the deployment
spec:
  replicas: 3 # Set 3 deployment replicas
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:12.10 # Docker image
          imagePullPolicy: "IfNotPresent"
          ports:
            - containerPort: 5432 # Exposing the container port 5432 for PostgreSQL client connections.
          envFrom:
            - configMapRef:
                name: postgres-secret # Using the ConfigMap postgres-secret
          volumeMounts:
            - mountPath: /var/lib/postgresql/data
              name: postgresdata
      volumes:
        - name: postgresdata
          persistentVolumeClaim:
            claimName: postgres-volume-claim
EOF

# checking Kubernetes deployment
kubectl get deployments

# checking pods
kubectl get pods
```

### Creating a Service for PostgreSQL

Еxpose PostgreSQL outside of the Kubernetes environment by creating and running a Kubernetes service.

```shell
# postgres-service.yaml

kubectl apply -f << EOF -
apiVersion: v1
kind: Service # Create service
metadata:
  name: postgres # Sets the service name
  labels:
    app: postgres # Defines app to create service for
spec:
  type: NodePort # Sets the service type
  ports:
    - port: 5432 # Sets the port to run the postgres application
  selector:
    app: postgres
EOF

kubectl get svc
```

### Connecting to PostgreSQL via kubectl Command

```sh
kubectl exec -it postgres-xxxx -- psql -h localhost -U appuser --password -p 5432 appdb

# run the query below to get information about your connection to the PostgreSQL shell
\conninfo

# exit
\q

```
