[DOCKER & KUBERNETES : PERSISTENT VOLUMES - DYNAMIC VOLUME PROVISIONING](https://www.bogotobogo.com/DevOps/Docker/Docker_Kubernetes_Persistent_Volumes_Dynamic_Volume_Provisioning.php)

## Kubernetes PersistentVolume

The PersistentVolume subsystem provides an API for users and administrators that abstracts details of how storage is
provided from how it is consumed.

PVs may be provisioned: statically or dynamically.

- Static: PV needs to be created before PvC
- Dynamic: PV is created same time as PVC

#### Initial set-up (optional):
```sh
gcloud config set compute/zone us-central1-a
gcloud container clusters get-credentials <your cluster>
```

### Creating StorageClass

```shell
# storage-class.yaml

kubectl apply -f << EOF -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
EOF

# list storage classes
kubectl get storageclass

kubectl describe storageclass fast
```

### Creating Persistent Volume Claim (PVC) - Requesting storage
Pods access storage by using the claim as a volume. Claims must exist in the same namespace as the pod using the claim. 
The cluster finds the claim in the pod’s namespace and uses it to get the PersistentVolume backing the claim. 
The volume is then mounted to the host and into the pod.

```sh
# pvc-1.yaml
kubectl apply -f << EOF -
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: myclaim-1
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 8Gi
  storageClassName: fast
EOF

# pvc-2.yaml
kubectl apply -f << EOF -
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: myclaim-2
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 16Gi
  storageClassName: fast
EOF

```


### Referencing the claim from a Pod - Pod definition
Pods access storage by using the claim as a volume. Claims must exist in the same namespace as the pod using the claim. 
The cluster finds the claim in the pod's namespace and uses it to get the PersistentVolume backing the claim. 
The volume is then mounted to the host and into the pod

```shell
# nginx-pod.yaml
kubectl apply -f << EOF -
kind: Pod
apiVersion: v1
metadata:
  name: pv-pod
spec:
  containers:
    - name: pv-test-container
      image: nginx
      volumeMounts:
      - mountPath: "/test-pd"
        name: my-test-volume
  volumes:
    - name: my-test-volume
      persistentVolumeClaim:
        claimName: myclaim-1
EOF

kubectl get po -o wide
```

### Testing - Data persistence

```sh
kubectl get pod
kubectl exec -it pv-pod -- /bin/sh
# > inside pod:
cd /test-pd
echo "I was here" > i_was_here.txt
exit

# exit and delete pod:
kubectl delete -f nginx-pod.yaml

# recreate it:
kubectl create  -f nginx-pod.yaml

kubectl get po -o wide

# check pod mounts:
kubectl exec pv-pod df /test-pd

# confirm that file still exists
kubectl exec pv-pod ls /test-pd
```

### CLEANUP:
```shell
kubectl delete -f nginx-pod.yaml
kubectl delete -f pvc-1.yaml
kubectl delete -f pvc-2.yaml
kubectl delete -f storage-class.yaml
```
