import {SchemaTypes}  from "mongoose";
import {Application, json} from "express";
import * as bodyParser from "body-parser";
import * as services from "./services";
import {SecurityService} from "./securityservice";

export namespace SponsorService {
    class SponsorDb {
        private __selectionFields;
        private sponsorModel;

        cnstructor() {
            this.__selectionFields =  "_id useremail username firstname lastname photo audit";
        
            var sponsorSchema = services.createMongooseSchema({        
                firstname: {type: String},
                lastname: {type: String},
                useremail: {type: String, required: [true, '*'], unique: true},
                username: {type: String, unique: true},
                security: {type: SecurityService.SecuritySchema()},
                photo: {type: String},
                audit: [
                    {
                        _id: false,
                        modified: {type: Date, required: [true]},
                        sponsor_id: {type: SchemaTypes.ObjectId, required: [true]}
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
            
            this.sponsorModel = services.createMongooseModel("sponsor", sponsorSchema);
        }

        newSponsor(item: any, callback: Function) {
            var sponsor = new this.sponsorModel(item);

            sponsor.save(null, (err,doc)=>{
                callback(err,doc);
            })
        }

        saveSponsor(item: any, callback: Function) {
            var sponsor = new this.sponsorModel(item);
            
            sponsor["audit"].push({modified: new Date(), sponsor_id: sponsor._id});

            var options = services.createFindOneAndUpdateOptions();
            
            this.sponsorModel.findOneAndUpdate({_id: sponsor._id}, sponsor, options, (err,doc, res) =>{
                callback(err, doc["value"]);
            });
        }

        getSponsor(id: String, callback: Function) {
            this.sponsorModel.findById(id,callback);
        }

        getSponsors(callback: Function, page: number = 1, limit: number = 5, phrase?: String) {
            var condition = (phrase)? {$text: {$search: phrase}}: {};
            
            this.sponsorModel.find(condition)
                .lean()
                .limit(limit)
                .select(this.__selectionFields)
                .exec(function(error, data) {
                    var results = new services.Pagination(1,1, data);
                    callback(error,results)
                });
        } 
    } //end SponsorDb class

    export function publishWebAPI(app: Application) {
        let jsonBodyParser = bodyParser.json({type: 'application/json'});
        let jsonResponse = new services.JsonResponse();

        let db = new SponsorDb();

        app.post("/api/sponsor", jsonBodyParser, (req,res) => {
            
            console.debug(`POST: ${req.url}`);
            if(!req.body) {
                res.status(200);
                res.json(jsonResponse.createError("HttpPOST json body not available"));
           }

           res.status(200);
           db.newSponsor(req.body, function(error, data){
               (error)? 
                    res.json(jsonResponse.createError(error)) :
                    res.json(jsonResponse.createData(data));
           });
        });

        app.post("/api/sponsor/:id", jsonBodyParser, (req,res) => {
            console.debug(`POST [:id]: ${req.url}`);            
            db.saveSponsor(req.body, (error, data) => {
                res.status(200);
                (error)? 
                    res.json(jsonResponse.createError(error)) :
                    res.json(jsonResponse.createData(data));
            });
        });

        app.get("/api/sponsor/:id", (req,res) => {
            console.debug(`GET [:id]: ${req.url}`);
            res.status(200);
            db.getSponsor(req.params.id, (error, data) => {
                (error)?
                    res.json(jsonResponse.createError(error)) :
                    res.json(jsonResponse.createData(data));
            });
        });

        app.get("/api/sponsors", (req,res) => {
            console.debug(`GET: ${req.url}`);
            var page = Number.parseInt(req.query.page || 1); 
            var limit = Number.parseInt(req.query.limit || 5);
            var phrase = req.query.phrase || null;

            res.status(200);
            this.getSponsors(function(error, data) {
                (error) ?
                    res.json(jsonResponse.createError(error)) :
                    res.json(jsonResponse.createData(data));
            });
        });
    } // end publishWebAPI
} // end SponsorService namespace
