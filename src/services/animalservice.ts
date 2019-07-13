import {Application}  from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";

export namespace AnimalService {
    mongoose.set('debug', true);
    mongoose.set('useFindAndModify', false);

    let __selectionFields = '_id name description imageSrc contributors';
    let __connectionString = 'mongodb://localhost:27017/rescueshelter';

    let __connection = mongoose.createConnection(__connectionString);

    let schema = new mongoose.Schema({
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
    
    schema.index({name: "text", description: "text", contributors: "text"});
    schema.path("dates.created").default(function(){return Date.now();});
    schema.path("dates.modified").default(function(){return Date.now();});
    
    export const name = 'animal';
    let model =  __connection.model(AnimalService.name, schema);    
    
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

    export function newAnimal(item: any, callback?: Function) {
        var animal = new model(item);
             
        animal.save(null,(err,product)=>{
            callback(err, product);
        });
    }

    export function saveAnimal(item: any, callback?: Function) {
        var animal = new model(item);

        model.findOneAndUpdate({_id: animal._id}, animal, {rawResult: true} ,(err,doc,res)=>{
            callback(err, doc.value);
        });
    }

    export function getAnimal(id: String, callback: Function){
        model.findById(id,callback);
    } 

    export function getAnimals(callback: Function, page: number = 1, limit: number = 5, phrase?: String) {
        var condition = (phrase)? {$text: {$search: phrase}}: {};

        model.find(condition)
            .lean()
            .limit(limit)
            .select(__selectionFields)
            .exec(function(error, data) {
                var results = new Pagination(1,1, data);
                callback(error,results)
            });
    } 

    function jsonResponse(error, data) {
        return {
            ok: !error,
            data: error || data,
        }
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
            AnimalService.newAnimal(req.body, function(error, data){
                var results = jsonResponse(error,data);
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
            AnimalService.saveAnimal(req.body, function(error,data){
                var results = jsonResponse(error,data);
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
            AnimalService.getAnimal(req.params.id, function(error,data){
                var results = jsonResponse(error,data);
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
           AnimalService.getAnimals(
               function(error, data) {
                    var results = jsonResponse(error,data);
                    res.json(results);
                }, 
                page, limit, phrase
            );
        });
    } 
} // end namespace AnimalService