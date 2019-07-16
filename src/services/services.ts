import * as mongoose from "mongoose";
import * as crypto from "crypto";
import { Buffer } from "buffer";

console.log(`mongoosejs version: ${mongoose.version}`);

mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);

let __connectionString = 'mongodb://localhost:27017/rescueshelter';
let __connection = mongoose.createConnection(__connectionString);

export function createMongooseSchema(schemaDefinition: any) {
    return new mongoose.Schema(schemaDefinition)
}
export function createMongooseModel(modelName: string, modelSchema: mongoose.Schema<any>) {
    return __connection.model(modelName, modelSchema);
}

export function createFindOneAndUpdateOptions(fields?: Object|String) {
    // MongoDB https://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#findOneAndUpdate
    // Mongoose https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    
    var options = {
        new:  true,       // returns the modified model
        upsert: false,    // new models are not allowed
        maxTimeMS:  1000, // 10 seconds maximum wait
        rawResult: true,  // returns the raw result from the MongoDB driver
        strict: false     // ensures only model schema value saved
    };

    /*Field selection. Equivalent to .select(fields).findOneAndUpdate()*/
    if(fields) 
        options["fields"] = fields;

    return options;
}

export function createSecret(id: string) {
    crypto.createSecretKey
}
export class pagination {
    public pages: Number;
    public pageIndex: Number;
    public documents: Array<any>;

    constructor(pageCount: Number, pageCurrent: Number, data: Array<any>){
        this.pages = pageCount;
        this.pageIndex = pageCurrent;
        this.documents = data;
    }
}

export function jsonResponse(error, data: any = null) {
    return {
        ok: !error,
        data: error || data,
    }
}

