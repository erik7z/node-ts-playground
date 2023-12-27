# [Setup Prometheus monitoring on Kubernetes](https://www.youtube.com/watch?v=C38dT0Kt3zs)
[Readme](https://www.coachdevops.com/2022/05/how-to-setup-monitoring-on-kubernetes.html)

## Install and configuring Helm.
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

# VERIFY:
helm version

# CONFIGURE:
helm repo add stable https://charts.helm.sh/stable
helm repo update
helm search repo stable
```

## Setup or create Kubernetes cluster
You must have Kubernetes installed.
For the latest release of Helm, we recommend the latest stable release of Kubernetes, which in most cases is the second-latest minor release.

```shell
gcloud auth login
gcloud config set project seacontact
gcloud config set compute/zone europe-west4-a
gcloud container clusters create ez --zone europe-west4-a --num-nodes 1
gcloud container clusters get-credentials ez --zone europe-west4-a 
```

## Install Prometheus & Grafana
- get the latest version of the chart from the [Prometheus Helm Charts](https://github.com/prometheus-community/helm-charts)
```shell
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# create monitoring namespace
kubectl create namespace monitoring


helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring  --dry-run --debug
#> kube-prometheus-stack has been installed. Check its status by running:
#>  kubectl --namespace monitoring get pods -l "release=prometheus"

```
## [Configuration](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack#configuration)
- [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)
- [prometheus-operator-chart](https://github.com/helm/charts/tree/master/stable/prometheus-operator)

- To see all configurable options with detailed comments:
```shell
# save output to file
helm show values prometheus-community/kube-prometheus-stack > default_values.yaml
```




##  Access Prometheus & Grafana
```shell
# Grafana
kubectl port-forward service/prometheus-grafana 3000:80 -n monitoring
# Login to grafana with username: admin and password from values yaml)

# Prometheus
kubectl port-forward service/prometheus-kube-prometheus-prometheus 9090:9090 -n monitoring
```

## Create Dashboards
- Click '+' button on left panel and select ‘Import’.
> There are various dashboards available on [grafana.com](https://grafana.com/grafana/dashboards/). You can import any of them by entering the dashboard id.
  - Enter 12740 dashboard id for Kubernetes monitoring.
  - Enter 3119 dashboard id for Kubernetes cluster monitoring.
  - Enter 6417 dashboard id for POD Monitoring
  - 
- Click ‘Load’.
- Select ‘Prometheus’ as the endpoint under prometheus data sources drop down.
- Click ‘Import’.
- This will show monitoring dashboard for all cluster nodes



## Uninstall Helm Chart
```shell
helm uninstall prometheus -n monitoring
# CRDs created by this chart are not removed by default and should be manually cleaned up:
kubectl delete crd alertmanagerconfigs.monitoring.coreos.com
kubectl delete crd alertmanagers.monitoring.coreos.com
kubectl delete crd podmonitors.monitoring.coreos.com
kubectl delete crd probes.monitoring.coreos.com
kubectl delete crd prometheuses.monitoring.coreos.com
kubectl delete crd prometheusrules.monitoring.coreos.com
kubectl delete crd servicemonitors.monitoring.coreos.com
kubectl delete crd thanosrulers.monitoring.coreos.com
```