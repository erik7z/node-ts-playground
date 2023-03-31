# [Helm Quickstart](https://helm.sh/)

## Prerequisites
The following prerequisites are required for a successful and properly secured use of Helm.
- A Kubernetes cluster
- Deciding what security configurations to apply to your installation, if any
- Installing and configuring Helm.


#### Kubernetes cluster
You must have Kubernetes installed.
For the latest release of Helm, we recommend the latest stable release of Kubernetes, which in most cases is the second-latest minor release.

```shell
gcloud auth login
gcloud config set project seacontact
gcloud config set compute/zone europe-west4-a
gcloud container clusters create ez --zone europe-west4-a --num-nodes 1
gcloud container clusters get-credentials ez --zone europe-west4-a 
```

#### Installing and configuring Helm.
```shell
# INSTALL:
# osx
brew install helm

# Debian/Ubuntu
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

Once you have Helm ready, you can add a chart repository. Check [Artifact Hub](https://artifacthub.io/packages/search?kind=0) for available Helm chart repositories.
```shell
helm repo add bitnami https://charts.bitnami.com/bitnami

# list the charts you can install:
helm search repo bitnami

# Make sure we get the latest list of charts
helm repo update

# To install a chart, you can run the helm install command
helm install bitnami/mysql --generate-name


# look features of some chart 
helm show chart bitnami/mysql

# Reading the Help Text
helm get -h

```

### [Configure helm charts](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing)

### Releases
Whenever you install a chart, a new release is created. 
So one chart can be installed multiple times into the same cluster. 
And each can be independently managed and upgraded.

```shell
# list of all deployed releases:
helm list

# uninstall a release:
helm uninstall mysql-1612624192
helm uninstall mysql-1612624192 --keep-history # release history will be kept. 
```

Because Helm tracks your releases even after you've uninstalled them, you can audit a cluster's history, 
and even undelete a release (with `helm rollback`).
