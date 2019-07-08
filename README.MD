# Rescue Shelter
Simple Single Page Application SPA that uses  
- NodeJS
- React
- Semantic-UI-React
- HTML5, CSS3 & Javascript
- ExpressJS Web API 
- Mongoose CRUD
- Mongo Docker Container  

NOTE: The app.js could function within a serverless cloud environment or API explorer. However, this is a small application with limit features. These environment require registration, access tokens and more.  
 
  
  
>[Markdown Guide](https://guides.github.com/features/mastering-markdown/)  
>[Visual Code](https://code.visualstudio.com/)  
>[Chrome extensions](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en)  
>[Mongo Docker Hub](https://hub.docker.com/_/mongo)  
>[Serverless](https://serverless.com/)  
>[Swagger](https://swagger.io/)  

# Terminal or powershell 
```shell

# project dependency package manager
npm install or yarn install 

# loads the container
sudo docker run -it --expose 27017:27017 --name mongo_dev mongo:latest

# starts the container
sudo docker start mongo_dev

# starts the container with interactive output viewer
sudo docker start -i mongo_dev

# transcomile typescript files
npm run complile or yarn compile

# start the express app on localhost:3302 
node src/app.js

# start the web app on localhost:33001 in different shell
npm run start or yarn start
```  

# Visual Code - Debugging configuration tip
launch.json
```
"configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome",
            "url": "http://localhost:3301",
            "preLaunchTask": "npm: start",
            "webRoot": "${workspaceFolder}/src"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}/src/app.js",
            "preLaunchTask": "tsc: build - tsconfig.json",
            "outFiles": [
                "${workspaceFolder}/src/**/*.js"
            ]
        }
    ]
```  
