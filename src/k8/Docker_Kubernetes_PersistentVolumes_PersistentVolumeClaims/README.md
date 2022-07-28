# [DOCKER & KUBERNETES : PERSISTENT VOLUMES & PERSISTENT VOLUMES CLAIMS - HOSTPATH AND ANNOTATIONS](https://www.bogotobogo.com/DevOps/Docker/Docker_Kubernetes_PersistentVolumes_PersistentVolumeClaims.php)

## Kubernetes Volume

Create simple pod with a default volume mount. 
By default, creates volume of type emptyDir, that lasts for the life of the Pod, 
even if the Container terminates and restarts.

```sh
kubectl create -f << EOF -
# (busybox.yaml)
kind: Pod
apiVersion: v1
metadata:
  name: busybox-pod
spec:
  containers:
    - name: bysybox-container
      image: busybox
      command: ['sleep', '3600']
      volumeMounts:
        - mountPath: "/cache"
          name: cache
  volumes:
  - name: cache
EOF

kubectl create -f busybox.yaml
kubectl exec -it busybox-pod sh # cache directory will be found there
```

### Volume of type "emptyDir"
pod with emtyDir type of volume
```shell
# (redis.yaml)
kubectl create -f << EOF -
apiVersion: v1
kind: Pod
metadata:
  name: redis
spec:
  containers:
  - name: redis
    image: redis
    volumeMounts:
    - name: redis-storage
      mountPath: /data/redis
  volumes:
  - name: redis-storage
    emptyDir: {}
EOF
```


### PersistentVolumes for Storage
Summary:
1. A cluster administrator creates a PersistentVolume that is backed by physical storage. The administrator does not associate the volume with any Pod.
2. A cluster user creates a PersistentVolumeClaim, which gets automatically bound to a suitable PersistentVolume.
3. The user creates a Pod that uses the PersistentVolumeClaim as storage.


#### create hostPath PersistentVolume
hostPath are only for development and testing on a single-node cluster. 
A hostPath PersistentVolume uses a file or directory on the Node to emulate network-attached storage.

In a production cluster administrator would provision a network resource like a Google Compute Engine persistent disk, 
an NFS share, or an Amazon Elastic Block Store volume. 

hostPath (minikube):
```shell
# create file on host:
minikube ssh 
sudo mkdir /mnt/data
echo 'Hello from Kubernetes storage' | sudo tee -a /mnt/data/index.html 

# create PersistentVolume
# pv-volume.yaml
kubectl delete -f << EOF -
kind: PersistentVolume
apiVersion: v1
metadata:
  name: task-pv-volume
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
EOF

kubectl get pv task-pv-volume
```


### Create a PersistentVolumeClaim
Pods use PersistentVolumeClaims to request physical storage.
Create a PersistentVolumeClaim that requests a volume of at least three gibibytes that 
can provide read-write access for at least one Node.
```shell
# pv-claim.yaml
kubectl apply -f << EOF -
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: task-pv-claim
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 3Gi
EOF
kubectl get pv task-pv-volume #  output shows a STATUS of Bound!
kubectl get pvc task-pv-claim # can see attached volume
```

### Create a Pod uses PersistentVolumeClaim as a volume

```shell
# pv-pod.yaml
kubectl apply -f << EOF -
kind: Pod
apiVersion: v1
metadata:
  name: task-pv-pod
spec:
  volumes:
    - name: task-pv-storage
      persistentVolumeClaim:
       claimName: task-pv-claim
  containers:
    - name: task-pv-container
      image: nginx
      ports:
        - containerPort: 80
          name: "http-server"
      volumeMounts:
        - mountPath: "/usr/share/nginx/html"
          name: task-pv-storage
EOF

# get inside pod and confirm that it uses previously created volume and files
kubectl get pod task-pv-pod
kubectl exec -it task-pv-pod -- /bin/bash
root@task-pv-pod:/# apt-get update
root@task-pv-pod:/# apt-get install -y curl
root@task-pv-pod:/# curl localhost
#> Hello from Kubernetes storage

```

### Cleanup:

```shell
cat pv-*.yaml | kubectl delete -f -
```

## Access control - annotations
Storage configured with a group ID (GID) allows writing only by Pods using the same GID. 
Mismatched or missing GIDs cause permission denied errors. 
To reduce the need for coordination with users, an administrator can annotate a PersistentVolume with a GID. 
Then the GID is automatically added to any Pod that uses the PersistentVolume.

```shell
kubectl apply -f << EOF -
kind: PersistentVolume
apiVersion: v1
metadata:
  name: task-pv-volume
  labels:
    type: local
  annotations:
    pv.beta.kubernetes.io/gid: "1001"
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
EOF
```

So, when a Pod consumes a PersistentVolume that has a GID annotation, the annotated GID is applied to all 
Containers in the Pod in the same way that GIDs specified in the Pod's security context are. 
Every GID, whether it originates from a PersistentVolume annotation or the Pod’s specification, 
is applied to the first process run in each Container.









