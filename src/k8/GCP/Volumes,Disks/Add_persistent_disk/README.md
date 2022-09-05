# [Add a persistent disk to your VM](https://cloud.google.com/compute/docs/disks/add-persistent-disk)

You can use a persistent disk as a boot disk for a virtual machine (VM) instance, 
or as a data disk that you attach to a VM.

## Creating and attaching disk:

Use the gcloud compute disks create command to create the zonal persistent disk.
```shell
gcloud compute disks create sc-disk --size 100gb --type pd-ssd
# DISK_NAME: the name of the new disk.
# DISK_SIZE: the size, in gigabytes, of the new disk. Acceptable sizes range, in 1 GB increments, from 10 GB to 65,536 GB inclusive.
# DISK_TYPE: pd-standard, pd-balanced, pd-ssd, pd-extreme (https://cloud.google.com/compute/docs/disks#disk-types)

# list disks:
gcloud compute disks list
```

After you create the disk, attach it to any running or stopped instance
```shell
# instance & disk should be in same zone (?)
gcloud compute instances attach-disk sc-util --disk sc-disk

# see that disk is attached:
gcloud compute disks describe sc-util
```
After you create and attach the new disk to a VM, you must format and mount the disk, so that the operating system can use the available storage space.


## Formatting and mounting a non-boot disk on a Linux VM

```shell
# Connect to the VM
gcloud compute ssh sc-util

# use the lsblk command to list the disks that are attached to your instance
sudo lsblk
```
Format the disk using the [mkfs](http://manpages.ubuntu.com/manpages/xenial/man8/mkfs.8.html) tool. 
This command deletes all data from the specified disk, so make sure that you specify the disk device correctly.

You can use any file format that you need, but we recommend a single *ext4* file system without a partition table. 
You can increase the size of your disk later without having to modify disk partitions.

To maximize disk performance, use the [recommended formatting options](https://cloud.google.com/compute/docs/disks/optimizing-pd-performance#formatting_parameters) 
in the -E flag. It is not necessary to reserve space for the root volume on this secondary disk, 
so specify -m 0 to use all of the available disk space.

```shell
# formatting entire disk to ext4 with no partition table:
 sudo mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/sdb
```

### Mounting the disk
```shell
# 1. Create a directory that serves as the mount point for the new disk on the VM. You can use any directory.
sudo mkdir -p /mnt/disks/sc_disk

# 2. Use the [mount tool](http://manpages.ubuntu.com/manpages/xenial/man8/mount.8.html) to mount the disk to the instance, and enable the discard option:
sudo mount -o discard,defaults /dev/sdb /mnt/disks/sc_disk

# 3. Configure read and write permissions on the disk. For this example, grant write access to the disk for all users.
sudo chmod a+w /mnt/disks/sc_disk
```

### Unmounting disk
```shell
#  Check the drive is unmounted using lsblk
# if there is no mount point listed then the device is unmounted.
lsblk

# unmount using directory
sudo umount /mnt/disks/sc_disk

# unmount using drive
sudo umount /dev/sdb
```

### Configuring automatic mounting on VM restart
Add the disk to your /etc/fstab file, so that the disk automatically mounts again when the VM restarts.

On Linux operating systems, the device name can change with each reboot, 
but the device UUID always points to the same volume, even when you move disks between systems. 

Because of this, we recommend using the device UUID instead of the device name to configure automatic mounting on VM restart.

> Note: On Container-Optimized OS, modifications to /etc/fstab do not persist across system reboots. 
> To ensure the device is checked and mounted during boot, run the fsck and mount operations on the disk from your cloud-config's bootcmd section.
> check [Mounting and formatting disks](https://cloud.google.com/container-optimized-os/docs/concepts/disks-and-filesystem#mounting_and_formatting_disks)

```shell
# 1. Create a backup of your current /etc/fstab file.
sudo cp /etc/fstab /etc/fstab.backup

# 2. Use the blkid command to list the UUID for the disk.
sudo blkid /dev/sdb
# > /dev/sdb: UUID="b8d24e1d-5546-460f-b161-799794673860" BLOCK_SIZE="4096" TYPE="ext4"

# 3. Open the /etc/fstab file in a text editor and create an entry that includes the UUID. For example:
# UUID=b8d24e1d-5546-460f-b161-799794673860 /mnt/disks/sc_disk ext4 discard,defaults,nofail 0 2

#4 Use the cat command to verify that your /etc/fstab entries are correct:
cat /etc/fstab
```
- MOUNT_OPTION - specifies what the operating system does if it cannot mount the zonal persistent disk at boot time.
  For valid values, see [The fourth field in the Linux fstab documentation](https://man7.org/linux/man-pages/man5/fstab.5.html)
  To let the system boot even if the disk is unavailable, use the nofail mount option.

> If you detach this disk or create a snapshot from the boot disk for this VM, edit the /etc/fstab file and remove the entry for this disk. 
> Even with MOUNT_OPTION set to nofail or nobootwait, keep the /etc/fstab file in sync with the devices that are attached to your VM 
> and remove these entries before you create your boot disk snapshot or detach the disk.


### [Detach disk](https://cloud.google.com/sdk/gcloud/reference/compute/instances/detach-disk)

```shell
# Detaching a disk without first unmounting it may result in incomplete I/O operations and data corruption. 
# To unmount a persistent disk on a Linux-based image, ssh into the instance and run:
sudo umount /mnt/disks/sc_disk

# detaching disk:
gcloud compute instances detach-disk sc-util --disk sc-disk
```



## [Creating Regional persistent disks](https://cloud.google.com/kubernetes-engine/docs/how-to/persistent-volumes/regional-pd#regional_persistent_disks)

```shell
gcloud compute disks create sc-disk-neo4j \
   --size 50Gi \
   --type pd-ssd \
   --region us-east4 \
   --replica-zones us-east4-a,us-east4-b
```

Attach disk to instance & format. Disk and instance regions/zones should be mentioned.
```shell
# specify zone for instance and --disk-scope=regional for disk
#gcloud compute instances attach-disk sc-util --disk sc-disk-neo4j --zone us-east4-b --disk-scope=regional
gcloud compute instances attach-disk sc-util --disk sc-disk-neo4j --disk-scope=regional

#gcloud compute instances detach-disk sc-util --disk sc-disk-neo4j --zone us-east4-b --disk-scope=regional
gcloud compute instances detach-disk sc-util --disk sc-disk-neo4j --disk-scope=regional
```

Setup Storage, PersistentVolume & PersistentVolumeClaim
```shell
kubectl apply -f << EOF -
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: regionalpd-storageclass
provisioner: pd.csi.storage.gke.io
parameters:
  type: pd-ssd
  fstype: ext4
  replication-type: regional-pd
reclaimPolicy: Retain
volumeBindingMode: Immediate
allowedTopologies:
- matchLabelExpressions:
  - key: topology.gke.io/zone
    values:
    - us-east4-b
    - us-east4-c
EOF

```
