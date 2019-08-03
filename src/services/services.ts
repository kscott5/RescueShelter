import * as mongoose from "mongoose";
import { element } from "prop-types";

console.log(`mongoosejs version: ${mongoose.version}`);

mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);

let __connectionString = 'mongodb://localhost:27017/rescueshelter';
let __connection = mongoose.createConnection(__connectionString);

let __models = {};

export const SYSTEM_UNAVAILABLE_MSG = "system unavailable. please try later.";
export const SYSTEM_INVALID_USER_CREDENTIALS_MSG = "invalid useremail and/or password";
export const SYSTEM_SESSION_EXPIRED = "login, current session expired.";

export function createMongooseSchema(schemaDefinition: any, strictMode: boolean = true) {
    return new mongoose.Schema(schemaDefinition, {strict: strictMode});
}

export function createMongooseModel(modelName: string, modelSchema: mongoose.Schema<any> | Function) 
: mongoose.Model<mongoose.Document> {
    var schema = (typeof modelSchema == 'function')?  modelSchema(): modelSchema;

    const model = __connection.model(modelName, schema);    
    __models[modelName] = model;

    return __models[modelName];
}

export function getModel(modelName: string) : mongoose.Model<mongoose.Document> {    
    if(__models[modelName])
        return __models[modelName];
    throw new Error(`${modelName} not a valid model name.`);
    
}

export function createFindOneAndUpdateOptions(fields?: Object|String, upsert: boolean = false) {
    // MongoDB https://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#findOneAndUpdate
    // Mongoose https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    
    var options = {
        new:  true,       // returns the modified model
        upsert: upsert,    // new models are not allowed
        maxTimeMS:  1000, // 10 seconds maximum wait
        rawResult: true,  // returns the raw result from the MongoDB driver
        strict: false     // ensures only model schema value saved
    };

    /*Field selection. Equivalent to .select(fields).findOneAndUpdate()*/
    if(fields) 
        options["fields"] = fields;

    return options;
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

export function createJSONResponse(error, data: any = null) {
    return {
        ok: !error,
        data: error || data,
    }
}

