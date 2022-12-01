`chmod +x` [add running option to file]

### 101.1

- `cat /etc/*release`
- `uname -m` get architecture
- `uname -a` // what linux
- `cat /proc/version`
- `lsb_release -a` // check version and release

### 101.3 loading modes / ?centos ?

- `nproc` - number of processors
- `lscpu` - detailed info about cpugma
- `/usr/lib/systemd` - default units
- `/etc/systemd` - controllable units

- `systemctl -list-units` // show all active units
- `systemctl status crond` // status of cron
- `systemctl start crond` // start of cron
- `systemctl stop crond` // stop of cron
- `systemctl reboot | poweroff` // restart / off system
- `journalctl -f` // showing logs of journal demon

### 101.3 Upstart initialization ? centos ?

- `/etc/init` - initialization tasks

> #### UBUNTU:

- `status ufw` / check status of ufw service
- `start ufw`
- `stop ufw`
- `initctl show-config` //
- `/etc/init.d/` - folder with all daemon services

### 102.1 Folders

- `/bin` [all commands binaries]
- `/boot` [loader files]
- `/dev` [devices]
- `/etc` [configuration of system & components]
- `/home` [users home folder]
- `/lib` [core libraries]
- `/opt` [folder for optional software]
- `/proc` [system processes]
- `/root` [main user home folder]
- `/sbin` [main programs and system settings]
- `/srv` [data for system services]
- `/tmp` [temporary files]
- `/usr` [user binary files, core code/software code/documentation]
- `/var` [variables]

### 102.3 DPKG - package manager in linux debian (low level)

- `dpkg -l` // list all packages
- `dpkg -L` // list files of packages
- `dpkg -s` <package> // status of package
- `dpkg -i` // install
- `dpkg -I` // info
- `dpkg -r` // delete
- `dpkg -P` // delete with config
- `dpkg-reconfigure` // reconfigure
-

> #### APT - better package manager for debian

- `apt-get install`
- `apt-cache <package>` // search
- `apt-cache depends gmail-notify` // search who is dependent on gmail notify
- `aptitude` // extended package manager for debian
- `/etc/apt/sources.list` - list of repo where to search for packages

### 102.3 Package manager for Red Hat (Centos) - rpm / yum

- `rpm` // low level packager
- `rpm2cpio` // convert package to binary
- `yum` // extended packager
- `yumdownloader` // download packages
- `/etc/yum.repos.d.` // - list of packages

### 103.1 Shells / popular commands

- `/bin/sh` // Bourne shell
- `/bin/bash` // Bourne again shell
- `/bin/ksh` // Korn shell
- `/bin/csh` // C shell
- `/bin/tcsh` // Tom's C shell
- `history` - [history of bash]

> #### Popular commands for text output editing

- `sort` // sort lines of text files
- `head` // output first part of file
- `tail` // output last part of file
  - `tail -f` // continuous output from log
- `more` // show file by parts (go only down)
  `less` // show file by parts (for large files, can go up and down, use - search )
- `join` // join lines of two files on a common field \*
- `paste` // merge lines of files (line with line, separate by tabs)
- `split` // split file by different options
- `cut` // cut symbols from input
- `expand` // convert tabs to spaces
- `fmt` // simple optimal text formatter
- `nl` // number of lines
- `sed` // stream editor, filtering, transforming text on the go
  `sed -e 's/socks/people' 2.txt` // change word socks for 'people' in 2.txt file
- `wc` // words count (lines count etc)
- `tr` // translate or transform/delete text
  - `echo Hello | tr -t A-Z a-z` // transform to lowcase // hello
  - `echo Hello | tr -t l L` // transform l to L // HeLLo
- `uniq` // shows uniq or repeated lines
- `export $(cat ./deploy/env.development.yaml | sed 's/: /=/' | sed 's/#.*//' | xargs) && NODE_ENV=dev node index.js` // convert yaml vars to env vars

> #### Other popular commands:

- `file` // shows type of file
- `find` // search for files in a directory hierachy
- `find . -name "somename"` // find in current dir file "somename"
  - `find . -size +5M` // anything > 5 megabytes
- `locate` // fast search of files
- `type` // show exact command (with aliases)
- `which` // search location of command
- `whereis` // search command / manual etc.
- `cpio` // copy files in and out from archives (without compression)
- `ls | cpio -o > ../test.cpio` // take all files from curent dir and put in test.cpio file
- `wc -c < file.mp4` // get content-length (file size)
- `file -b --mime-type 1234.mp4` // get content-type of file

> ### zip / p / archive

- `gzip` // compress or expand files
- `tar` // tar archiving utility (mainly used)
  - `tar cvf` archive.tar folder // create verbose file archive.tar from - directory folder (without compression)
  - `tar cvfz` archive.tar.gz folder // create verbose file archive.tar from directory folder (with compression)
  - `tar xvf` // extract verbose
  - `tar -xzvf myfile.tar.gz`
  - `tar -xvf myfile.tar -C somedirectory`


> ### curl
```sh
## Debian/Ubuntu Linux use the apt command/apt-get command ##
sudo apt install curl

curl --version

# Downloading file with curl
curl url --output filename
curl https://url -o output.file.name


# Follow a 301-redirected file while downloading file with curl
curl -L -o file.tgz http://www.cyberciti.biz/long.file.name.tgz

# Downloading multiple files or URLs
curl -O url1 -O url2
curl -O https://www.cyberciti.biz/files/adduser.txt \
     -O https://www.cyberciti.biz/files/test-lwp.pl.txt

# Another option is to create a file named urls.txt as follows and then run the xargs command:
xargs -n 1 curl -O < "urls.txt"

# Grab a password protected file with curl
curl https://username:passwd@server1.cyberciti.biz/file/path/data.tar.gz

```



### 103.4 Stdin/Stdout/Stderr

- `>` // send to file
- `>>` // add to file
- `<` // take from file
- `|` // send to next command
- `tee` // send to file & std out
- `xargs` // sendt to command line by line - `find . -name "*.txt" | xargs rm -f` // find all txt files and force delete each

### 103.5 Process management

- `ps` // active processes snapshot - `ps aux` // show all process for all users
- ps -e|grep node - see all node processes
- sudo ss -lptn 'sport = :5432' - see processes for some port
- sudo lsof -iTCP -sTCP:LISTEN -n -P (mac os)
- kill -9 $(lsof -t -i :3000)
- kill -9 XXXX
- `pstree` // process tree
- `pgrep` // process search
- `pkill` // kill process - `killall <process name>` //
- `top` // task manager
- `free` // memory load
- `uptime`
- `nohup` // keep process runni g after logout
- `screen` // sessions control (can run multiple screens in same session)
- - `ctrl+a +d` // hide current screensudo
- - `screen -r` // restore screen
- - `exit` // exit from screen
- - `screen -S yandex ping ya.ru` // start screen with name yandex to ping ya.ru
- - `screen -ls` // list screens
- - `screen -r yandex` // enter yandex screen

### 103.6 Process priority

- `nice` // -20 + 20
- `renice`

### 103.7 Regular expr

- `grep` // print lines matching pattern - `grep -n blabla file.txt` // search for blabla and show number lines
- `egrep` // extended grep - `egrep '^(b|d)' file.txt'` // any line starting from b or d
- `fgrep` // fast grep, no regexp input, searching as it is
- `rgrep` // recursive grep, searching in subfolders
- `sed` // flow text editor - `sed -e 's/oo/aa/' file.txt` // substitute oo for aa in the flow

### 103.8 VI / VIM text editor

- `h j k l` // left down up right
- `e b` // begin end of word
- `( )` // begin end of sentence
- `{ }` // begin end of paragraph
- `^ $` // begin end of line
- `1G G` // begin end of file

- `yy` // copy line
- `yw` // copy word
- `yl` // copy symbol
- `dd` // cut line
- `dw` // cut word
- `dl` // cut symbol
- `p` // paste

- `/` // search down
- `?` // search up
- `n` // search next

- `:e` // cancel changes
- `:w` // save changes
- `:q` // exit from file

- `:q!` / `ZQ` // exit without save
- `:wq!` / `ZZ` // exit & save
- `:%s/foo/bar/g` // find all foo and replace with bar

#### Basic vim settings:

```sh
# write in ~/.vimrc or ~/.vim/vimrc file to save permanently

:set tabstop=2
:set shiftwidth=2
:set expandtab
:set number


```

### 104.5 Access rights / users / groups

- `chown` // set owner - `sudo chown <username> file.txt` // change owner of file (sudo required) - `sudo chown <username>:<group> file.txt` change owner & group
- `chgrp` // set group
- `chmod` // set access rights
- `id <username>` // check user infor (id, groups,etc)

```
0 ---   // no rights
1 --x   // execute
2 -w-   // write
3 -wx   // write execute
4 r--   // read
5 r-x   // read execute
6 rw-   // read write
7 rwx   // all
```

- `chmod 750 script` // full to owner, read+ex to group, nil to others
- `chmod u+w script` // write to owner
- `chmod ugo-x script` // remove execute from everybody

> #### masks and bits

- `umask` // creation mask for files - `umask 022` // all folders will be created with 777 - 022 = 755 rights - `umask 754` // all folders will be created with 777 - 022 = 023 rights

  > - default `umask` can be set in `/etc/login.defs` file

- `suid` // owner exec bit [4]
- - `chmod u+s script` // suid bit (run from owner name)
- `sgid` // group exec bit [2]
- - `chmod g+s script` // sgid bit (run from group)
- `sticky` // protection bit [1]
- - `chmod o+t script` // sticky bit (only owner can change even if full rights)

```
4755 // suid bit
6755 // suid & sgid bit
3755 // stick & sgid bit
```

### 105.1 settings:

- `/etc/profile` [main settings for all profiles]
- `/etc/profile.d/`
- `/etc/bashrc`
- `/etc/bash.bashrc`
- `/etc/skel` [skeleton folder for new user]
- `~/.profile`
- `~/.bash_profile`
- `~/.bash_login`
- `~/.bash_logout` [settings issued when user logout]

### 105.1 Aliases & functions

// aliases can be added to conf files eg (~/.bashrc):

- `alias ls='ls --color=auto'` // ls with colorizer
- `alias ll='ls -alF'` // list files in directory with keys -alF
  // to update settings type: `bash`

> // functions also can be added to `~/.bashrc`

`function wtf() {echo "my name is:" whoami; echo "today is:" date}`

### 105.1 Переменные и настройки

- `fruit="banana"` // set variable
- `echo $fruit` // banana
- `unset fruit` // delete variable
- `export fruit` // set variable as environment var
- `env` // show env variables

> // ENVIRONMENT VARIABLES:

- `PATH=$PATH:/home/bin` // add /home/bin to path variable
- `export PATH=$PATHe:~/root/scripts` - set variable

> Sourced by shell only:

    - `~/.profile` - shell users vars
    - `~/.zshrc` - zsh shell configuration (only for zsh shell users)
    - `/etc/environment` - system wide variables
    - `/etc/profile`
    - `/etc/profile.d/*`
    - `/etc/<shell>.<shell>rc` - single shell specific.

> Daemon & kernel system variables: (not working)

- `/etc/sysctl.conf`
- `/etc/sysctl.d`

### 105.2 Азы создания BASH скрипта

- `#!/bin/bash` - начало любого баш скрипта

```
#!/bin/bash
echo "are you hungry ?"
if [ $VALUE="YES" ];
    then
    echo "Make some dinner"
else
    echo "Continue working!!!"
fi
```

### 105.2 / 2 Программа `test`

- `-x` исполн файл
- `-e` файл сущ
- `-eq` значения равны
- `-ne` значения не равны
- `-z` существ ли знач

> // Результат записывает в `$?`

- 0 - результат положит
- не 0 - результат отрицат

- `test -x ifscript; echo $?`
- `[ "text" = "test" ]; echo $?` // 1 (means no)
- `[ "text" = "text" ]; echo $?` // 0 (means yes)
- `test 100 -gt 50 && echo "Yes" || echo "No"`

### 105.2 / 3 Синтаксис условных выражений / подстановка функций

- `x = $(date)` // присваиваем Х дату
- `y = 'uptime -p'` // присваеваем y время аптайм
- `echo "Today is $x and we are up $y"` // выводим в консоль

### 105.2 / 4 Циклы в bash скриптах

> FOR

```
for x in 5 6 7
do
echo "number $x"
done
```

```
#!/bin/bash
for x in `seq 3 8`  // sequence from 3 to 8
do
echo $x
done
```

```
#!/bin/bash
files=`ls ~`
for x in $files
do
echo $x
done
```

> WHILE

```
x=10
while [$x-ne 20]
do
echo "number $x"
x=$($x+1)
done
```

```
#!/bin/bash
echo "type anything or STOP to complete"
x="Go"
while [ $x != "STOP" ]
do
read x
echo $x
done
```

### 105.3 Базы данных: MYSQL / установка, настройка

- `apt-get install mysql-server` // установка
- `mysql_secure_installation` // настройка безопасности после установки

> Config files:

```
/etc/mysql/mysql.conf.d/mysqld.cnf
/etc/mysql/mysql.cnf
/etc/mysql/my.cnf
/etc/my.cnf
/var/lib/mysql/my.cnf
```

- `sudo service --status-all` // list available services
- `sudo /etc/init.d/mysql start` // запуск
- `sudo service mysql start` // запуск
- `sudo service mysql stop`
- `sudo mysql -u <root>` // подключение от пользователя рут
- `CREATE DATABASE cars;`
- `USE cars;`
- `CREATE TABLE used_cars (brand VARCHAR(10), model VARCHAR(10), year YEAR, price INT);`
- `LOAD DATA INFILE "/home/ezlife/old.txt" INTO TABLE used_cars;`

- `CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';` - create new user
- `GRANT ALL PRIVILEGES ON * . * TO 'newuser'@'localhost';` grant permissions (cannot login without permissions)

> Setting MYSQL error & access logs:

```
sudo vim /etc/mysql/my.cnf  # edit configuration

# switch on errors loging:
[mysqld_safe]
log_error=/var/log/mysql/mysql_error.log

[mysqld]
log_error=/var/log/mysql/mysql_error.log

#enable general query logging:
general_log_file        = /var/log/mysql/mysql.log
general_log             = 1

#enable slow query logging:
log_slow_queries       = /var/log/mysql/mysql-slow.log
long_query_time = 2
log-queries-not-using-indexes

```

- `service mysql restart` - restart mysql

> Removing of MYSQL:

```
$ sudo apt-get remove --purge mysql-server mysql-client mysql-common -y
$ sudo apt-get autoremove -y
$ sudo apt-get autoclean
$ sudo rm -rf /etc/mysql
$ sudo find / -iname 'mysql*' -exec rm -rf {} \;
```

### 105.3 Базы данных: DBEAVER CLIENT

```
wget -O - https://dbeaver.io/debs/dbeaver.gpg.key | sudo apt-key add -
echo "deb https://dbeaver.io/debs/dbeaver-ce /" | sudo tee /etc/apt/sources.list.d/dbeaver.list
sudo apt-get install postgresql-client
sudo add-apt-repository ppa:serge-rider/dbeaver-ce
sudo apt update
sudo apt -y install dbeaver-ce
sudo apt-get install postgresql-client

```


### PHP

- `sudo vim /etc/php/7.4/fpm/php.ini` - main config file

> PHP environment variables (nginx -fpm)

1. `sudo vim /etc/php/7.4/fpm/pool.d/www.conf` - open configuration file
2. `clear_env = no` - uncomment environment setting
3. `env[“PHP_FOO”] = $LINUX_FOO` - add linux env variable as PHP_FOO
4. `echo getenv("PHP_FOO");` - check your php env variable

### 106.1 Installing graphical subsystem

- `apt-get install firefox`
- `sudo apt-get install xorg` // graphical drivers
- `sudo X -configure` //
- `/var/log/Xorg.0.log` // logs for graph drivers
- `startx` // start graphic

### 107.1 User accounts

- `compgen -u` // list users
- `cut -d: -f1 /etc/passwd` // list users
- `awk -F':' '$2 ~ "\$" {print $1}' /etc/shadow` // list all users who can login
- `su -l <username>` // change current user
- `passwd` // change password
- `sudo passwd <username>` // change other user password
- `useradd` // add users
- - `sudo adduser new_username`
- `usermod` // modification of user
- - `sudo usermod -L <username>` // lock user, `-U` unlock
- `sudo userdel -r <username>` // delete user and his files
- - `sudo rm -r /home/username`
- `adduser username sudo` // add user to sudo group

# add to sudoers:
- visudo 
```
#The command above leads us to the /etc/sudoers.tmp file, where we can view the following code:
# User privilege specification
root    ALL=(ALL:ALL) ALL
```
`sudo adduser <username> sudo`
`sudo usermod -a -G sudo <username>`
`groups <username>` to see what groups are normally in use.

### 107.1 / 1 Users passwords and groups

- `/etc/passwd` // user_name:pass:uid:gid:data:home_folder:bash (now pass in shadow)
- `/etc/group` // group_name:pass:gid:members (now pass in gshadow)
- `/etc/shadow` // user_name:pass:time_after_change_pass (and other)
- `/etc/gshadow` // group_name:pass:gid:members

### 107.1 / 2 Groups

- `groupadd` // add group
- - `sudo usermod -aG <groupname> <username>` // add user to group
- `groupmod` // change group
- `groupdel`
- `chage` //
- `getent` // works with system libs
- `getent passwd` // check users passwords

### 107.2 / Cron plan manager

- `apt-get update && apt-get -y install cron` - install cron
- `touch /etc/cron.d/hello-cron` - create file with crontask
- `echo '* * * * * root echo "Hello world" >> /var/log/cron.log 2>&1' > /etc/cron.d/hello-cron` - add task to hello-cron file
- `chmod 0744 /etc/cron.d/hello-cron` - add execution rights to hello-cron
- `crontab /etc/cron.d/hello-cron` - start cron task

- `crontab -l` - list users cron tasks
- `crontab -r` - remove all users cron tasks

- `sudo vi /etc/crontab` - crontab settings
  > minute : hour : date : month : dayofweek : user : task

```
05 15 ***  > every day 15:05
05 15 17 2*  > every 17 feb 15:05
05 15 ** 6   > every saturday 15:05
05 15 11 1   > every 1st january if monday 15:05

05,40 ****   > 5 and 40 min of every hour
*/15  ****   > every 15 mins
05 15 ** 1-5 > working days 15:05

```

> Put your bash scripts in following directories to schedule them:

```
/etc/cron.daily/
/etc/cron.hourly/
/etc/cron.monthly/
/etc/cron.weekly/
```

### 107.2 / 2 Cron manager access

- `/var/spool/cron/crontabs` - user tasks
- `crontab -l` - show user tasks
- `crontab -e` - add user task (vi editor will open)
- `/etc/cron.deny` - list of users denied to use cron
- `/etc/cron.allow` - list of users allowed to use cron (overides deny list, if allow list present, only users in list can use cron)

### 107.2 / 3 Anacron (Asyncronous plan manager)

> Anacron - periodical run of tasks
>
> - If cron & anacron installed on ubuntu, then daily/weekly/monthly cron task folders are managed by anacron

- period(days):stby(mins):id:command

- `/etc/anacrontab` - configuration file
- `/var/spool/anacron` - files with times of anacron completed tasks
- `sudo vi /etc/cron.d/anacron` - anacron settings

### 107.2 / 4 At - one time task run manager

- `atq` - check planned tasks
- `at now +15 min` > then hit enter and select task
- `at 15:00 01/09/2016` > then hit enter and select task
- `atrm 1` - delete task

### 107.4 Timezones

- `tzselect` - change timezone
- `/etc/timezone` - record pointing to `/usr/share/zoneinfo`
- `/etc/localtime` -
- `date` - show and set date
- `sudo date MMDDTTTTYYYY` - set date

### 109.1 TCP/IP

| Port # | TCP | UDP |      Description       |
| :----: | :-: | :-: | :--------------------: |
|   20   |  x  |     |       FTP (data)       |
|   21   |  x  |     |       FTP (auth)       |
|   22   |  x  |  x  |          SSH           |
|   23   |  x  |  x  |         Telnet         |
|   25   |  x  |  x  |    SMTP (send mail)    |
|   53   |  x  |  x  |          DNS           |
|   80   |  x  |  x  |          HTTP          |
|  110   |  x  |  x  |  POP3 (receive mail)   |
|  123   |  x  |  x  |       NTP (time)       |
|  139   |  x  |  x  |        NetBios         |
|  143   |  x  |  x  |          IMAP          |
|  161   |  x  |  x  |     SNMP (control)     |
|  162   |  x  |  x  | SNMPTRAP (send signal) |
|  389   |  x  |  x  |    LDAP (catalogs)     |
|  443   |  x  |  x  |         HTTPS          |
|  465   |  x  |  x  |         SMTPS          |
|  514   |     |  x  |         SYSLOG         |
|  636   |  x  |  x  |         LDAPS          |
|  993   |  x  |  x  |         IMAPS          |
|  995   |  x  |  x  |         POP3S          |

> Full list of ports can be found in:

- `less /etc/services`

### FTP
> list ftp
grep ftp /etc/services 

> check connections on port 22
netstat -tan | grep \:22

> check which program using port 22
sudo netstat -tanp | grep \:22

> install pure-ftpd 
apt install pure-ftpd -y

systemctl status pure-ftpd

> check who is connected:
sudo pure-ftpwho

### 109.2 Network configuration & connection

- `/etc/hostname` // hostname
- `/etc/hosts` // database of names and ip addresses
- `/etc/resolv.conf` // dns settings
- `/etc/resolvconf/resolov.conf.d` // dns settings
- `/etc/nsswitch.conf` // NSS settings
- `/etc/network/interfaces` // Network configuration
- `/etc/sysconfig/network-scripts` // Network configuration (centos)

> Typical commands:

- `ifconfig` - settings
- `ip` - ip settings
- `hostname` - our machine name
- `host` - request information from DNS (direct)
- `ping` - check connection with host
- `traceroute` - check data route
- `netstat` - network information
- `netcat` - network connections
- `lsof` - list of open files
- `sudo lsof -i` - list of open connections
-
- `nmap 127.0.1.1` - show open ports from inside
- `nc -v www.ya.ru 80` - check connection with yandex on port 80
- `nc -l -v -p 123456` - listening on localhost port 123456
- `nc -v -n -z -w 1 10.0.1.1 50-100` - check ports from 50-100 on host 10.0.1.1 with 1 second delay
- `getent hosts` - check local dns records
- `getent hosts google.com` - check google dns records

### 110.1 Root user tasks

- `su` - change user to super user (after exit return to normal)
- `su -c 'vi /etc/resolv.conf'` - edit with su rights
- `sudo` - ask pass from current password
- `sudo visudo /etc/sudoers` - edit document with root user permissions
- `sudo touch /etc/nologin` - if this file is created only root can enter system

#### 110.1.4 System users

- `w` / `who` - show active users
- `users`
- `last` - last users entered system
- `lastb` - unsuccessfull entries

### 110.3 Cryptography SSH / OPENSSH
- sudo systemctl status 
- sudo systemctl enable ssh
- sudo systemctl start ssh

- `~/.ssh/known_hosts` - public keys of previous approved hosts are saved here
- `~/.ssh/authorized_keys` - place on server where users public auth keys are stored
- `~/.ssh/id_rsa` / `~/.ssh/id_rsa.pub` - private and public personal keys

- `/etc/ssh/ssh_known_hosts` - public keys for all users
- `ssh-keygen -t rsa` - generate public & private key
- `ssh-agent bash` + `ssh-add .ssh/id_rsa` - add identity to bash console (save for use without pass)
- `sudo ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key` - create ssh pub and priv key for full host (not user only)

- `RSA` crypto algorythm for signing & signature
- `DSA` crypto algorythm for signing only

### 110.4 SSH Tunnels

- `ssh -x 10.0.1.16` - connection to remote server using x11 (graphics)
- `scp text.txt ezlife@10.0.1.16:/home/ezlife` - copy file to remote pc
- `scp ezlife@10.0.1.16:/home/ezlife/text.txt /home/ezlife` - copy file from remote pc
- `ssh 10.0.1.16 -N -L 12345:213.180.204.3:80` - connect to remote host, do nothing, link our local port 12345 to yandex port 80 (then try localhost:12345)

### 110.5 Encryption

- `gpg --gen-key` - generate new key
- `~/.gnupg` - directory with personal & public keys
- `gpg --list-key` - list key
- `gpg --export ezlife > gpg.public` - save generated key to file
- `gpg --import gpg.public` - import key from file
- `gpg --out secret.file --recipient 'ezlife' --encrypt file.txt` - encrypt file with key
- `gpg --out some.file --decrypt secret.file` - decrypt file with key

### Disk space

- `df -h` check space available all disks
- `sudo df -hT /dev/sda1` - check specific mount
- `sudo lsblk -o NAME,FSTYPE,SIZE,MOUNTPOINT,LABEL` - detailed list of disks & partitions
- `sudo ntfsfix /dev/nvme0n1p8` - fixing ntfs partition kde

- `sudo fsck.ext4 -f /dev/sda1` - fix partition ??

kill node process in windows

taskkill //F //IM "node.exe"


### WGET

wget <URL> - download the specified file in the URL to the current directory.

wget <URL> -O <file_name> - Downloading a file with specified filename

wget –c <URL> - Resuming partially downloaded file

wget –i <file_name> <URL> - Multiple downloads, “-i” option followed by a file containing multiple URLs (one URL per line) can be used.


### LOGGING

***SYSLOG***

`sudo service syslog status`

> Конфигурация демона syslog:

[источник.приоритет назначение]

Источники:
- auth, cron, kernel, mail, user, daemons
Приоритеты: (8шт)
- emergency, alert, critical, error, warning, notice, info, debug
Назначение:
- файл, консоль, ковеер, удаленная система, группа пользователей и проч.

> 
> Понятия источников событий и приоритета событий:
> 
> запись событий на удаленный сервер:

`cat /etc/default/rsyslog`



`/var/log` - main location of logs

`/etc/rsyslog.d/50-default.conf` - system logging configuration
`/var/log/syslog` - main system log

Types of logs:
- syslog - main system log
- auth.log (secure.log) - authentication 
- boot.log
- dpkg.log - installation log
- fail.log - failed authentications


Useful commands:
```sh
who # who and when last time login to system
last # when anybody login and logout
last erik7z # filter for some user
lastlog #when any user logged in
```

Watch in log files:
```sh
cat
less 
tail -f

cat | grep | cut | sort | uniq | wc # mainly used for log filtering by basic commands

cat auth.log | grep sudo | cut -d " " -f 11 | sort | uniq | wc -l # filter by sudo entry, then split gy space and take 11 entry, then sort alfabetically and remove duplicates, then calculate lines

```

Best utlities for log search:

***lnav***
```sh
sudo apt install lnav
lnav /var/log/syslog # check info in log 
```

- Commands:
  "i" - show histogram
  "?" - search  


***Logrotate*** - Rotation of logs
- Утилита для облегчения управления логами, запускается обычно кроном
`cat /etc/cron.daily/logrotate`

`/etc/logrotate.conf` - main settings
`/etc/logrotate.d` - detailed settings for each type of logs






***Journald*** - main system logging service
> Хранит данные:

- /run/log/journal
- /var/log/journal

> Управляется:
- Journalctl

> Настройки:
- /etc/systemd/journald.conf

`sudo service systemd-journald restart`
`sudo journalctl --since 11:04 --unti 12:05` - show all logs 
`sudo journalctl -p err ` - show all error logs 
`sudo journalctl -b` - since boot
`sudo journalctl -n 20` - show last 20 lines
`sudo journalctl -f` - show logs in realtime
`sudo journalctl -f=disk-usage` - size of logs on disk
`sudo journalctl --vacuum-size=1G` - limit size of logs to 1gb
`sudo journalctl --vacuum-time=1years` - limit size of logs to 1gb

`systemd-journal-remote --url https://sdfsdf:12345` - subscribe to remote logs
`systemd-journal-upload --url https://sdfsdf:12345` - send logs to remote machine

`journalctl --list-boots` - log of system boots
`journalctl -u NetworkManager` - check logs for some exact service
`systemd-analyze` - loading of system


### base64 osx:
-- encode to base64:
`echo -n 'nguita:Cr3wsilent*' | openssl base64` -> bmd1aXRhQGZ1aWIuY29tOjEyMzQ1



### BREW

- information about installed package
brew info dbeaver-community 

### DBEAVER
- cacert folder
/usr/local/Caskroom/dbeaver-community/21.3.2/DBeaver.app/Contents/Eclipse/jre/Contents/Home/lib/security


- installing cacert for elastic:

$ keytool -import -keystore elasticsearch.p12 -file /home/my/ca.crt


### VAGRANT

```sh
vagrant init ubuntu/bionic64
vagrant up
vagrant ssh # enter inside machine
vagrant destroy

##### handling ntfs disk errors:
#1 move private key to non-ntfs disk
mv /media/erik7z/share/www/_learn/devops_h/.vagrant/machines/default/virtualbox/private_key ~/.ssh
#2 create hardlink 
ln -sr ~/.ssh/private_key /media/erik7z/share/www/_learn/devops_h/.vagrant/machines/default/virtualbox/private_key

```

### ip
```sh
apt update
apt install iproute2 -y
apt install net-tools -y

ip a  #  show the IP or IPv6 address on a device.
hostname -i #  internal IP address of the system.

# Find Your External IP Address
curl -w "\n" -s https://api.ipify.org
curl ifconfig.me
```

### Watch
```sh
# Set a custom interval to run a user-defined command and show the output by using the -n or --interval
watch -n [interval in seconds] [command]


```

