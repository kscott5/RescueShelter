import * as crypto from "crypto";
import * as services from "./services";
import { string } from "prop-types";

export const SecuritySchema = function securitySchema() {
    const questions = services.createMongooseSchema({
        _id: false,
        question: {type: String, required: true, unique: true},
        answer: {type: String, required: true},
    });

    return services.createMongooseSchema({        
        _id: false,
        password: {type: String, required: true},
        questions: [questions]
    });
}

export const SESSION_TIME = 15; //minutes

services.createMongooseModel("validator", services.createMongooseSchema({}));
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

    const useremail = doc["useremail"];    
    const hashid = generateEncryptedData(useremail, `${useremail} hash salt ${expires.getTime()}`);

    const model = services.getModel("validator");
    const hash = new model({_id: useremail, hashid: hashid, expiration: expires});
    hash.save((error, product) => {
        if(product)  {
            doc["hashid"] = product;

            callback(error, doc);
            return;
        }

        callback(error, product);
    });
}

export function authenticate(useremail: String, password: String, callback: Function) {
    const encryptedPassword = generateEncryptedData(password, useremail);

    const model = services.getModel("sponsor");
    
    model.findOne({useremail: useremail, security: {password: encryptedPassword}}, (error, doc) =>{
        generateHashId(error, doc, callback);
    });
}

export function generateSecurityAnswer(answer: String) {    
    const encryptedAnswer = generateEncryptedData(answer.trim());

    return encryptedAnswer;
}

export function generateSecurityPassword(useremail: String, textPassword) {
    const encryptedPassword = generateEncryptedData(textPassword.trim(), useremail.trim());

    return encryptedPassword;   
}

export function generateQuestion(question: String, answer: String) {
    const encryptedAnswer = generateSecurityAnswer(answer.trim());

    return {question: question, answer: encryptedAnswer};
}

export function generate(useremail: String, textPassword: String, questions?: any) {
    const encryptedPassword = generateSecurityPassword(textPassword, useremail);
    const securityModel = {password: encryptedPassword};

    if(questions) {
        console.debug(`${useremail} with ${questions.length} questions`);
        
        securityModel["questions"] = new Array();
        
        for(const index in questions) {
            const questionModel = generateQuestion(questions[index]["question"], questions[index]["answer"]);
            securityModel["questions"].push(questionModel);
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

function generateEncryptedData(data: String, salt: String = 'Rescue Shelter: Security Question Answer') {
    const encryptedData = crypto.pbkdf2Sync(data.toString(), salt.toString(), 100, 50, 'sha256');
    return encryptedData.toString('hex');
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