[Elastic Cloud on Kubernetes](https://www.elastic.co/downloads/elastic-cloud-kubernetes)
[Quickstart](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-quickstart.html#k8s-quickstart)


# Deploying Elastic

If you are using GKE, make sure your user has cluster-admin permissions. 
[Prerequisites for using Kubernetes RBAC on GKE](https://cloud.google.com/kubernetes-engine/docs/how-to/role-based-access-control#iam-rolebinding-bootstrap)

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
Deploy an Elasticsearch cluster
```shell
cat <<EOF | kubectl delete -f -
apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  name: log-elastic
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
            storageClassName: standard
EOF

# monitor creation progress
kubectl get elasticsearch
> NAME         HEALTH   NODES   VERSION   PHASE   AGE
> quickstart   green    1       7.2.0     Ready   94s

kubectl get pods --selector='elasticsearch.k8s.elastic.co/cluster-name=quickstart'
kubectl logs -f quickstart-es-default-0

```


# [Deploying Jaeger](https://www.jaegertracing.io/docs/1.34/operator/)

Since version 1.31 the Jaeger Operator uses webhooks to validate Jaeger custom resources (CRs). This requires an installed version of the cert-manager
### [Install cert-manager](https://cert-manager.io/v1.6-docs/installation/#default-static-install)

```shell
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.6.3/cert-manager.yaml
```

### Installing Jaeger Operator on Kubernetes

```shell
kubectl create namespace observability
kubectl create -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.34.0/jaeger-operator.yaml -n observability 

# check that installed correctly:
kubectl get deployment jaeger-operator -n observability
```

### Deploy production configured jaeger:
```shell
kubectl apply -f << EOF -
apiVersion: jaegertracing.io/v1
kind: Jaeger
metadata:
  name: log-jaeger
spec:
  strategy: production
  collector:
    resources:
      limits:
        cpu: 100m
        memory: 256Mi
  ingress:
    enabled: true # set to false if using custom ingress
  storage:
    type: elasticsearch
    options:
      es:
        server-urls: http://log-elastic-es-http:9200
  #      esIndexCleaner:
  #        enabled: true                                 // turn the cron job deployment on and off
  #        numberOfDays: 7                               // number of days to wait before deleting a record
  #        schedule: "55 23 * * *"                       // cron expression for it to run
EOF
```
