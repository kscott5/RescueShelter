import * as mongoose from "mongoose";
import * as member from "./member";

class animal {
     get name(): String{
        return this.name;
     };
     set name(value: String) {
         this.name = value;
     }
     
    type: String;
    endangered: Boolean;
    description: String;
    population: Number;
    dates: {
        created: Date,
        modified: Date,
        modifiedBy: {}
    };
}

var animalSchema = new mongoose.Schema({
    name: String,
    type: String,    
    endangered: Boolean,
    description: String,
    population: Number,
    dates: {
        created: Date,
        modified: Date,
        modifiedBy: member
    }
});

var animalModel = mongoose.model("Animal", animalSchema);

export {animal, animalModel, animalSchema};