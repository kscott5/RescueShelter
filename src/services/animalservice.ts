import {Application}  from "express";
import * as bodyParser from "body-parser";
import * as services from "./services";

export namespace AnimalService {
    let __selectionFields = '_id name description imageSrc contributors';

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
        contributors: {type: Array<String>()}
    });
    
    animalSchema.index({name: "text", description: "text", contributors: "text"});
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

        animalModel.findOneAndUpdate({_id: animal._id}, animal, {rawResult: true} ,(err,doc,res)=>{
            callback(err, doc.value);
        });
    }

    function getAnimal(id: String, callback: Function){
        animalModel.findById(id,callback);
    } 

    function getAnimals(callback: Function, page: number = 1, limit: number = 5, phrase?: String) {
        var condition = (phrase)? {$text: {$search: phrase}}: {};

        animalModel.find(condition)
            .lean()
            .limit(limit)
            .select(__selectionFields)
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
         * @description Includes a new item 
         */
        app.post("/api/animal/new", jsonBodyParser, function(req,res){
            if(!req.body) {
                 res.status(404);
                 res.json("HttpPOST json body not available");                 
            }

            res.status(200);
            newAnimal(req.body, function(error, data){
                var results = services.jsonResponse(error,data);
                res.json(results);
            });
        });

        app.post("/api/animal/:id", jsonBodyParser, function(req,res){
            if (!req.params.id || !req.body) {
                res.status(404);
                res.json("HttpPOST id or json body not available");
                return;
            } 

            res.status(200);
            saveAnimal(req.body, function(error,data){
                var results = services.jsonResponse(error,data);
                res.json(results);
            });
        });

        /**
         * @description Retrieves single item
         * @param id unique identifier of item
         */
        app.get("/api/animal/:id", function(req,res){
            if (!req.params.id) {
                 res.status(404);
                 res.send("HttpGET id not available");
                 return;
            }

            res.status(200);
            getAnimal(req.params.id, function(error,data){
                var results = services.jsonResponse(error,data);
                res.json(results);
            });
        });

        /**
         * @description Retrieves a json resultset of items
         */
        app.get("/api/animals/", function(req,res){
           var page = Number.parseInt(req.query.page || 1); 
           var limit = Number.parseInt(req.query.limit || 5);
           var phrase = req.query.phrase || null;

           res.status(200);
           getAnimals(
               function(error, data) {
                    var results = services.jsonResponse(error,data);
                    res.json(results);
                }, 
                page, limit, phrase
            );
        });
    } 
} // end namespace AnimalService