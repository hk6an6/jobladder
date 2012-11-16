#!/bin/bash
#run this within the cloned project folder while being sourced into virtualenv

abortOnFailure(){
	if [ $? -eq 0 ]; then 
		echo "$1 completed successfully"; 
	else 
		echo "$1 failed";
		exit $? 
	fi
}

echo "if you cloned the project from repositoryhosting, then type:";
echo "'sh 01_setup_heroku.sh ['add_heroku']'";

#test for a 1st argument matching the string 'add_heroku'
if [ "$1" == 'add_heroku' ]; then
    echo "\nadding heroku\n";
  	#this sets up heroku in case you've cloned sources from repositoryhosting
	git remote  add heroku git@heroku.com:secret-castle-3861.git
	abortOnFailure "adding heroku";
fi
echo "\ninstalling 'pip'\n";
sudo easy_install pip
abortOnFailure "installing pip";
echo "installing 'virtualenv'";
sudo pip install virtualenv
abortOnFailure "installing virtualenv";
echo "\nsetting up virtualenv on this folder\n";
virtualenv venv --distribute
abortOnFailure "installing virtualenv on current folder";
echo "\nactivating virtualenv\n";
source venv/bin/activate
abortOnFailure "activating virtualenv";
echo "\ninstalling project dependencies\n";
pip install -r requirements.txt
abortOnFailure "";
echo "\ninstalling project dependencies\n";
