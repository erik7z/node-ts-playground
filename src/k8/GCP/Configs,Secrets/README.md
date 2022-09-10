

```shell
# Create configMap as .env file:

kubectl apply -f  << EOF -
apiVersion: v1
kind: ConfigMap
metadata:
  name: env
data:
  .env: |
    key=value
EOF

# Use it in the pod:

kubectl apply -f << EOF -
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  labels:
    app: busybox
spec:
  volumes:
  - name: env
    configMap:
      name: env
  containers:
  - name: busybox
    image: busybox
    command:
    - sh
    - -c
    - while :; do cat /configuration/.env; sleep 1; done
    volumeMounts:
    - name: env
      mountPath: /configuration # update this path to the path your app expects
EOF
```
