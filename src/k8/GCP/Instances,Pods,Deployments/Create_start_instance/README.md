# [Creating and starting a VM instance](https://cloud.google.com/compute/docs/instances/create-start-instance)
How to create a virtual machine (VM) instance by using a boot disk image, a boot disk snapshot, or a container image.


## Create a VM instance from an image

```shell
# View a list of public images available on Compute Engine
gcloud compute images list

gcloud compute images describe ubuntu-2204-jammy-v20220712a --project=ubuntu-os-cloud
```

### Create a VM instance from a public image
VM_NAME - [name](https://cloud.google.com/compute/docs/naming-resources#resource-name-format)
IMAGE_FAMILY - [image famiry](https://cloud.google.com/compute/docs/images/os-details#general-info)
IMAGE_PROJECT - [project](https://cloud.google.com/compute/docs/images/os-details#general-info)
MACHINE_TYPE - [predefined](https://cloud.google.com/compute/docs/machine-types) or [custom](https://cloud.google.com/compute/docs/instances/creating-instance-with-custom-machine-type)

```sh
# get a list of the machine types available in a zone
gcloud compute machine-types list --zone us-east4-a

# create instance:
gcloud compute instances create sc-util --image-family=ubuntu-2204-lts --image-project=ubuntu-os-cloud --machine-type=e2-micro
gcloud compute instances create sc-util --image=ubuntu-2204-jammy-v20220712a --image-project=ubuntu-os-cloud --machine-type=e2-micro

gcloud compute instances list
gcloud compute instances describe sc-util
```

## Create a VM instance from a container image
To deploy and launch a container on a Compute Engine VM, specify a container image name and optional configuration parameters when you create the VM. 
Compute Engine creates the VM by using the latest version of the Container-optimized OS public image, which has Docker installed. 
Then, Compute Engine launches the container when the VM starts.


```shell
gcloud compute instances create-with-container sc-util --container-image=gcr.io/cloud-marketplace/google/nginx1:1.12

# To deploy image from Docker Hub, always specify the full Docker image name:
gcloud compute instances create-with-container sc-util --container-image=docker.io/httpd:2.4
```

## [Connect to VMs](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
```shell

gcloud compute ssh --project=PROJECT_ID --zone=ZONE VM_NAME

# - PROJECT_ID: the ID of the project that contains the instance
# - ZONE: the name of the zone in which the instance is located
# - VM_NAME: the name of the instance

# if defaults set
gcloud compute ssh sc-util
```

## [Start/Stop a VM](https://cloud.google.com/compute/docs/instances/stop-start-instance)
```shell
gcloud compute instances start sc-util

gcloud compute instances stop sc-util

gcloud compute instances delete sc-util

```
