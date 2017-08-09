"use strict";

import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as bodyParser from "body-parser";

import {AnimalService} from "./services/animal";

enum LoggerType {
    Development, Staging, Production
};

let apiServer = express();

// Parser for various different custom JSON types as JSON
let jsonBodyParser = bodyParser.json({type: 'application/json'});

declare let __dirname; // variable initialize by NodeJS Path Module

/**
 * Express Http server for the Rescue Shelter App
 */
class Server {
    private port: number;

    /**
     * Starts the express http server
     * @param  {LoggerType=LoggerType.Development} loggerType
     * @param  {Number=3302} port
     * @returns void
     */
    start(loggerType: LoggerType = LoggerType.Development, port: Number = 3302) : void {
        apiServer.use(logger("Development")); // TODO: Use LoggerType Enum
        
        this.setAccessControlsAllowed(port);
        
        let publicPath = path.join(__dirname, 'public');
        apiServer.use("/", express.static(publicPath));
        console.log("wwwroot: " + publicPath);
        
        apiServer.get("/api.html", function(req,res, next) {
            res.sendFile("api.html");
        });

        apiServer.post("/rs/new/animal/", jsonBodyParser, function(req,res){
            if(!req.body) res.status(404);
            
            res.send({message: 'TODO add server response to /rs/new/animal => ' + req.body.animal.name});
        });

        apiServer.get("/rs/all/animals", function(req,res){
           if(!req.body) res.status(404);
           res.send("Get all animals");

        });

        apiServer.listen(port,function(){
            console.log('Rescue Shelter listening on port: '+ port);
        });
    }
    
    /**
     * Sets the access controlled allow for headers, methods, etc...
     */
    private setAccessControlsAllowed(port: Number) {
       /* serverApp.use(function(req,res,next){
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:"+ port);
            res.setHeader("Access-Control-Allow-Methods", ["GET", "HEAD", "POST"]);
            res.setHeader("Access-Control-Allow-Headers", "content-type");
        })*/
        
    }
}

export default { Server };