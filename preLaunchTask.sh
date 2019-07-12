#!/bin/bash
#
# Ensures the Rescue Shelter starts fresh
#
clear

if [ "$1" = "--webapi" ]; then 
    
    kill $(lsof -t -i :3302)
    if [ $? != 0 ]; then echo "Rescue Shelter webapi//localhost:3302 not open"
    else echo "Rescue Shelter webapi//localhost:3302 closed"
    fi

fi

npm run clean
npm run compile

echo "Configure the mongodb docker container"
sudo docker rm mongo_dev -f
sudo docker run -d --rm -p 27017:27017 --name mongo_dev mongo

if [ "$1" = "--webapp" ]; then 
    
    kill $(lsof -t -i :3301)
    if [ $? != 0 ]; then echo "Rescue Shelter webapp//localhost:3301 not open"
    else echo "Rescue Shelter webapp//localhost:3301 closed"
    fi

    npm run start 
fi