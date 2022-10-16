# [Using Helm](https://helm.sh/docs/intro/using_helm/)


## Three Big Concepts

- **Chart** is a Helm package. It contains all of the resource definitions necessary to run an application, tool, or service inside of a Kubernetes cluster. 
  Think of it like the Kubernetes equivalent of a Homebrew formula, an Apt dpkg, or a Yum RPM file.

- **Repository** is the place where charts can be collected and shared. 
  It's like Perl's CPAN archive or the Fedora Package Database, but for Kubernetes packages.

- **Release** is an instance of a chart running in a Kubernetes cluster. 
  One chart can often be installed many times into the same cluster. 
  And each time it is installed, a new release is created


With these concepts in mind, we can now explain Helm like this:

> Helm installs charts into Kubernetes, creating a new release for each installation. 
> And to find new charts, you can search Helm chart repositories.


### 'helm search': Finding Charts

```shell
# searches the Artifact Hub, which lists helm charts from dozens of different repositories.
helm search hub
helm search hub wordpress

# searches the repositories that you have added to your local helm client (with helm repo add). 
# This search is done over local data, and no public network connection is needed.
helm search repo

helm repo add brigade https://brigadecore.github.io/charts
helm search repo brigade

```


### 'helm install': Installing a Package
```shell
helm install happy-panda bitnami/wordpress

# Helm generates a name for you
helm install happy-panda bitnami/wordpress --generate-name 

```
Helm installs resources in the following order:
- Namespace
- NetworkPolicy
- ResourceQuota
- LimitRange
- PodSecurityPolicy
- PodDisruptionBudget
- ServiceAccount
- Secret
- SecretList
- ConfigMap
- StorageClass
- PersistentVolume
- PersistentVolumeClaim
- CustomResourceDefinition
- ClusterRole
- ClusterRoleList
- ClusterRoleBinding
- ClusterRoleBindingList
- Role
- RoleList
- RoleBinding
- RoleBindingList
- Service
- DaemonSet
- Pod
- ReplicationController
- ReplicaSet
- Deployment
- HorizontalPodAutoscaler
- StatefulSet
- Job
- CronJob
- Ingress
- APIService

> Helm does not wait until all of the resources are running before it exits.

```shell
# To keep track of a release's state, or to re-read configuration information, 
# you can use helm status:

helm status happy-panda
```

#### Customizing the Chart Before Installing

```shell
# see what options are configurable on a chart: 
helm show values 
helm show values bitnami/mysql
helm show values bitnami/wordpress

# You can then override any of these settings in a YAML formatted file, 
# and then pass that file during installation.

echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
helm install -f values.yaml bitnami/wordpress --generate-name
```
The above will create a default MariaDB user with the name user0, and grant this user access to a newly created user0db database, but will accept all the rest of the defaults for that chart.

There are two ways to pass configuration data during install:


- **--values** (or -f): Specify a YAML file with overrides. 
  This can be specified multiple times and the rightmost file will take precedence.
- **--set** (or -f): Specify overrides on the command line.

If both are used, --set values are merged into --values with higher precedence. 


### 'helm uninstall': Uninstalling a Release
```shell
helm uninstall happy-panda

# keep a deletion release record:
helm uninstall --keep-history
helm list --uninstalled # show releases that were uninstalled with the --keep-history flag.

# show all release records that Helm has retained, 
# including records for failed or deleted items
helm list --all
```


### Creating Your Own Charts [Chart Development Guide](https://helm.sh/docs/topics/charts/)

```shell
# get started quickly by using the helm create command:
helm create deis-workflow
# Now there is a chart in ./deis-workflow. You can edit it and create your own templates.

# As you edit your chart, you can validate that it is well-formed by running:
helm lint


# When it's time to package the chart up for distribution, you can run:
helm package deis-workflow

# And that chart can now easily be installed
helm install deis-workflow ./deis-workflow-0.1.0.tgz

```

#### Chart directory description:
- chart.yaml: This is where you'll put the information related to your chart. 
  That includes the chart version, name, and description so you can find it if you publish it on an open repository. 
  Also in this file you'll be able to set external dependencies using the dependencies key.
- values.yaml: Like we saw before, this is the file that contains defaults for variables.
- templates (dir): This is the place where you'll put all your manifest files. Everything in here will be passed on and created in Kubernetes.
- charts: If your chart depends on another chart you own, or if you don't want to rely on Helm's 
  default library (the default registry where Helm pull charts from), you can bring this same structure inside this directory. 
    Chart dependencies are installed from the bottom to the top, which means if chart A depends on chart B, and B depends on C, the installation order will be C ->B ->A.
