#!/bash/bin
clear

if [ "$1" = "--webapi" ]; then 
    
    kill $(lsof -t -i :3302)
    if [ $? != 0 ]; then echo "Rescue Shelter webapi//localhost:3302 not open"
    else echo "Rescue Shelter webapi//localhost:3302 closed"
    fi

fi

if [ "$1" = "--webapp" ]; then 
    
    kill $(lsof -t -i :3301)
    if [ $? != 0 ]; then echo "Rescue Shelter webapp//localhost:3301 not open"
    else echo "Rescue Shelter webapp//localhost:3301 closed"
    fi
    
fi