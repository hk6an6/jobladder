#!/bin/bash

#check for input parameters
if [ $# -lt "2" ]; then
    echo "to use, type: 'sh 02_fix_local_keys.sh <GITHUB_USERNAME> <GITHUB_EMAIL> ['clone_heroku']'"
    exit 1;
fi

#fix environment variables
echo "AWS_ACCESS_KEY_ID='AKIAJ7JRXK43OVKXUM7A'" >> ~/.bash_profile
echo "export AWS_ACCESS_KEY_ID" >> ~/.bash_profile
echo "AWS_SECRET_ACCESS_KEY='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'" >> ~/.bash_profile
echo "export AWS_SECRET_ACCESS_KEY" >> ~/.bash_profile
echo "AWS_STORAGE_BUCKET_NAME='pacific_energy'" >> ~/.bash_profile
echo "export AWS_STORAGE_BUCKET_NAME" >> ~/.bash_profile
echo "JOBLADDER_GIT=https://serempre.repositoryhosting.com/git/serempre/jobladder.git" >> ~/.bash_profile
echo "export JOBLADDER_GIT" >> ~/.bash_profile
echo "fixed environment variables! you are ready to use AWS S3 bucket for static & media files"

#set github configuration
git config --global user.name '$1' #use github username
echo "using $1 as github username"
git config --global user.email '$2' #use github email
echo "using $2 as github registered email"

if [ `uname` == 'Darwin' ]; then
    echo "this is os x! osxkeychain will be installed :)";
    echo "downloading osxkeychain from http://github-media-downloads.s3.amazonaws.com/osx/git-credential-osxkeychain"
    curl -s -O http://github-media-downloads.s3.amazonaws.com/osx/git-credential-osxkeychain
    echo "osxkeychain downloaded"
	chmod u+x git-credential-osxkeychain
	GIT_PATH=`which git`
	GIT_PATH=$(echo $GIT_PATH | awk '{split($0,A,"/"); for(i=0;i<length(A)-1;i++) { if(A[i]!="") printf "/%s", A[i] } }')
	echo "git was found at $GIT_PATH"
	sudo mv git-credential-osxkeychain $GIT_PATH/
	echo "osxkeychain has been copied to $GIT_PATH"
	git config --global credential.helper osxkeychain
	echo "git has been bound to osxkeychain"
else
    echo "this isn't os x :(";
    echo "oxkeychain won't be installed";
fi

#create ssh keys for use with heroku and github
cd ~/.ssh
mkdir key_backup
cp id_rsa* key_backup
echo "backed up all ssh keys"
rm id_rsa*
echo "cleared all ssh keys"
ssh-keygen -t rsa -C "$2" #create a public key for the github email
echo "created an ssh key for $2"

#start a session in heroku
heroku login

#add your new ssh keys to heroku
heroku keys:add ~/.ssh/id_rsa.pub

if [ "$3" == 'clone_heroku' ]; then
    echo "cloning heroku";
  	#clone sources from heroku (only if you are not using repositoryhosting)
	git clone git@heroku.com:secret-castle-3861.git -o production  
fi
