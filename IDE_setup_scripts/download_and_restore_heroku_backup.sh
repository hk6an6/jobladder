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

echo 'creating heroku backup';
heroku pgbackups:capture --expire
abortOnFailure $? 'heroku backup';
echo 'downloading heroku backup';
curl -o ~/Desktop/latest.dump `heroku pgbackups:url`
abortOnFailure $? 'download heroku backup';
echo 'restoring backup';
pg_restore --verbose --clean --no-acl --no-owner -h localhost -d jobladder ~/Desktop/latest.dump
abortOnFailure $? 'restore postgres dump';
echo 'removing dump file';
rm ~/Desktop/latest.dump;
echo 'Done!';

