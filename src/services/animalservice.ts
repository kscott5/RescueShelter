import {Application}  from "express";
import * as bodyParser from "body-parser";
import * as services from "./services";
import {SecurityService as security} from "./securityservice";

export namespace AnimalService {
    let __selectionFields = '_id name description imageSrc sponsors';

    let animalSchema = services.createMongooseSchema({
        name: {type: String, unique:true, required: [true, '*']},
        imageSrc: String,
        endangered: Boolean,
        description: String,
        population: Number,
        dates: {
            created: Date ,
            modified: Date
        },
        sponsors: {type: Array<String>()}
    });
    
    animalSchema.index({name: "text", description: "text", sponsors: "text"});
    animalSchema.path("dates.created").default(function(){return Date.now();});
    animalSchema.path("dates.modified").default(function(){return Date.now();});
    
    let animalModel =  services.createMongooseModel("animal", animalSchema);    
    
    function newAnimal(item: any, callback?: Function) {
        var animal = new animalModel(item);
             
        animal.save(null,(err,product)=>{
            callback(err, product);
        });
    }

    function saveAnimal(item: any, callback?: Function) {
        var animal = new animalModel(item);

        var options = services.createFindOneAndUpdateOptions();
        animalModel.findOneAndUpdate({_id: animal._id}, animal, options ,(err,doc,res)=>{
            callback(err, doc["value"]);
        });
    }

    function getAnimal(id: String, callback: Function){
        animalModel.findById(id,callback);
    } 

    function getAnimals(callback: Function, page: number = 1, limit: number = 5, phrase?: String) {
        var animalAggregate = (!phrase)? animalModel.aggregate() :
            animalModel.aggregate().append({$match: {$text: {$search: phrase}}});
        
        
        animalAggregate.append([
            {
                $lookup: {
                    from: "sponsors",
                    let: {animals_sponsors: '$sponsors'},
                    pipeline: [{
                        $project: {
                            _id: false, useremail: 1, username: 1, 
                            is_sponsor: {$in: ['$useremail', '$$animals_sponsors']}
                        }            
                    }],
                    as: "sponsors"
                }        
            },
            {
            $project: {
                name: 1, description: 1, endangered: 1, imageSrc: 1,
                sponsors: {
                    $filter: {
                        input: '$sponsors',
                        as: 'contributor',
                        cond: {$eq: ['$$contributor.is_sponsor', true]}
                    }
                }
            }}
        ])
        .limit(limit)            
        .exec(function(error, data) {
            var results = new services.pagination(1,1, data);
            callback(error,results)
        });
    } 
    
    /**
     * @description Pushlishes the available Web API URLs for items
     */
    export function publishWebAPI(app: Application) {
        // Parser for various different custom JSON types as JSON
        var jsonBodyParser = bodyParser.json({type: 'application/json'});
    

        /**
         * @description create a new animal data 
         */
        app.post("/api/animal/new", jsonBodyParser, function(req,res){
            console.debug(`POST: ${req.url}`);

            var hashid = req.body.hashid;
            var useremail = req.body.useremail;
            var animal = req.body.animal;
            
            res.status(200);

            if(animal === null) {
                res.json(services.createJSONResponse("HttpPOST request body not valid"));
            }

            var access = {accessType: "hashid", hashid: hashid, useremail: useremail};
            security.verifyAccess(access, (error, data) => {
                if(error !== null){
                    res.json(services.createJSONResponse("You do not have access.", data));
                } else {
                    newAnimal(req.body, function(error, data){
                        var results = services.createJSONResponse(error,data);
                        res.json(results);
                    });
                }
            }); // end verify access
        });

        /**
         * @description update the animal data
         */
        app.post("/api/animal/:id", jsonBodyParser, function(req,res){
            console.debug(`POST [:id] update ${req.url}`);

            var id = req.params.id;
            var hashid = req.body.hashid;
            var useremail = req.body.useremail;
            var animal = req.body.animal;
            
            res.status(200);

            if(id === null || animal === null || animal._id != id) {
                res.json(services.createJSONResponse("HttpPOST request parameter and/or json body not valid"));
            }
            
            var access = {accessType: "hashid", hashid: hashid, useremail: useremail};
            security.verifyAccess(access, (error, data) => {
                if(error !== null){
                    res.json(services.createJSONResponse("You do not have access.", data));
                } else {
                    saveAnimal(animal, function(error,data) {
                        res.json(services.createJSONResponse(error,data));                
                    });
                }
            });
        }); // end POST [update] /api/animal/:id 

        /**
         * @description Retrieves single item
         * @param id unique identifier of item
         */
        app.get("/api/animal/:id", function(req,res){
            console.debug(`GET: ${req.url}`);
            if (!req.params.id) {
                 res.status(404);
                 res.send("HttpGET id not available");
                 return;
            }

            res.status(200);
            getAnimal(req.params.id, function(error,data){
                var results = services.createJSONResponse(error,data);
                res.json(results);
            });
        });

        /**
         * @description Retrieves a json resultset of items
         */
        app.get("/api/animals/", function(req,res){
            console.debug(`GET: ${req.url}`);
            var page = Number.parseInt(req.query.page || 1); 
            var limit = Number.parseInt(req.query.limit || 5);
            var phrase = req.query.phrase || null;

            res.status(200);
            getAnimals(
                function(error, data) {
                        var results = services.createJSONResponse(error,data);
                        res.json(results);
                    }, 
                    page, limit, phrase
            );
        });
    } 
} // end namespace AnimalService