"use strict";

import * as express from "express";
import * as logger from "morgan";
import * as path from "path";

enum LoggerType {
    Development, Staging, Production
};

let apiServer = express();
declare let __dirname; // variable initialize by NodeJS Path Module

/**
 * Express Http server for the Rescue Shelter App
 */
class Server {
    private port: number;

    /**
     * Starts the express http server
     * @param  {LoggerType=LoggerType.Development} loggerType
     * @param  {Number=3002} port
     * @returns void
     */
    start(loggerType: LoggerType = LoggerType.Development, port: Number = 3002) : void {
        apiServer.use(logger("Development")); // TODO: Use LoggerType Enum
        
        this.setAccessControlsAllowed(port);
        
        let publicPath = path.join(__dirname, 'public');
        apiServer.use("/", express.static(publicPath));
        console.log("wwwroot: " + publicPath);
        
        apiServer.get("/api.html", function(req,res, next) {
            res.sendFile("api.html");
        });

        apiServer.post("/rs/new/animal/", function(req,res){
            
        })
        apiServer.get("/rs/all/animals", function(req,res){

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