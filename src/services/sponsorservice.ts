import {SchemaTypes}  from "mongoose";
import {Application, json} from "express";
import * as bodyParser from "body-parser";
import * as services from "./services";
import * as security from "./securityservice";

export namespace SponsorService {
    let __selectionFields = "_id useremail username firstname lastname photo audit";

    let sponsorSchema = services.createMongooseSchema({        
        firstname: {type: String},
        lastname: {type: String},
        useremail: {type: String, required: [true, '*'], unique: true},
        username: {type: String, unique: true},
        security: {type: security.SecuritySchema()},
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
    
    let sponsorModel =  services.createMongooseModel("sponsor", sponsorSchema); 
    
    function newSponsor(item: any, callback: Function) {
        var sponsor = new sponsorModel(item);

        sponsor.save(null, (err,doc)=>{
            callback(err,doc);
        })
    }

    function saveSponsor(item: any, callback: Function) {
        var sponsor = new sponsorModel(item);
        
        sponsor["audit"].push({modified: new Date(), sponsor_id: sponsor._id});

        var options = services.createFindOneAndUpdateOptions();
        
        sponsorModel.findOneAndUpdate({_id: sponsor._id}, sponsor, options, (err,doc, res) =>{
            callback(err, doc["value"]);
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
    
        app.post("/api/secure", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            const data = req.body.data;
            const secret = req.body.secret;            

            if(!data || !secret) {
                res.json(services.jsonResponse("HttpPOST: request body not available"));
            }

            res.json(services.jsonResponse(security.generateEncryptedData(data,secret)));
        });

        app.post("/api/sponsor/auth", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            const useremail = req.body.useremail; // either useremail or username
            const password = req.body.password; // clear text password never saved

            if(!useremail || !password) {
                res.json(services.jsonResponse("HttpPOST: request body not available"));
            }

            security.authenticate(useremail, password, (error, data) =>{
                res.json(services.jsonResponse(error,data));
            });
        });

        /**
         * new sponsor security
         */
        app.post("/api/sponsor/security/:id", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            res.json(services.jsonResponse("Not implemented yet"));
            
            // const hashid = req.body.hashid; // use system generated access identitify 

            // const useremail = req.body.useremail;            
            // const password = req.body.password;
            // if(!useremail || !password) {
            //     res.json(services.jsonResponse("HttpPOST request body not available"));
            // }

            // const questions = req.body.questions;
            // if(!questions) {
            //     res.json(services.jsonResponse("HttpPOST request security object not available"));
            // }

            // const securityModel = security.generate(useremail, password, questions);
            // security.newSponorSecurity(useremail, securityModel,(error,data) => {
            //     res.json(services.jsonResponse(error,data));
            // });
        });

        app.post("/api/sponsor/unique", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            const field = req.body.field;
            const value = req.body.value;
            if(!field || !value) {                
                res.json(services.jsonResponse("HttpPOST body not available with request"));
            }

            security.verifyUniqueUserField(field, value, (error, data) => {
                    res.json(services.jsonResponse(error,data));
            });
        });

        app.post("/api/sponsor", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            if(!req.body) {
                res.status(200);
                res.json(services.jsonResponse("HttpPOST json body not available"));
           }

           res.status(200);
           newSponsor(req.body, function(error, data){
               res.json(services.jsonResponse(error,data));
           });
        });

        app.post("/api/sponsor/new", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            if(!req.body) {
                res.status(200);
                res.json(services.jsonResponse("HttpPOST json body not available"));
           }

           // generate the security object
           var item = req.body;
           var useremail = item.useremail;
           var password = item.password;

           item.security = security.generate(useremail, password);

           // create the new sponsor with security
           res.status(200);
           newSponsor(item, function(error, data){
                if(!error) {
                    security.authenticate(useremail, password, (err, auth) =>{
                        res.json(services.jsonResponse(err,auth));
                    });                            
                }

               res.json(services.jsonResponse(error,data));
           });
        });

        app.post("/api/sponsor/:id", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            // if(!req.body.hashid) {
            //     res.status(200);
            //     res.json(services.jsonResponse("HttpGET json body not available"));
            // }

            saveSponsor(req.body, (error, data) => {
                res.status(200);
                res.json(services.jsonResponse(error, data));
            });
        });

        app.get("/api/sponsor/:id", (req,res) => {
            console.debug(`GET: ${req.url}`);
            res.status(200);
            getContribtuor(req.params.id, (error, data) => {
                res.json(services.jsonResponse(error, data));
            });
        });

        app.get("/api/sponsors", (req,res) => {
            console.debug(`GET: ${req.url}`);
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
