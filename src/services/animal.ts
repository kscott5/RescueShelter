import * as mongoose from "mongoose";
import * as model from "../models/animal";

export class AnimalService {
    private __db = mongoose.createConnection("127.0.0.1", "rescueshelter", 3303);

    addItem(item: model.animal, callback: Function) {
       model.animalModel.collection.insertOne(item, callback)
    }
}