#[Migrate your workloads to other machine types](https://cloud.google.com/kubernetes-engine/docs/tutorials/migrating-node-pool)

# Login to your cluster and check your workloads:
```shell
gcloud auth login
gcloud projects list
gcloud config set project seacontact

gcloud config get compute/zone
gcloud config set compute/zone europe-west4-a

gcloud container clusters list 
#NAME  LOCATION        MASTER_VERSION   MASTER_IP      MACHINE_TYPE  NODE_VERSION     NUM_NODES  STATUS
#ez    europe-west4-a  1.23.13-gke.900  34.141.239.64  e2-medium     1.23.13-gke.900  1          RUNNING

## get credentials for kubectl
gcloud container clusters get-credentials ez --zone=europe-west4-a

# setting kubectl config
kubectl config get-contexts
kubectl config use-context gke_seacontact_europe-west4-a_ez

```

### Creating a node pool with large machine type
```shell

gcloud container node-pools list --cluster ez # By default, GKE creates a node pool named default-pool for every new cluster:
#NAME          MACHINE_TYPE  DISK_SIZE_GB  NODE_VERSION
#default-pool  e2-medium     100           1.23.13-gke.900

## To introduce instances with a different configuration, 
## such as a different machine type or different authentication scopes, 
## you need to create a new node pool.

gcloud container node-pools create sc-larger-pool --cluster=ez --machine-type=e2-standard-2 --num-nodes=1
# sc-larger-pool  e2-standard-2  100           1.23.13-gke.900

## Your container cluster should now have two node pools:
gcloud container node-pools list --cluster ez
#NAME            MACHINE_TYPE   DISK_SIZE_GB  NODE_VERSION
#default-pool    e2-medium      100           1.23.13-gke.900
#sc-larger-pool  e2-standard-2  100           1.23.13-gke.900


## You can see the instances of the new node pool added to your GKE cluster:
kubectl get nodes

```

### Migrating the workloads
After you create a new node pool, your workloads are still running on the default-pool.
Kubernetes does not reschedule Pods as long as they are running and available.

```shell
## Run the following command to see which node the Pods are running on

kubectl get pods -o=wide
#as-api-79cbc6bcf9-kqbjg      1/1     Running   0          6d13h   10.100.0.4    gke-ez-default-pool-e1022ae3-6t8l   <none>           1/1
#as-client-5c657ccfd6-bcszd   1/1     Running   0          6d13h   10.100.0.5    gke-ez-default-pool-e1022ae3-6t8l   <none>           1/1
#as-neo4j-646b5f7cf-cpqd4     1/1     Running   0          6d13h   10.100.0.14   gke-ez-default-pool-e1022ae3-6t8l   <none>           <none>
#sc-api-58dc447cb9-lr2t4      3/3     Running   0          6d13h   10.100.0.6    gke-ez-default-pool-e1022ae3-6t8l   <none>           1/1
#sc-db-746f9bf45-4jt6j        1/1     Running   0          6d13h   10.100.0.15   gke-ez-default-pool-e1022ae3-6t8l   <none>           <none>
```
To migrate these Pods to the new node pool, you must do the following:

1. Cordon the existing node pool: This operation marks the nodes in the existing node pool (default-pool) as unschedulable. 
Kubernetes stops scheduling new Pods to these nodes once you mark them as unschedulable.

2. Drain the existing node pool: This operation evicts the workloads running on the nodes of the existing node pool (default-pool) gracefully.

The preceding steps cause Pods running in your existing node pool to gracefully terminate, and Kubernetes reschedules them onto other available nodes. 
In this case, the only available nodes are in larger-pool node pool.


```sh
## get a list of nodes in default-pool:
kubectl get nodes -l cloud.google.com/gke-nodepool=default-pool
#NAME                                STATUS   ROLES    AGE     VERSION
#gke-ez-default-pool-e1022ae3-6t8l   Ready    <none>   6d15h   v1.23.13-gke.900

## run the `kubectl cordon <NODE>` for each node in node-pool

for node in $(kubectl get nodes -l cloud.google.com/gke-nodepool=default-pool -o=name); 
do
  kubectl cordon "$node";
done
#node/gke-ez-default-pool-e1022ae3-6t8l cordoned


## drain each node by evicting Pods with an allotted graceful termination period of 10 seconds:
for node in $(kubectl get nodes -l cloud.google.com/gke-nodepool=default-pool -o=name); do
  kubectl drain --force --ignore-daemonsets --delete-local-data=true --grace-period=10 "$node";
done

## Once this command completes, you should see that the default-pool nodes have SchedulingDisabled status in the node list:
kubectl get nodes
#gke-ez-default-pool-e1022ae3-6t8l     Ready,SchedulingDisabled   <none>   6d15h   v1.23.13-gke.900
#gke-ez-sc-larger-pool-e2c7fbf7-lh5g   Ready                      <none>   131m    v1.23.13-gke.900


## Additionally, you should see that the Pods are now running on the larger-pool nodes:
kubectl get pods -o=wide
```

### Deleting the old node pool
Once Kubernetes reschedules all Pods in the web Deployment to the larger-pool, 
it is now safe to delete the default-pool as it is no longer necessary. 

Run the following command to delete the default-pool:
```shell
gcloud container node-pools delete default-pool --cluster ez
#Deleting node pool default-pool...done.
#Deleted [https://container.googleapis.com/v1/projects/seacontact/zones/europe-west4-a/clusters/ez/nodePools/default-pool].

## Once this operation completes, you should have a single node pool for your container cluster, which is the larger-pool:
gcloud container node-pools list --cluster ez
# sc-larger-pool  e2-standard-2  100           1.23.13-gke.900

```
