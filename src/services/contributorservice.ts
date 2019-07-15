import {SchemaTypes}  from "mongoose";
import {Application} from "express";
import * as bodyParser from "body-parser";
import * as services from "./services";

export namespace ContributorService {
    let __selectionFields = "_id useremail username firstname lastname photo audit";

    let contributorSchema = services.createMongooseSchema({        
        firstname: {type: String},
        lastname: {type: String},
        useremail: {type: String, required: [true, '*'], unique: true},
        username: {type: String, unique: true},
        photo: {type: String},
        audit: [
            {
                _id: false,
                modified: {type: Date, required: [true]},
                contributor_id: {type: SchemaTypes.ObjectId, required: [true]}
            }
        ]
    });
    
    contributorSchema.index({username: "text", useremail: "text"});
    contributorSchema.path("audit").default(function(){
        return {
            modified: Date.now(),
            contributor_id: this._id,
        };
    });    
    //schema.path("audit.contributor_id").default(function(){return Date.now();});
    
    let contributorModel =  services.createMongooseModel("contributor", contributorSchema); 
    
    function newContributor(item: any, callback: Function) {
        var contributor = new contributorModel(item);

        contributor.save(null, (err,doc)=>{
            callback(err,doc);
        })
    }

    function saveContributor(item: any, callback: Function) {
        var contributor = new contributorModel(item);
        
        contributorModel.findOneAndUpdate({_id: contributor._id}, contributor, (err,doc, res) =>{
            callback(err, doc);
        });
    }

    function getContribtuor(id: String, callback: Function) {
        contributorModel.findById(id,callback);
    }

    function getContributors(callback: Function, page: number = 1, limit: number = 5, phrase?: String) {
        var condition = (phrase)? {$text: {$search: phrase}}: {};
        
        contributorModel.find(condition)
            .lean()
            .limit(limit)
            .select(__selectionFields)
            .exec(function(error, data) {
                var results = new services.pagination(1,1, data);
                callback(error,results)
            });
    } 

    export function publishWebAPI(app: Application) {
        let jsonBodyParser = bodyParser.json({type: 'application/json'});
    
        app.post("/api/contributor/:id", jsonBodyParser, (req,res) => {
            if(!req.params.id || !req.body.hashid) {
                res.status(200);
                res.json(services.jsonResponse("HttpGET json body not available"));
            }

        });

        app.post("/api/contributor", jsonBodyParser, (req,res) => {
            if(!req.body) {
                res.status(200);
                res.json(services.jsonResponse("HttpPOST json body not available"));
           }

           res.status(200);
           newContributor(req.body, function(error, data){
               var results = services.jsonResponse(error,data);
               res.json(results);
           });
        });

        app.get("/api/contributor/:id", (req,res) => {
            res.status(200);
            getContribtuor(req.params.id, (error, data) => {
                res.json(services.jsonResponse(error, data));
            });
        });

        app.get("/api/contributors", (req,res) => {
            var page = Number.parseInt(req.query.page || 1); 
            var limit = Number.parseInt(req.query.limit || 5);
            var phrase = req.query.phrase || null;

            res.status(200);
            getContributors(
                function(error, data) {
                    var results = services.jsonResponse(error,data);
                    res.json(results);
                }, 
                page, limit, phrase
            );            
        });
    }
}
