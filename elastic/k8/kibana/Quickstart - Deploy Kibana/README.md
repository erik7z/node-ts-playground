#[Deply Kibana](https://www.elastic.co/guide/en/cloud-on-k8s/2.3/k8s-deploy-kibana.html#k8s-deploy-kibana)

1. Specify a Kibana instance and associate it with your Elasticsearch cluster:
```shell

cat <<EOF | kubectl apply -f -
apiVersion: kibana.k8s.elastic.co/v1
kind: Kibana
metadata:
  name: quickstart
spec:
  version: 7.2.0
  count: 1
  elasticsearchRef:
    name: quickstart
  http:
    tls:
      selfSignedCertificate:
        disabled: true
EOF
```

2. Monitor Kibana health and creation progress.
```shell
kubectl get kibana

kubectl get pod --selector='kibana.k8s.elastic.co/name=log-kibana'
```

3.Access Kibana.
```shell
# A ClusterIP Service is automatically created for Kibana:
kubectl get service log-kibana-kb-http

# Use kubectl port-forward to access Kibana from your local workstation:
kubectl port-forward service/log-kibana-kb-http 5601
```
