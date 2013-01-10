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


echo 'copying backup from sandbox.serempre.com';
echo 'enter password for user pacific@sandbox.serempre.com';
scp -P 5001 pacific@sandbox.serempre.com:/home/pacific/db.dump ~/Desktop/latest.dump;
abortOnFailure $? "scp -P 5001 pacific@sandbox.serempre.com:/home/pacific/db.dump ~/Desktop/latest.dump;";
echo 'restoring backup';
pg_restore --verbose --clean --no-acl --no-owner -h localhost -d jobladder ~/Desktop/latest.dump
abortOnFailure $? "pg_restore --verbose --clean --no-acl --no-owner -h localhost -d jobladder ~/De\
sktop/latest.dump";
echo 'removing dump file';
rm ~/Desktop/latest.dump;
abortOnFailure $? "rm ~/Desktop/latest.dump";
