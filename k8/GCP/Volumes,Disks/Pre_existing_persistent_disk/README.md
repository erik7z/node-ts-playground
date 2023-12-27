# [Using pre-existing persistent disks as PersistentVolumes](https://cloud.google.com/kubernetes-engine/docs/how-to/persistent-volumes/preexisting-pd#create_pv_pvc)

## Using a PersistentVolumeClaim bound to the PersistentVolume

### Create the PersistentVolume and PersistentVolumeClaim

To bind a PersistentVolume to a PersistentVolumeClaim, the storageClassName of the two resources must match, 
as well as capacity, accessModes, and volumeMode.

You can omit the storageClassName, but you must specify "" to prevent Kubernetes from using the default StorageClass


The *storageClassName* does not need to refer to an existing StorageClass object. 
If all you need is to bind the claim to a volume, you can use any name you want. 
However, if you need extra functionality configured by a StorageClass, like volume resizing, 
then storageClassName must refer to an existing StorageClass object.

Read more on [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

- Create the PersistentVolume:
```shell
kubectl apply -f << EOF -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: sc-volume
spec:
  storageClassName: "premium-rwo"
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteOnce
  claimRef:
    namespace: default
    name: sc-volume-claim
  csi:
    driver: pd.csi.storage.gke.io
    volumeHandle: projects/seacontact/zones/us-east4-a/disks/sc-disk
    fsType: ext4
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  namespace: default
  name: sc-volume-claim
spec:
  storageClassName: "premium-rwo"
  volumeName: sc-volume
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
EOF
```
Use following values:
- PV_NAME: the name of your new PersistentVolume.
- STORAGE_CLASS_NAME: the name of your new StorageClass.
- DISK_SIZE: the size of your pre-existing persistent disk. For example, 500G.
- PV_CLAIM_NAME: the name of your new PersistentVolumeClaim.
- DISK_ID: the identifier of your pre-existing persistent disk. 
  - The format is projects/{project_id}/zones/{zone_name}/disks/{disk_name} for Zonal persistent disks, 
  - or projects/{project_id}/regions/{region_name}/disks/{disk_name} for Regional persistent disks.
- FS_TYPE: the filesystem type. You can leave this as the default (ext4), or use xfs. 
  - If your clusters use a Windows Server node pool, you must change this to NTFS.
