#!/bin/bash

echo "if you need to enable remote user environment compilation, then use:";
echo "'sh 03_fix_heroku_aws_keyx.sh user-env-compile'";

heroku config:add AWS_ACCESS_KEY_ID=AKIAJ7JRXK43OVKXUM7A
heroku config:add AWS_SECRET_ACCESS_KEY=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
heroku config:add AWS_STORAGE_BUCKET_NAME=pacific_energy

if [ "$1" == 'user-env-compile' ]; then
    echo "enabling user environment compilation";
	heroku labs:enable user-env-compile -a secret-casstle-3861  
fi

