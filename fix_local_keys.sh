#!/bin/bash

echo "AWS_ACCESS_KEY_ID='AKIAJ7JRXK43OVKXUM7A'" >> ~/.bash_profile
echo "export AWS_ACCESS_KEY_ID" >> ~/.bash_profile
echo "AWS_SECRET_ACCESS_KEY='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'" >> ~/.bash_profile
echo "export AWS_SECRET_ACCESS_KEY" >> ~/.bash_profile
echo "AWS_STORAGE_BUCKET_NAME='pacific_energy'" >> ~/.bash_profile
echo "export AWS_STORAGE_BUCKET_NAME" >> ~/.bash_profile
echo "JOBLADDER_GIT=https://serempre.repositoryhosting.com/git/serempre/jobladder.git" >> ~/.bash_profile
git config --global user.name 'nicolasaragon'
git config --global user.email 'nico.diaz.aragon@gmail.com'
curl -s -O http://github-media-downloads.s3.amazonaws.com/osx/git-credential-osxkeychain
chmod u+x git-credential-osxkeychain
GIT_PATH=`which git`
GIT_PATH=$(echo $GIT_PATH | awk '{split($0,A,"/"); for(i=0;i<length(A)-1;i++) { if(A[i]!="") printf "/%s", A[i] } }')
sudo mv git-credential-osxkeychain $GIT_PATH/
git config --global credential.helper osxkeychain
cd ~/.ssh
mkdir key_backup
cp id_rsa* key_backup
rm id_rsa*
ssh-keygen -t rsa -C "nico.diaz.aragon@gmail.com"
heroku keys:add ~/.ssh/id_rsa.pub
