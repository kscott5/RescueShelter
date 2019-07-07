import * as mongoDB from "mongodb";
import * as mongose from "mongoose";

export class MongoDB {
    uri: string;
    
    /**
     * Constructor for Rescue Shelter MongoDB
     * @param uri Connection string to data store
     */
    constructor(uri: string = "mongodb://localhost:27017/rescueshelter") {
        this.uri = uri;
    }

    /**
     * Adds new user 
     * @param user 
     */
    createUser(user: Object) : void {
       mongoDB.MongoClient.connect(this.uri, function(err, db){

       });
    
    }
}