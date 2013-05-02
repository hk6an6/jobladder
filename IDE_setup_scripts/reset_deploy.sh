#!/bin/bash

#takes two positional arguments: <exit status> and a <tag>. Aborts process if $? isn't zero
#<exit status>: stands for the last process execution status. Zero means everything worked. This can be queried by using $?
#<tag>: a tag to identify the process. Just use any text that suits you
abortOnFailure(){
	if [ $1 -eq 0 ]; then 
		echo "$2: completed successfully"; 
	else 
		echo "$2: failed";
		exit $1 
	fi
}

sudo rm -rf ~/media
abortOnFailure $? "sudo rm -rf ~/media"
sudo mv /opt/bitnami/apps/django/django_projects/jobladder/jobladder/media ~/media
abortOnFailure $? "sudo mv /opt/bitnami/apps/django/django_projects/jobladder/jobladder/media ~/media"
sudo rm -rf /opt/bitnami/apps/django/django_projects/jobladder
abortOnFailure $? "sudo rm -rf /opt/bitnami/apps/django/django_projects/jobladder"
sudo mv ~/jobladder /opt/bitnami/apps/django/django_projects/jobladder
abortOnFailure $? "sudo mv ~/jobladder /opt/bitnami/apps/django/django_projects/jobladder"
sudo mv ~/media /opt/bitnami/apps/django/django_projects/jobladder/jobladder/media
abortOnFailure $? "sudo mv ~/media /opt/bitnami/apps/django/django_projects/jobladder/jobladder/media"
sudo cp -f /opt/bitnami/apps/django/django_projects/settings.py.bk.latest /opt/bitnami/apps/django/django_projects/jobladder/jobladder/settings.py
abortOnFailure $? "sudo cp -f /opt/bitnami/apps/django/django_projects/settings.py.bk.latest /opt/bitnami/apps/django/django_projects/jobladder/jobladder/settings.py"
sudo chmod -R 755 /opt/bitnami/apps/django/django_projects/jobladder
abortOnFailure $? "sudo chmod -R 755 /opt/bitnami/apps/django/django_projects/jobladder"
sudo chown -R daemon:root /opt/bitnami/apps/django/django_projects/jobladder
abortOnFailure $? "sudo chown -R daemon:root /opt/bitnami/apps/django/django_projects/jobladder"
sudo python /opt/bitnami/apps/django/django_projects/jobladder/manage.py collectstatic
abortOnFailure $? "sudo python /opt/bitnami/apps/django/django_projects/jobladder/manage.py collectstatic"
sudo sh /opt/bitnami/ctlscript.sh restart apache
abortOnFailure $? "sudo sh /opt/bitnami/ctlscript.sh restart apache"
