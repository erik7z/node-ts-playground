

```shell
# Create configMap as .env file:

kubectl delete -f  << EOF -
apiVersion: v1
kind: ConfigMap
metadata:
  name: configmap-env
data:
  .env: |
    key=value
EOF

# Use it in the pod:

kubectl delete -f << EOF -
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  labels:
    app: busybox
spec:
  containers:
  - name: busybox
    image: busybox
    command:
    - sh
    - -c
    - while :; do cat /configuration/.env; sleep 1; done
    volumeMounts:
    - name: configmap-env-volume
      mountPath: /configuration # update this path to the path your app expects
  volumes:
    - name: configmap-env-volume
      configMap:
        name: configmap-env
EOF
```
