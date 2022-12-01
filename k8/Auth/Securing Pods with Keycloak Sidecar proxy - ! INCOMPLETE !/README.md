# Securing Pods with Keycloak Sidecar proxy

## Deploy basic application:

```sh
kubectl apply -f << EOF -
# Deployment:
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-gke
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-gke
  template:
    metadata:
      labels:
        app: hello-gke
    spec:
      containers:
        - name: hello-kubernetes
          image: paulbouwer/hello-kubernetes:1.5
          ports:
            - containerPort: 8080

# Service:
---
apiVersion: v1
kind: Service
metadata:
  name: hello-gke
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 8080
  selector:
    app: hello-gke

# Ingress:
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello-gke
  annotations:
    kubernetes.io/ingress.class: gce
spec:
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: hello-gke
                port:
                  number: 80
EOF

```

## Run keycloack locally:

```shell
docker run --rm --name keycloak-server -d -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=password -p 8080:8080 jboss/keycloak
```

### Once the Keycloak server is up and running, let’s create a realm for Jaeger:

1. [Login into Keycloak](http://127.0.0.1:8080/auth/admin/master/console) with "admin" as the username and "password" as
   the password
2. In the top left corner, mouse over the Master realm name and click **Add realm** that appears below to that. Name it
   jaeger and click Create
3. On the left hand side menu, under Configure,open the Clients screen, click Create and set "proxy-jaeger" as the
   client ID and save it
4. Set the Access Type to "confidential" and "*"as Valid Redirect URIs and save it. You might want to fine tune this in
   a production environment, otherwise you might be open to an attack known as “Unvalidated Redirects and Forwards”.
5. Open the Installation tab and select Keycloak OIDC JSON and copy the JSON that is shown.

#### Create a role and a user, so that we can log into Jaeger’s Query service:

1. Under the Configure left hand side menu, open the Roles page and click Add role
2. As role name, set user and click Save
3. Under the Manage left hand side menu, open the Users page and click Add user
4. Fill out the form as you wish and set Email verified to ON and click on Save
5. Open the Credentials tab for this user and set a password (temporary or not)
6. Open the Role mappings tab for this user, select the role user from the Available Roles list and click Add selected

## Update deployment

```shell
# Create Configmap:
kubectl delete -f << EOF -
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: security-proxy-configuration
data:
  proxy.json: |
    {
        "target-url": "http://localhost:16686",
        "bind-address": "0.0.0.0",
        "http-port": "8080",
        "applications": [
            {
                "base-path": "/",
                "adapter-config": {
                 "realm": "jaeger",
                 "auth-server-url": "http://127.0.0.1:8080/auth/",
                 "ssl-required": "external",
                 "resource": "proxy-jaeger",
                 "credentials": {
                   "secret": "lJTjnQZLtEP1xguTDz0vhhpqiU48nZrE"
                 }
               }
          ,
          "constraints": [
                    {
                        "pattern": "/*",
                        "roles-allowed": [
                            "user"
                        ]
                    }
                ]
            }
        ]
    }
EOF


kubectl apply -f << EOF -
# Deployment:
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-gke
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-gke
  template:
    metadata:
      labels:
        app: hello-gke
    spec:
      containers:
        - name: hello-kubernetes
          image: paulbouwer/hello-kubernetes:1.5
          ports:
            - containerPort: 8080
        - name: security-proxy
          image: jboss/keycloak-proxy
          volumeMounts:
          - name: security-proxy-configuration-volume
            mountPath: /opt/jboss/conf
          ports:
          - containerPort: 8080
            protocol: TCP
          readinessProbe:
            httpGet:
              path: "/"
              port: 8080
      volumes:
        - name: security-proxy-configuration-volume
          configMap:
            name: security-proxy-configuration
EOF
```
