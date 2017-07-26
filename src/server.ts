"use strict";

import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as cons from "consolidate";

enum ViewEngineType {
    Jade, HandleBars, React
};

enum LoggerType {
    Development, Staging, Production
};

let serverApp = express();
declare let __dirname; // variable initialize by NodeJS Path Module

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
        
        // NOTE: serverApp.engine is for server-side templating renders
        this.setEngine();

        let publicPath = path.join(__dirname, 'public');
        serverApp.use("/", express.static(publicPath));
        console.log("wwwroot: " + publicPath);
        
        let reactPath = path.join(__dirname, 'components');
        serverApp.use("/react", express.static(reactPath));
        console.log("react-components: " + reactPath);
        
        let scriptsPath = path.join(__dirname, '..', 'node_modules');
        serverApp.use("/scripts", express.static(scriptsPath));
        console.log("javascripts: " + scriptsPath);
        
        serverApp.get("/index.html", function(req,res, next) {
            next();
        });

        serverApp.listen(port,function(){
            console.log('Rescue Shelter listening on port: '+ port);
        });
    }
    /**
     * @returns void
     */
    private setEngine() : void {
        let viewsPath = path.join(__dirname, 'react', 'components');
        console.log("setEngine: " + viewsPath);

        serverApp.engine("react", cons.react);
        serverApp.set("view engine", "jsx");
        serverApp.set("views", viewsPath );
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