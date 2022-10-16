# [GCP - Deploy your app with Helm](https://www.padok.fr/en/blog/kubernetes-google-cloud-platform-app-helm)


## Create an app

We need an app to deploy on our cluster. We will create a simple NodeJS app in this section

```shell
mkdir my_app && cd my_app

# create app index.js: 
echo 'const express = require("express");
const app = express();

var port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

app.get("/", function(req, res) {
  res.send("Hello World 🌎");
});

app.listen(3000, function() {
  console.log(`🚀 Example NodeJS app listening on port ${port}`);
});' > ./index.js


# create package.json file:
echo '{
  "name": "my_app",
  "version": "1.0.0",
  "description": "Example NodeJS app",
  "main": "server.js",
  "scripts": {
    "start": "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start:prod; else npm run start:dev; fi",
    "start:dev": "nodemon server.js",
    "start:prod": "node server.js"


  },
  "author": "erik7z",
  "license": "MIT",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^1.19.3"
  }
}' > ./package.json


# Finally, we can install the dependencies and run our app locally with:
npm install
npm start
```


## Dockerize your app

Kubernetes is a container orchestration platform. 
This means that to deploy our app on the cluster, we must first package it as a container. 

To dockerize our app, create the following files:

```shell
# Dockerfile
echo '# Use a node 10 base image
FROM node:10-alpine

# Create the app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Start the app
COPY . .
ENTRYPOINT ["npm", "start"]' > Dockerfile

# .dockerignore
echo 'node_modules' > .dockerignore

# docker-compose.yml
echo 'version: "3"
services:
  my_app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./server.js:/usr/src/app/server.js
    environment:
      NODE_ENV: development
      PORT: 3000' > docker-compose.yml


# To build the image described in the Dockerfile file and run
docker-compose up
```


## Create a Helm Chart

Helm is a Kubernetes resources package manager, and a package is called a chart. 
Helm allows us to template our [Kubernetes resources](https://www.padok.fr/en/blog/kubernetes-overview) manifest files.

We will create the following files in a kubernetes directory:
- **Chart.yaml** file contains the chart’s metadata, it is the equivalent of the package.json of a NodeJS package.
- **values.yaml** file contains the values of the different variables used in our Kubernetes resources manifests templates.
- **templates** file contains the templates of our Kubernetes resources manifest files.


```shell
mkdir helm && cd helm

echo '---
apiVersion: v1
appVersion: "1.0.0"
description: A Helm chart for my_app
name: my-app
version: 1.0.0' > Chart.yaml


# Create the values.yaml file, where project_name is your GCP project id:
echo '---
replicaCount: 1

image:
  repository: gcr.io/seacontact/my-app
  tag: latest
  pullPolicy: Always

service:
  type: NodePort
  port: 80

app_port: 3000
environment: production' > values.yaml


# In the templates directory, create the deployment.yaml template file which describes how our container is to be run in a pod:
mkdir templates

echo '---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Chart.Name }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ .Chart.Name }}
      app.kubernetes.io/instance: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app.kubernetes.io/name: {{ .Chart.Name }}
        app.kubernetes.io/instance: {{ .Release.Name }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          envFrom:
            - configMapRef:
                name: {{ .Chart.Name }}
          ports:
            - name: http
              containerPort: {{ .Values.app_port }}
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /
              port: http
          readinessProbe:
            httpGet:
              path: /
              port: http' > ./templates/deployment.yaml

# In the templates directory, create the configMap.yaml template file in which we set the environment variables for our app:
echo '---
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Chart.Name }}
data:
  NODE_ENV: {{ .Values.environment }}
  PORT: "{{ .Values.app_port }}"' > ./templates/configMap.yaml
  
  
# In the templates directory, create the service.yaml template file which describes the service that is used to expose our app:

echo '---
apiVersion: v1
kind: Service
metadata:
  name: {{ .Chart.Name }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app.kubernetes.io/name: {{ .Chart.Name }}
    app.kubernetes.io/instance: {{ .Release.Name }}' > ./templates/service.yaml
    
    
# In the templates directory, create the ingress.yaml template file that exposes our service to the Internet:
echo '---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: {{ .Chart.Name }}
spec:
  backend:
      serviceName: {{ .Chart.Name  }}
      servicePort: http' > ./templates/ingress.yaml

```

> Don’t worry, you won’t have to create all those files manually every time you want to create a Helm chart, 
the helm `create <my_chart_name>` command automatically creates a sample chart where you just have to remove or edit the files you don’t need.


## Deploy the Helm chart

To create and update resources on the cluster, Helm needs a special system pod named Tiller. 
```shell
# To install and configure Tiller on the cluster, create the following tiller.yaml file:
echo '---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: tiller-clusterrolebinding
roleRef:
  apiGroup: "rbac.authorization.k8s.io"
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system' > tiller.yaml
    
# and apply them:
kubectl apply -f tiller.yaml


# authenticate to gcloud:
gcloud auth login
gcloud config set project seacontact

# enable gcloud container services 
gcloud services enable container.googleapis.com

# configure docker to access gcloud
gcloud auth configure-docker

# Now before we can deploy our chart, we need to build the docker image of our app and push it to an online container our Kubernetes cluster can pull it from. 
docker build -t gcr.io/seacontact/my-app .
docker push gcr.io/seacontact/my-app

# run helm deployment:
helm install my-helm-app ./helm -f ./helm/values.yaml
#helm install ./helm --generate-name -f ./helm/values.yaml # or generate some name

# to delete resources:
helm list
helm uninstall chart-1665902242 # get chart name from helm list
```
