import * as mongoose from "mongoose";
import * as member from "./member";

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

var animal = mongoose.model("Animal", animalSchema);

export default animal;