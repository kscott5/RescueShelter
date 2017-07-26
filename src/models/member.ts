import * as mongoose from "mongoose";

var memberSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    dates: {
        created: Date,
        modified: Date,
        modifiedby: member
    },
    credentials: {
        username: String,
        password: String        
    }
});

var member = mongoose.model("Member", memberSchema);
export default member;