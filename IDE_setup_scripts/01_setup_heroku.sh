#!/bin/bash
#run this within the cloned project folder while being sourced into virtualenv

echo "if you cloned the project from repositoryhosting, then type:";
echo "'sh 01_setup_heroku.sh ['add_heroku']'";

#test for a 1st argument matching the string 'add_heroku'
if [ "$1" == 'add_heroku' ]; then
    echo "adding heroku";
  	#this sets up heroku in case you've cloned sources from repositoryhosting
	git remote add heroku git@heroku.com:secret-castle-3861.git  
fi

sudo easy_install pip
sudo pip install virtualenv
virtualenv venv --distribute
source venv/bin/activate
pip install -r requirements.txt
