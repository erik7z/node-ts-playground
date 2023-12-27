# [Kubernetes ConfigMaps and Secrets](https://medium.com/google-cloud/kubernetes-configmaps-and-secrets-68d061f7ab5b)
- create playground container
```shell
# create playground cluster
gcloud container clusters create playground --zone europe-west4-a --num-nodes 1
````

- Using manual entries:
```sh
# create entries for config map & secret
kubectl create secret generic apikey --from-literal=API_KEY=123-456
kubectl create configmap language --from-literal=LANGUAGE=English

kubectl get secret
kubectl get configmap

# build up example node-js image which uses env variables and send it to docker hub:
cd ./0-reading-envs && sh ./build.sh && cd ..

# apply deployment to cluster
kubectl apply -f ./0-reading-envs/config+secret_in_keys.yaml


# updating secrets and config maps:
kubectl create configmap language --from-literal=LANGUAGE=Spanish -o yaml --dry-run | kubectl replace -f -
kubectl create secret generic apikey --from-literal=API_KEY=098765 -o yaml --dry-run | kubectl replace -f -

# delete pod (deployment will recreate it with new values)
kubectl delete pod envtest-75f8b789d9-fpsll
```


- Using Configuration Files
```shell
# create a two subdirectories called “config” and “secret”
mkdir config && mkdir secret
echo '{"LANGUAGE":"English"}' > ./config/config.json
echo '{"API_KEY":"123-456-789"}' > ./secret/secret.json

kubectl create secret generic my-secret  --from-file=./secret/secret.json
kubectl create configmap my-config --from-file=./config/config.json

# build new docker image and apply deployment
cd ./1-reading-files && sh ./build.sh && cd ..
kubectl apply -f ./1-reading-files/config+secret_in_file.yaml
```

- Clean up
```shell
gcloud container clusters delete playground --zone europe-west4-a

```
