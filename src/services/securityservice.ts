import {Application} from "express";
import * as bodyParser from "body-parser";
import * as crypto from "crypto";
import * as services from "./services";
import { callbackify } from "util";

export namespace SecurityService {
    let __authSelectionFields = "_id useremail username firstname lastname photo audit";

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

    services.createMongooseModel("token", services.createMongooseSchema({}, false /* disable schema strict */));
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

        const model = services.getModel("token");
        const update = new model({useremail: useremail, hashid: hashid, expiration: expires});

        var options = services.createFindOneAndUpdateOptions({_id: false, hashid: 1, expiration: 1}, true);
        model.findOneAndUpdate({useremail: useremail}, update, options, (error, product) => {
            (error)? callback(error, null) :
                callback(null, product["value"]);
        });
    }

    export function verifyHash(hashid: String, useremail: String, callback: Function) { 
        var model = services.getModel("token");

        model.findOne({hashid: hashid, useremail: useremail}, (err, doc) =>{
            (err)? callback(err, doc) :
                callback(err, {verified: doc != null });
        });
    }

    export function deauthenticate(hashid: String, useremail: String, callback: Function) { 

    } 

    export function authenticate(useremail: String, password: String, callback: Function) {
        const encryptedPassword = generateEncryptedData(password, useremail);

        const model = services.getModel("sponsor");
        
        model.findOne({$and: [{useremail: useremail, "security.password": encryptedPassword}]}, 
            __authSelectionFields, (error, doc) => {
            (error)? callback(error, null): 
                generateHashId(error, doc, (error, data) => {
                    (error)? callback(error, null):
                        callback(error, {hashid: data._doc.hashid /* find alternative */, sponsor: doc});
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

    export function publishWebAPI(app: Application) {
        let jsonBodyParser = bodyParser.json({type: 'application/json'});

        app.post("/api/secure/unique/sponsor", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            const field = req.body.field;
            const value = req.body.value;
            if(!field || !value) {                
                res.json(services.jsonResponse("HttpPOST body not available with request"));
            }

            verifyUniqueUserField(field, value, (error, data) => {
                    res.json(services.jsonResponse(error,data));
            });
        });

        app.post("/api/secure/data", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            const data = req.body.data;
            const secret = req.body.secret;            

            if(!data || !secret) {
                res.json(services.jsonResponse("HttpPOST: request body not available"));
            }

            res.json(services.jsonResponse(generateEncryptedData(data,secret)));
        });

        app.post("/api/secure/verify", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            var hashid = req.body.hashid;
            var useremail = req.body.useremail;

            if(!hashid || !useremail) {
                res.json(services.jsonResponse("HttpPOST body not availe with request"));
            }

            verifyHash(hashid, useremail, (error, data) => {
                res.json(services.jsonResponse(error, data));
            })
            
        }); // end /api/secure/verify

        app.post("/api/secure/deauth", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            var hashid = req.body.hashid;
            var useremail = req.body.useremail;

            if(!hashid || !useremail) {
                res.json(services.jsonResponse("HttpPOST body is not available."));
            }

            deauthenticate(hashid, useremail, (error, data) => {
                res.json(services.jsonResponse(error, data));
            });
        });

        app.post("/api/secure/auth", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            const useremail = req.body.useremail; // either useremail or username
            const password = req.body.password; // clear text password never saved

            if(!useremail || !password) {
                res.json(services.jsonResponse("HttpPOST: request body not available"));
            }

            authenticate(useremail, password, (error, data) =>{
                res.json(services.jsonResponse(error,data));
            });
        });

        app.post("/api/secure/registration", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            if(!req.body) {
                res.status(200);
                res.json(services.jsonResponse("HttpPOST json body not available"));
            }

            // generate the security object
            var item = req.body;
            var useremail = item.useremail;
            var password = item.password;

            item.security = generate(useremail, password);

            // create the new sponsor with security
            res.status(200);

            var model = services.getModel("sponsor");
            var sponsor = new model(item);

            sponsor.save(null, (err,doc)=>{
                    (err)? 
                        res.json(services.jsonResponse(err,doc)) :
                        
                        authenticate(useremail, password, (err, auth) =>{
                            res.json(services.jsonResponse(err,auth));
                        });
            }); // end save sponsor
        }); // end /api/secure/registration
    } // end publishWebAPI
} // end SecurityServices namespace