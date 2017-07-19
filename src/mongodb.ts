import * as mongoDB from "mongodb";

export class MongoDB {
    uri: String;
    
    /**
     * Constructor for Rescue Shelter MongoDB
     * @param uri Connection string to data store
     */
    constructor(uri: String = "mongodb://localhost:27017/rescueshelter") {
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