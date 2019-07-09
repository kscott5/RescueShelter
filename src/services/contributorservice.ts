import {Application} from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";

export namespace ContributorService {
    let __connectionString = 'mongodb://localhost:27017/rescueshelter';

    let __connection = mongoose.createConnection(__connectionString);

    let constributorSchema = new mongoose.Schema({        
        firstname: {type: String},
        middlename: {type: String},
        lastname: {type: String},
        useremail: {type: String, required: [true, '*'], unique: [true]},
        photo: {type: String},
        audit: [
            {
                creation: {type: Date, required: [true]},
                contributor_id: {type: mongoose.Schema.Types.ObjectId, required: [true]}
            }
        ]
    });
    
    constributorSchema.index({username: "text", useremail: "text"});
    constributorSchema.path("audit.creation").default(function(){return Date.now();});    
    //schema.path("audit.contributor_id").default(function(){return Date.now();});
    
    export const name = 'contributor';
    let model =  __connection.model(ContributorService.name, constributorSchema); 

    export class Pagination {
        public pages: Number;
        public pageIndex: Number;
        public documents: Array<any>;

        constructor(pageCount: Number, pageCurrent: Number, data: Array<any>){
            this.pages = pageCount;
            this.pageIndex = pageCurrent;
            this.documents = data;
        }
    };


    export function publishWebAPI(app: Application) {
        let jsonBodyParser = bodyParser.json({type: 'application/json'});
    
        app.post("/api/contributor", jsonBodyParser, (req,res) => {

        });

        app.get("/api/contributors", (req,res) => {

        });
    }
}