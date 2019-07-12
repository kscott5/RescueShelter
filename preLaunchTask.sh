#!/bin/bash
#
# Ensures the Rescue Shelter starts fresh
#
clear


if [ "$1" = "--webapi" ]; then 

    npm run clean
    npm run compile

    echo "Configure the mongodb docker container"      
    docDbName=$(sudo docker ps --filter "name=mongo_dev" --format "{{.Names}}")
    echo "Docker container name: $docDbName"
    if [ "$docDbName" != "mongo_dev" ]; then
        sudo docker rm mongo_dev -f
        sudo docker run -d --rm -p 27017:27017 --name mongo_dev mongo
    fi
fi

if [ "$1" = "--webapp" ]; then     
    npm run start 
fi