#!/bin/bash
#run this within the cloned project folder while being sourced into virtualenv

git remote add heroku git@heroku.com:secret-castle-3861.git
#this is optional
#heroku labs:enable user-env-compile -a secret-casstle-3861
sudo easy_install pip
sudo pip install virtualenv
virtualenv venv --distribute
source venv/bin/activate
pip install -r requirements.txt
