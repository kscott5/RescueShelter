import * as mongoose from "mongoose";

export namespace AnimalService {
    export const name = 'animal';

    let __db = mongoose.createConnection("mongodb://localhost:27017/rescueshelter");

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
    
    let model =  __db.model(AnimalService.name, schema);

    export function addItem(item: Object, callback: Function) {
        var data = model.collection.insertOne(item)
    }

    export function getAnimalByName(name: String) {
        return 'TODO getAnimalByName';
    }

    export function getAnimals() {
        return 'TODO getAnimals';
    }    
}
