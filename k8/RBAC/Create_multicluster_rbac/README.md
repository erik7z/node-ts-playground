### Define a service account in the service namespace
```shell
kubectl create -f << EOF -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: secure-nginx-ingress-account
  namespace: default
EOF

### create a cluster role
kubectl create -f << EOF -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secure-nginx-ingress-role
rules:
  - apiGroups:
      - ""
      - extensions
      - networking.k8s.io
    resources:
      - ingresses
      - ingressclasses
      - ingresscontrollerconfigs
    verbs:
      - get
      - list
      - watch
#    namespaces:
#      - default
#      - monitoring
  - apiGroups:
      - ""
    resources:
      - services
      - endpoints
      - secrets
    verbs:
      - get
      - list
      - watch
EOF

## inline version:
#kubectl create clusterrolebinding secure-nginx-ingress-rolebinding --clusterrole=secure-nginx-ingress-account --serviceaccount=default:secure-nginx-ingress-account

kubectl create -f << EOF -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: secure-nginx-ingress-rolebinding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: secure-nginx-ingress-account
subjects:
- kind: ServiceAccount
  name: secure-nginx-ingress-account
  namespace: default
- kind: ServiceAccount
  name: secure-nginx-ingress-account
  namespace: monitoring
EOF 

kubectl get clusterrolebinding secure-nginx-ingress-rolebinding -o yaml
kubectl delete clusterrolebinding secure-nginx-ingress-rolebinding

```