# Rescue Shelter
Simple Single Page Application SPA that uses  
- Simple Happy Path Use Cases 
- NodeJS
- React
- Semantic-UI-React
- HTML5, CSS3 & Javascript
- ExpressJS Web API 
- Mongoose CRUD with indexes, text search
- Mongo Docker Container  

NOTE: The app.js could function within a serverless cloud environment or API explorer. However, this is a small application with limit features. These environment require registration, access tokens and more.  
 
  
  Tools | Javascript | Database  | Live Code Testing  
  ------- | ---------- | -------- | -------  
 [Markdown Guide](https://guides.github.com/features/mastering-markdown/) | [ReactJS](https://reactjs.org/) | [MongoDB Ecosystem](https://docs.mongodb.com/ecosystem/drivers/) | [jsfiddle](http://jsfiddle.net/)  
 [GitHub](https://github.com/) | [Mozilla Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | [Mongo Docker Hub](https://hub.docker.com/_/mongo) | [codepend.io](https://codepen.io/)  
 [Visual Code](https://code.visualstudio.com/) | [Typescript](https://www.typescriptlang.org/) | [Mongoose JS](https://mongoosejs.com/) | [Regexr](http://regexr.com/)  
 [Powershell Core](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-linux?view=powershell-6) | | | 
 [Docker](https://www.docker.com/) | | |

### More
>[Chrome extensions](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en)  
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

# Visual Code - Debugging configuration tips
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