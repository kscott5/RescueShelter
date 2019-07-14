import * as mongoose from "mongoose";

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

