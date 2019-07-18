import * as crypto from "crypto";
import * as mongoose from "mongoose";
import * as services from "./services";

export const SecuritySchema = function securitySchema() {
    const questions = services.createMongooseSchema({
        question: {type: String, required: true, unique: true},
        answer: {type: String, required: true},
    });

    return services.createMongooseSchema({        
        password: {type: String, required: true},
        questions: [questions]
    });
}
export function authenticate(useremail: String, password: String, callback: Function) {
    callback({message: 'authenticate not available',hashid: 'system access identifer'});
}

export function generateSecurityAnswer(answer: string) {    
    const encryptedAnswer = generateEncryptedData(answer.trim());

    return encryptedAnswer;
}

export function generateSecurityPassword(useremail: string, textPassword) {
    const encryptedPassword = generateEncryptedData(textPassword.trim(), useremail.trim());

    return encryptedPassword;   
}

export function generateQuestion(question: string, answer: string) {
    const encryptedAnswer = generateSecurityAnswer(answer.trim());

    return {question: question, answer: encryptedAnswer};
}

export function generate(useremail: string, textPassword: string, questions?: any) {
    const encryptedPassword = generateSecurityPassword(textPassword, useremail);
    const securityModel = {password: encryptedPassword};

    if(questions) {
        console.debug(`${useremail} with ${questions.length} questions`);
        
        securityModel["questions"] = new Array();
        
        for(var question in questions) {
            const questionModel = generateQuestion(question["question"], question["answer"]);
            securityModel["questions"].push(questionModel);
        }
    }
    
    return securityModel;
}

export function generateOne(useremail: string, textPassword, question: string, answer: string) {
    return generate(useremail, textPassword, 
        [ {question: question, answer: answer} ]);
}

export function newSponorSecurity(useremail: string, securityModel: any, callback: Function) {
    var model = services.getModel("sponsor");
    
    if(!securityModel["password"]) {
        console.debug(`${securityModel}: not a valid ${SecuritySchema()} schema`);
        callback("Sponsor security creation issue. Contact system administrator");
        return;
    }

    model.findOneAndUpdate({useremail: useremail}, {$set: {security: securityModel}}, (error, res) => {
        callback(error, res);
    });
}

export function verifyUniqueUserField(field: string, value: string, callback: Function) {
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

function generateEncryptedData(data: string, salt: string = 'Rescue Shelter: Security Question Answer') {
    const encryptedData = crypto.pbkdf2Sync(data, salt, 100, 256, 'aes');
    return encryptedData.toString('hex');
}

function verifyUniqueUserName(name: string, callback: Function) {
    var model = services.getModel("sponsor");
    
    model.findOne({useremail: name}, (error,doc)=> {
        callback(error,{unique: !doc});
    });
}

function verifyUniqueUserEmail(email: string, callback: Function) {
    var model = services.getModel("sponsor");

    model.findOne({useremail: email}, (error,doc) => {
        callback(error,{unique: !doc});
    });
}