# [Volumes](https://cloud.google.com/kubernetes-engine/docs/concepts/volumes)

- guide:
[Creating volumes](https://cloud.google.com/kubernetes-engine/docs/how-to/volumes)

## Using Volumes with Deployments

You can create a Deployment of Pods where each Pod contains one or more Volumes. 
The following Deployment manifest describes a Deployment of three Pods that each have an emptyDir Volume


```sh
# (volumes-demo.yaml)
kubectl apply -f << EOF -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: volumes-example-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      containers:
      - name: test-container
        image: us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0
        volumeMounts:
        - mountPath: /cache
          name: cache-volume
      volumes:
        - name: cache-volume
          emptyDir: {}
EOF
```
