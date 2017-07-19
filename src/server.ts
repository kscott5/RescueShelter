"use strict";

import * as express from "express";
import * as logger from "morgan";

enum ViewEngineType {
    Jade, HandleBars, React
};

enum LoggerType {
    Development, Staging, Production
};

let serverApp = express();

/**
 * Express Http server for the Rescue Shelter App
 */
class Server {
    private port: number;

    /**
     * Starts the express http server
     * @param  {ViewEngineType=ViewEngineType.HandleBars} viewEngine
     * @param  {String='rescueshelterviews'} viewName
     * @param  {LoggerType=LoggerType.Development} loggerType
     * @param  {Number=3001} port
     * @returns void
     */
    start(viewEngine: ViewEngineType = ViewEngineType.HandleBars, viewName: String = 'rescue shelter views', loggerType: LoggerType = LoggerType.Development, port: Number = 3001) : void {
        serverApp.use(logger("Development")); // TODO: Use LoggerType Enum
        
        this.setAccessControlsAllowed(port);
        
        serverApp.get('/', function(req, res){
            res.send('Welcome to Express using Typescript!');
        });

        serverApp.listen(port,function(){
            console.log('Rescue Shelter listening on port: '+ port);
        })
    }
    /**
     * Sets the access controlled allow for headers, methods, etc...
     */
    private setAccessControlsAllowed(port: Number) {
        
        serverApp.use(function(req,res,next){
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:"+port);
            res.setHeader("Access-Control-Allow-Methods", "GET");
            res.setHeader("Access-Control-Allow-Headers", "content-type");
        })
        
    }
}

export default { Server };