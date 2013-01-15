#!/bin/bash

PORT=5000;

echo "web: venv/bin/gunicorn jobladder.wsgi -b 0.0.0.0:$PORT" > /home/pacific/jobladder/Procfile;

rm /home/pacific/jobladder/jobladder/settings.py;

cp /home/pacific/copy_of_settings.py /home/pacific/jobladder/jobladder/settings.py;

cd /home/pacific/jobladder; 

foreman start & 

