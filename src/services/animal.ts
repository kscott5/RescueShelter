import {Application}  from "express";
import * as logger from "morgan";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";

export namespace AnimalService {
    export const name = 'animal';

    let __connection = mongoose.createConnection("mongodb://localhost:27017/rescueshelter");

    let schema = new mongoose.Schema({
        name: String,
        endangered: Boolean,
        description: String,
        population: Number,
        schemaVersion: String,
        dates: {
            created: Date ,
            modified: Date,
            modifiedBy: mongoose.SchemaTypes.ObjectId
        }
    });
    schema.path("schemaVersion").default(function(){return "1.0.0.0";});
    schema.path("dates.created").default(function(){return Date.now();});
    schema.path("dates.modified").default(function(){return Date.now();});
    
    let model =  __connection.model(AnimalService.name, schema);    

    export function insertAnimal(item: Object) {
        var animal = new model(item);
        
        model.collection.insertOne(animal);
    }

    export function getAnimals(callback) {
        model.find().exec(callback);
    }    
    
    // Parser for various different custom JSON types as JSON
    let jsonBodyParser = bodyParser.json({type: 'application/json'});
    
    export function publishWebAPI(app: Application) {
        app.post("/api/animal/new", jsonBodyParser, function(req,res){
            if(!req.body) res.status(404);            

            AnimalService.insertAnimal(req.body);

            res.status(200);
        });

        app.get("/api/animals/", function(req,res){
           if(!req.body) res.status(404);
           
           AnimalService.getAnimals(function(error, data){
               if(error) res.send(error);
               else res.json(data);
           });
        });

        app.get("/api/animals/search", jsonBodyParser, function(req,res){
            
        });
    }    
}