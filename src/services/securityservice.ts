import * as crypto from "crypto";
import * as services from "./services";

export const SecuritySchema = function securitySchema() {
    const question = services.createMongooseSchema({
        _id: false,
        question: {type: String, required: true},
        answer: {type: String, required: true},
    });

    return services.createMongooseSchema({        
        _id: false,
        password: {type: String, required: true},
        questions: [question]
    });
}

export const SESSION_TIME = 15; //minutes

services.createMongooseModel("validator", services.createMongooseSchema({}, false /* disable schema strict */));
/**
 * 
 * @param err authenticate sponsor was not ok
 * @param doc authenicate sponor was ok
 * @param callback publish results of complete authentication process
 */
function generateHashId(err: any, doc: any, callback: Function) {
    if(err) {
        callback(err,doc);
        return;
    }

    const expires = new Date();
    expires.setMinutes(SESSION_TIME);

    const useremail = doc.useremail || 'no email';    
    console.debug(`generateHashId with ${useremail}`);
    
    const hashid = generateEncryptedData(useremail, `${useremail} hash salt ${expires.getTime()}`);

    const model = services.getModel("validator");
    const hash = new model({useremail: useremail, hashid: hashid, expiration: expires});
    hash.save((error, product) => {
        callback(error, product);
    });
}        (error)?  callback(error, null) :


export function authenticate(useremail: String, password: String, callback: Function) {
    const encryptedPassword = generateEncryptedData(password, useremail);

    const model = services.getModel("sponsor");
    
    model.findOne({$and: [{useremail: useremail, "security.password": encryptedPassword}]}, (error, doc) =>{
        (error)? callback(error, null): 
            generateHashId(error, doc, (error, data) => {
                (error)? callback(error, null):
                    callback(error, {hashid: data.hashid, sponsor: doc});
            });
    });
}

export function generate(useremail: String, textPassword: String, questions?: any) {
    const encryptedPassword = generateEncryptedData(textPassword, useremail);
    const securityModel = {password: encryptedPassword};

    if(questions) {
        console.debug(`${useremail} with ${questions.length} questions`);
        
        securityModel["questions"] = new Array();
        
        for(const index in questions) {
            const question = {
                    question: questions[index]["question"], 
                    answer: generateEncryptedData(questions[index]["answer"])
            };

            securityModel["questions"].push(question);
        }
    }
    
    return securityModel;
}

export function generateOne(useremail: String, textPassword, question: String, answer: String) {
    return generate(useremail, textPassword, 
        [ {question: question, answer: answer} ]);
}

export function newSponorSecurity(useremail: String, securityModel: any, callback: Function) {
    const model = services.getModel("sponsor");
    
    if(!securityModel["password"]) {
        console.debug(`${securityModel}: not a valid ${SecuritySchema()} schema`);
        callback("Sponsor security creation issue. Contact system administrator");
        return;
    }

    const options = services.createFindOneAndUpdateOptions();
    model.findOneAndUpdate({useremail: useremail}, {$set: {security: securityModel}}, options, (error, doc) => {
        callback(error, doc);
    });
}

export function verifyUniqueUserField(field: String, value: String, callback: Function) {
    switch(field.trim().toLowerCase()) {
        case "username":
            verifyUniqueUserName(value, callback);
            break;
        case "useremail":
            verifyUniqueUserEmail(value, callback);
            break;
        default:
            callback("value exists");
            break;
    }
}

export function generateEncryptedData(data: String, salt: String = 'Rescue Shelter: Security Question Answer') {
    const tmpData = data.trim();
    const tmpSalt = salt.trim();

    const encryptedData = crypto.pbkdf2Sync(tmpData, tmpSalt, 100, 50, 'sha256');
    const hexEncryptedData = encryptedData.toString('hex');

    return hexEncryptedData;
}

function verifyUniqueUserName(name: String, callback: Function) {
    const model = services.getModel("sponsor");
    
    model.findOne({useremail: name}, (error,doc)=> {
        callback(error,{unique: !doc});
    });
}

function verifyUniqueUserEmail(email: String, callback: Function) {
    const model = services.getModel("sponsor");

    model.findOne({useremail: email}, (error,doc) => {
        callback(error,{unique: !doc});
    });
}