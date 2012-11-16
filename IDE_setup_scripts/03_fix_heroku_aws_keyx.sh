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
#make this function available to any subsequent scripts
export -f abortOnFailure

echo "if you need to enable remote user environment compilation, then use:";
echo "'sh 03_fix_heroku_aws_keyx.sh user-env-compile'";

heroku config:add AWS_ACCESS_KEY_ID=AKIAJ7JRXK43OVKXUM7A
heroku config:add AWS_SECRET_ACCESS_KEY=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
heroku config:add AWS_STORAGE_BUCKET_NAME=pacific_energy

if [ "$1" == 'user-env-compile' ]; then
    echo "enabling user environment compilation";
	heroku labs:enable user-env-compile -a secret-casstle-3861  
fi

