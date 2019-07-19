"use strict";

import * as express from "express";
import * as helmet from "helmet";
import * as cors from "cors";
import * as morgan from "morgan";
import * as path from "path";

import {AnimalService} from "./services/animalservice";
import {SponsorService} from "./services/sponsorservice";


enum LoggerType {
    Development, Staging, Production
};

let apiServer = express();

declare let __dirname; // variable initialize by NodeJS Path Module

/**
 * Express Http server for the Rescue Shelter App
 */
export class Server {
    private port: number;

    /**
     * Starts the express http server
     * @param  {LoggerType=LoggerType.Development} loggerType
     * @param  {Number=3302} port
     * @returns void
     */
    start(loggerType: LoggerType = LoggerType.Development, port: Number = 3302) : void {
        apiServer.use(morgan("dev")); // TODO: Use LoggerType Enum

        var whitelist = [];
        var corsOptionsDelegate = function (req, callback) {
            if (whitelist.length === 0 || whitelist.indexOf(req.headers.origin) === 0) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        };
        apiServer.use(cors(corsOptionsDelegate));
        
        apiServer.use(helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
                imgSrc: ["'self'"]
            }
        }));
        
        let publicPath = path.join(__dirname, '../public');
        apiServer.use(express.static(publicPath));
        console.log("wwwroot: " + publicPath);
        
        apiServer.get("/apis.html", function(req,res, next) {
            res.sendFile("apis.html");
        });

        AnimalService.publishWebAPI(apiServer);
        SponsorService.publishWebAPI(apiServer);
        
        apiServer.listen(port,function(){
            console.log('Rescue Shelter listening on port: '+ port);
        });
    }
}

export default { Server };