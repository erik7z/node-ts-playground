# Deploying on multiple nodes

- create cluster
```shell
gcloud container clusters create  --num-nodes 2 "elastic" --zone us-central1-a
```

- Setup operator
```shell
# 1. Install custom resource definitions:
kubectl create -f https://download.elastic.co/downloads/eck/2.3.0/crds.yaml

# 1a. If your user doesn't have cluster-admin permissions, create appropriate role binding:
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account)

# 2. Install the operator with its RBAC rules:
kubectl apply -f https://download.elastic.co/downloads/eck/2.3.0/operator.yaml

# 3. Monitor the operator logs:
kubectl -n elastic-system logs -f statefulset.apps/elastic-operator
```

- Create custom storage class with volumeBindingMode set to WaitForFirstConsumer
```shell
kubectl apply -f << EOF -
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: es-storage
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Delete
allowVolumeExpansion: true
EOF
```

- Create elastic instance:
```shell
kubectl create -f << EOF -
---
apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  name: log-elastic
  annotations:
    eck.k8s.elastic.co/downward-node-labels: "topology.kubernetes.io/zone"
spec:
  version: 7.2.0
  volumeClaimDeletePolicy: DeleteOnScaledownOnly
  # disabling tls (https://www.elastic.co/guide/en/cloud-on-k8s/2.3/k8s-tls-certificates.html#k8s-disable-tls)
  http:
    tls:
      selfSignedCertificate:
        disabled: true
  nodeSets:
    - name: default
      count: 1
      config:
        node.store.allow_mmap: false
        # disabling auth (https://discuss.elastic.co/t/dont-want-to-use-https-and-user-password/202332)
        xpack.security.enabled: false
        # enabling anonymous access (https://www.elastic.co/guide/en/elasticsearch/reference/7.4/anonymous-access.html)
        xpack.security.authc:
          anonymous:
            username: anonymous
            roles: superuser
            authz_exception: false
      podTemplate:
        spec:
          containers:
            - name: elasticsearch
      volumeClaimTemplates:
        - metadata:
            name: elasticsearch-data # Do not change this name unless you set up a volume mount for the data path.
          spec:
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 5Gi
            storageClassName: es-storage
EOF
```


What can go wrong:
1. Persistent volume not attached to pod with error
    ``` 1 node(s) didn't match node selector, 2 node(s) didn't find available persistent volumes to bind. ```
   - solution:
     - add zonal labels to nodes - ``` kubectl label nodes gke-production-cluste-production-pool-e5787330-9gnm topology.kubernetes.io/zone=asia-east2-a ``` (ASK LIPSKY)
     - add ``` exposed-node-labels: [topology.kubernetes.io/.*,failure-domain.beta.kubernetes.io/.*] ``` to elastic-operator config map [data.eck.yaml]

