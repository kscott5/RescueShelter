import * as mongoose from "mongoose";

console.log(`mongoosejs version: ${mongoose.version}`);

mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);

let __connectionString = 'mongodb://localhost:27017/rescueshelter';
let __connection = mongoose.createConnection(__connectionString, { useNewUrlParser: true } );

export const SPONSOR_MODEL_NAME = "sponsor";
export const ANIMAL_MODEL_NAME = "animal";
export const SECURITY_MODEL_NAME = "token";
export const TRACK_MODEL_NAME = "transaction";

export const SYSTEM_UNAVAILABLE_MSG = "system unavailable. please try later.";
export const SYSTEM_INVALID_USER_CREDENTIALS_MSG = "invalid useremail and/or password";
export const SYSTEM_SESSION_EXPIRED = "login, current session expired.";

export function createMongooseSchema(schemaDefinition: any, strictMode: boolean = true) {
    return new mongoose.Schema(schemaDefinition, {strict: strictMode});
}

export function createMongooseModel(modelName: string, modelSchema: mongoose.Schema<any> | Function) 
: mongoose.Model<mongoose.Document> {
    if(__connection.models[modelName] !== undefined)
        return __connection.models[modelName];

    var schema = (typeof modelSchema == 'function')?  modelSchema(): modelSchema;

    return __connection.model(modelName, schema);    
}

export function getModel(modelName: string) : mongoose.Model<mongoose.Document> {    
    if(__connection.models[modelName] !== undefined)
        return __connection.models[modelName];

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

export class Pagination {
    public pages: Number;
    public pageIndex: Number;
    public documents: Array<any>;

    constructor(pageCount: Number, pageCurrent: Number, data: Array<any>){
        this.pages = pageCount;
        this.pageIndex = pageCurrent;
        this.documents = data;
    }
}

    export class JsonResponse {
        constructor(){}

        createError(error: any) : any {
            return {
                ok: true,
                data: error,
            }
        }

        createData(data: any) : any {
            return {
                ok: true,
                data: data,
            }
        }

        createPagination(data: any, pageCount: Number = 1, pageCurrent: Number = 1) : any {
            return {
                ok: true,
                data: new Pagination(1,1, data)
            }
    } // end JsonResponse
} // end Services namespace