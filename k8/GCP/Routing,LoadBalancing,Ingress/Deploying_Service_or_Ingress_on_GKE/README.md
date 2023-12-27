# [Deploying Service or Ingress on GKE](https://medium.com/google-cloud/deploying-service-or-ingress-on-gke-59a49b134e3b)

## Building the GKE Cluster

```sh
gcloud container clusters create \
  --num-nodes 1 \
  --region us-east4 \
  "a-simple-cluster"
```

You can see the cluster and nodes you created with the following commands:

```sh
gcloud container clusters list --filter "a-simple-cluster"
gcloud compute instances list --filter "a-simple-cluster"
```

## Endpoint with Service Resource

A service resources acts as a proxy to route traffic designated pods deployed across worker nodes within a Kubernetes cluster. 
For creating an Endpoint, we’ll use a particular service type of LoadBalancer

1. Deploy Deployment Controller

```sh
kubectl apply --filename hello_gke_extlb_deploy.yaml
```

2. Deploy Service Load Balancer Type
```sh
kubectl apply --filename hello_gke_extlb_svc.yaml
```

3. Test the Connection
```sh
kubectl get services --field-selector metadata.name=hello-gke-extlb
```
Initially, you may see pending under the EXTERNAL-IP column. This means Google Cloud is provisioning the network load balancer.

We can also peak at the corresponding network load balancer outside the cluster:

```sh
gcloud compute forwarding-rules list \
  --filter description~hello-gke-extlb \
  --format \
  "table[box](name,IPAddress,target.segment(-2):label=TARGET_TYPE)"
```
4. Cleanup

```sh
cat hello_gke_extlb_*.yaml | kubectl delete --filename -
```

## Endpoint with Ingress Resource

An ingress is essentially a reverse proxy with a common declarative language (ingress resource) 
to configure rules to route web traffic back to service. 
The implementation depends on the ingress controller you wish to install, such as ingress-nginx, 
haproxy-ingress, traefik, or ambassador, to name a few.

1. Deploy Deployment Controller
```sh
kubectl apply --filename hello_gke_ing_deploy.yaml
```
2. Deploy Service NodePort Type

The default GKE ingress (gce) will only work with a Service type of either NodePort or LoadBalancer. 
As we only want one Endpoint through the ingress, we’ll choose NodePort

```sh
kubectl apply --filename hello_gke_ing_svc.yaml
```

3. Deploy Ingress

An ingress can route web traffic based on the hostname and URL path. 
In our simple implementation, we’ll route everything (/*) to our single designated service. 
The service will then further route traffic to one of three available pods.

```sh
kubectl apply --filename hello_gke_ing_ing.yaml
```

4. Test the Connection
```sh
kubectl get ingress
```

We can also peak at corresponding http proxy that Google Cloud provisions:
```shell
gcloud compute forwarding-rules list \
  --format \
  "table[box](name,IPAddress,target.segment(-2):label=TARGET_TYPE)"
```

5. Cleanup
```shell
cat hello_gke_ing_*.yaml | kubectl delete --filename -
gcloud container clusters delete a-simple-cluster --region us-east4
```
