# [Use Cron to schedule pods restarts](https://stackoverflow.com/questions/52422300/how-to-schedule-pods-restart)


- Connect to cluster:
```shell
gcloud auth login
gcloud projects list
gcloud config set project <projectname>

gcloud container clusters list
gcloud container clusters get-credentials ez --zone europe-west4-a
kubectl config get-contexts 
kubectl config use-context <context name>
```

- Create testing deployment:
```shell
kubectl apply -f << EOF -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-cron-depl
  labels:
    env: development
    tier: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      project: test-cron-proj
  template:
    metadata:
      labels:
        project: test-cron-proj
    spec:
      containers:
        - name: test-cron-ctr
          image: ubuntu
          command: [ "/bin/bash", "-c", "--" ]
          args: [ "while true; do sleep 30; done;" ]
EOF

```
### Setup RBAC
You have to setup RBAC, so that the Kubernetes client running from inside the cluster has permissions to do needed calls 
to the Kubernetes API.

- Create service account
```shell
# Service account which the client will use to reset the deployment,
# by default the pods running inside the cluster cannot do such things.

kubectl apply -f << EOF -
kind: ServiceAccount
apiVersion: v1
metadata:
  name: deployment-restart
  namespace: default
EOF
```


- Create Role
```shell
# allow getting status and patching only the one deployment you want
# to restart

kubectl apply -f << EOF -
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployment-restart
  namespace: default
rules:
  - apiGroups: ["apps", "extensions"]
    resources: ["deployments"]
    resourceNames: ["test-cron-depl"]
    verbs: ["get", "patch", "list", "watch"]
EOF
# "list" and "watch" are only needed if you want to use `rollout status`
```

- Bind role to service account
```shell
kubectl apply -f << EOF -
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deployment-restart
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: deployment-restart
subjects:
  - kind: ServiceAccount
    name: deployment-restart
    namespace: default
EOF
```

- Create cronjob specification itself:
```shell
kubectl apply -f << EOF -
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: deployment-restart
  namespace: default
spec:
  concurrencyPolicy: Forbid
  schedule: '*/5 * * * *'
  jobTemplate:
    spec:
      backoffLimit: 2 
      activeDeadlineSeconds: 600
      template:
        spec:
          serviceAccountName: deployment-restart # name of the service account configured above
          restartPolicy: Never
          containers:
            - name: kubectl
              image: bitnami/kubectl
              command:
                - 'kubectl'
                - 'rollout'
                - 'restart'
                - 'deployment/test-cron-depl'
EOF
```


- Here is the full yaml file with comments:
```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: deployment-restart
  namespace: <YOUR NAMESPACE>
spec:
  concurrencyPolicy: Forbid
  schedule: '0 8 * * *' # cron spec of time, here, 8 o'clock
  jobTemplate:
    spec:
      backoffLimit: 2 # this has very low chance of failing, as all this does
                      # is prompt kubernetes to schedule new replica set for
                      # the deployment
      activeDeadlineSeconds: 600 # timeout, makes most sense with 
                                 # "waiting for rollout" variant specified below
      template:
        spec:
          serviceAccountName: deployment-restart # name of the service
                                                 # account configured above
          restartPolicy: Never
          containers:
            - name: kubectl
              image: bitnami/kubectl # probably any kubectl image will do,
                                     # optionaly specify version, but this
                                     # should not be necessary, as long the
                                     # version of kubectl is new enough to
                                     # have `rollout restart`
              command:
                - 'kubectl'
                - 'rollout'
                - 'restart'
                - 'deployment/<YOUR DEPLOYMENT NAME>'
```

