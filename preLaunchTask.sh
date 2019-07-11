#!/bin/bash
#
# Ensures the Rescue Shelter starts fresh
#
clear

npm run clean
npm run compile

sudo docker rm mongo_dev -f
sudo docker run -d --rm -p 27017:27017 --name mongo_dev mongo

if [ "$1" = "--webapp" ]; then 
    npm run start 
fi