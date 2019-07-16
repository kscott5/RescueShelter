import {SchemaTypes}  from "mongoose";
import {Application} from "express";
import * as bodyParser from "body-parser";
import * as services from "./services";

export namespace SponsorService {
    let __selectionFields = "_id useremail username firstname lastname photo audit";

    let sponsorSchema = services.createMongooseSchema({        
        firstname: {type: String},
        lastname: {type: String},
        useremail: {type: String, required: [true, '*'], unique: true},
        username: {type: String, unique: true},
        photo: {type: String},
        audit: [
            {
                _id: false,
                modified: {type: Date, required: [true]},
                Sponsor_id: {type: SchemaTypes.ObjectId, required: [true]}
            }
        ]
    });
    
    sponsorSchema.index({username: "text", useremail: "text"});
    sponsorSchema.path("audit").default(function(){
        return {
            modified: Date.now(),
            Sponsor_id: this._id,
        };
    });    
    //schema.path("audit.sponssor_id").default(function(){return Date.now();});
    
    let sponsorModel =  services.createMongooseModel("sponsor", sponsorSchema); 
    
    function newSponsor(item: any, callback: Function) {
        var Sponsor = new sponsorModel(item);

        Sponsor.save(null, (err,doc)=>{
            callback(err,doc);
        })
    }

    function saveSponsor(item: any, callback: Function) {
        var sponsor = new sponsorModel(item);
        
        sponsorModel.findOneAndUpdate({_id: sponsor._id}, sponsor, (err,doc, res) =>{
            callback(err, doc);
        });
    }

    function getContribtuor(id: String, callback: Function) {
        sponsorModel.findById(id,callback);
    }

    function getSponsors(callback: Function, page: number = 1, limit: number = 5, phrase?: String) {
        var condition = (phrase)? {$text: {$search: phrase}}: {};
        
        sponsorModel.find(condition)
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
    
        app.post("/api/sponsor/:id", jsonBodyParser, (req,res) => {
            if(!req.params.id || !req.body.hashid) {
                res.status(200);
                res.json(services.jsonResponse("HttpGET json body not available"));
            }

        });

        app.post("/api/sponsor", jsonBodyParser, (req,res) => {
            if(!req.body) {
                res.status(200);
                res.json(services.jsonResponse("HttpPOST json body not available"));
           }

           res.status(200);
           newSponsor(req.body, function(error, data){
               var results = services.jsonResponse(error,data);
               res.json(results);
           });
        });

        app.get("/api/sponsor/:id", (req,res) => {
            res.status(200);
            getContribtuor(req.params.id, (error, data) => {
                res.json(services.jsonResponse(error, data));
            });
        });

        app.get("/api/sponsors", (req,res) => {
            var page = Number.parseInt(req.query.page || 1); 
            var limit = Number.parseInt(req.query.limit || 5);
            var phrase = req.query.phrase || null;

            res.status(200);
            getSponsors(
                function(error, data) {
                    var results = services.jsonResponse(error,data);
                    res.json(results);
                }, 
                page, limit, phrase
            );            
        });
    }
}
