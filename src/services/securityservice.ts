import {Application} from "express";
import * as bodyParser from "body-parser";
import * as crypto from "crypto";
import * as services from "./services";

export namespace SecurityService {
    export const SESSION_TIME = 900000; // 15 minutes = 900000 milliseconds
    
    class Track {
        request(action: any) {
            console.debug("Tracking transaction");
    
            var model = services.getModel(services.TRACK_MODEL_NAME);
            var obj = new model(action);
            
            obj.save((err, doc)=>{
                if(err !== null) {                
                    console.log("Error occurred with transaction tracker");
                    console.log(err);
                    throw new Error(err);
                }
            });
        } // end request
    } // end Track

    class Generate {
        constructor(){}

        security(useremail: String, textPassword: String, questions?: any) {
            const encryptedPassword = this.encryptedData(textPassword, useremail);
            const securityModel = {password: encryptedPassword};
    
            if(questions) {
                console.debug(`${useremail} with ${questions.length} questions`);
                
                securityModel["questions"] = new Array();
                
                for(const index in questions) {
                    const question = {
                            question: questions[index]["question"], 
                            answer: this.encryptedData(questions[index]["answer"])
                    };
    
                    securityModel["questions"].push(question);
                }
            }
            
            return securityModel;
        }
    
        securityWithQuestion(useremail: String, textPassword, question: String, answer: String) {
            return this.security(useremail, textPassword, 
                [ {question: question, answer: answer} ]);
        }        

        encryptedData(data: String, salt: String = 'Rescue Shelter: Security Question Answer') {
            const tmpData = data.trim();
            const tmpSalt = salt.trim();
    
            const encryptedData = crypto.pbkdf2Sync(tmpData, tmpSalt, 100, 50, 'sha256');
            const hexEncryptedData = encryptedData.toString('hex');
    
            return hexEncryptedData;
        }
    
        /**
         * 
         * @param doc authenicate sponor was ok
         */
        private hashId(doc: any) : Promise<any> {
            if(!doc)
                throw new Error(services.SYSTEM_INVALID_USER_CREDENTIALS_MSG);
    
            var now = new Date();
            var expires = new Date(now.getTime()+SESSION_TIME);
    
            var useremail = doc.useremail;
            console.debug(`generateHashId with ${useremail}`);
            
            var hashid = this.encryptedData(useremail, `${useremail} hash salt ${expires.getTime()}`);
    
            var tokenModel = services.getModel(services.SECURITY_MODEL_NAME);
            var update = new tokenModel({useremail: useremail, hashid: hashid, expires: expires.getTime()});
    
            var options = services.createFindOneAndUpdateOptions({_id: false, hashid: 1, expiration: 1}, true);
            return tokenModel.findOneAndUpdate({useremail: useremail}, update, options)
                .then(product => {return product["value"]} )
                .catch(err => {
                    console.log(err);
                    throw new Error(services.SYSTEM_UNAVAILABLE_MSG);
                });
        } // end hashId
    } // end Generate

    export class SecurityDb {
        private __authSelectionFields;
        private generate;

        constructor() {
            this.__authSelectionFields = "_id useremail username firstname lastname photo audit";    
        
            this.generate = new Generate();

            services.createMongooseModel(services.SECURITY_MODEL_NAME, services.createMongooseSchema({}, false /* disable schema strict */));

            services.createMongooseModel("transaction", () => {
                    var schema = services.createMongooseSchema({
                            name: {type: String, required: true},
                            sponsor_id: {type: {}, required: true},
                            data: {type: {}, required: true},
                            date: {type: Date, required: true}
                        }); 
                
                    schema.path("data").default(new Date());

                    return schema;
                }
            );
        } // end constructor

        static get schema() {
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

        deauthenticate(hashid: String, useremail: String) : Promise<any> { 
            var model = services.getModel(services.SECURITY_MODEL_NAME);

            return Promise.resolve(model.findOneAndRemove({hashid: hashid, useremail: useremail}));
        } 

        authenticate(useremail: String, password: String) : Promise<any> {
            const encryptedPassword = this.generate.encryptedData(password, useremail);

            // Format improves readable and increases the number of lines
            const now = new Date();
            const model = services.getModel(services.SPONSOR_MODEL_NAME);

            return model.aggregate([
                {
                    $lookup: { // left outer join on sponsor. token exists and valid
                        from: "tokens",
                        let: {sponsors_useremail: '$useremail'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {$eq: ['$useremail', '$$sponsors_useremail']},
                                            {$eq: ['$useremail', useremail]}
                                        ]
                                    }
                                }
                            },
                            {                    
                                $project: {
                                    _id: false, hashid: 1, useremail: 1, expires: 1, 
                                    expired: { $not: {$gt: ['$expires', now.getTime()] } }
                                }
                            }
                        ],
                        as: "token"
                    }        
                },
                {
                    $match: { $and: [{useremail: useremail, "security.password": encryptedPassword}] }
                },
                {
                $project: {
                    firstname: 1, lastname: 1, useremail: 1, username: 1, token: '$token'
                }}
            ])
            .limit(1)
            .then(doc => {
                if(doc.length === 0)
                    throw new Error(services.SYSTEM_INVALID_USER_CREDENTIALS_MSG);

                var sponsor = doc[0];                    
                if(sponsor.token.length === 1) { // session exists                        
                    var token = sponsor.token[0]; 
                    if(token.expired) 
                        throw new Error(services.SYSTEM_SESSION_EXPIRED);

                    sponsor.token = null;
                    return {hashid: token.hashid, sponsor: sponsor};
                } else { // session !exists                
                    return Promise.resolve(this.generate.hashId(sponsor)).then(data => {
                        return {hashid: data._doc.hashid /* find alternative */, sponsor: sponsor}});
                    
                }
            });        
        } // end authenticate

        newSponorSecurity(useremail: String, securityModel: any) : Promise<any> {
            const model = services.getModel(services.SPONSOR_MODEL_NAME);
            
            if(!securityModel["password"]) {
                console.debug(`${securityModel}: not a valid ${SecurityDb.schema} schema`);
                return Promise.reject("Sponsor security creation issue. Contact system administrator");
            }

            const options = services.createFindOneAndUpdateOptions();
            return Promise.resolve(model.findOneAndUpdate({useremail: useremail}, {$set: {security: securityModel}}, options));
        }

        verifyAccess(access: any) : Promise<any> {
            try {
                var accessType = access.accessType.trim().toLowerCase() || "not required";
                switch(accessType) {
                    case "not required"  || 0:
                        return Promise.resolve(true);

                    case "hashid" || 1:
                        return this.verifyHash(access.hashId, access.useremail);

                    case "uniqueuseremail" || 2:
                        return this.verifyUniqueUserEmail(access.email);
                    
                    case "uniqueusername" || 3:
                        return this.verifyUniqueUserName(access.username);

                    case "uniqueuserfield" || 4:
                        return this.verifyUniqueUserField(access.field, access.value);
                        
                    default:
                        console.debug(`Access Type: ${accessType} not valid`);
                        return Promise.resolve(false);
                }
            } catch(error) {
                console.debug("verify access type not valid");
                console.debug(error);
                
                return Promise.reject(error);
            }
        } // end verifyAccess

        private verifyHash(hashid: String, useremail: String) : Promise<any> { 
            var model = services.getModel(services.SECURITY_MODEL_NAME);

            return model.findOne({hashid: hashid, useremail: useremail})
                .then(doc => {return {verified: doc != null};});
        }

        private verifyUniqueUserField(field: String, value: String) : Promise<any> {
            switch(field.trim().toLowerCase()) {
                case "username":
                    return this.verifyUniqueUserName(value);

                case "useremail":
                    return this.verifyUniqueUserEmail(value);

                default:
                    console.log(`${field} is not a valid field`);
                    return Promise.reject({unique: false});
            }
        }

        private verifyUniqueUserName(name: String) : Promise<any> {
            const model = services.getModel(services.SPONSOR_MODEL_NAME);
            
            return model.findOne({useremail: name})
                .then(doc => { return {unique: !doc};});
        }

        private verifyUniqueUserEmail(email: String) : Promise<any> {
            const model = services.getModel(services.SPONSOR_MODEL_NAME);

            return model.findOne({useremail: email})
                .then(doc => { return {unique: !doc}});
        }
    } // end SecurityDb

    export function publishWebAPI(app: Application) {
        let jsonBodyParser = bodyParser.json({type: 'application/json'});
        let jsonResponse = new services.JsonResponse();
        
        let db = new SecurityDb();
        let generator = new Generate();
        
        app.post("/api/secure/unique/sponsor", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            const field = req.body.field;
            const value = req.body.value;
            if(!field || !value) {                
                res.json(jsonResponse.createError("HttpPOST body not available with request"));
            }

            Promise.resolve(this.db.verifyUniqueUserField(field, value))
                .then(data => res.json(jsonResponse.createData(data)))
                .catch(error => res.json(jsonResponse.createError(error)));
        });

        app.post("/api/secure/data", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            const data = req.body.data;
            const secret = req.body.secret;            

            if(!data || !secret) {
                res.json(jsonResponse.createError("HttpPOST: request body not available"));
            }

            res.json(jsonResponse.createData(this.generate.encryptedData(data,secret)));
        });

        app.post("/api/secure/verify", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            var hashid = req.body.hashid;
            var useremail = req.body.useremail;

            if(!hashid || !useremail) {
                res.json(jsonResponse.createError("HttpPOST body not availe with request"));
            }

            Promise.resolve(this.db.verifyHash(hashid, useremail))
                .then(data => res.json(jsonResponse.createData(data)))
                .catch(error => res.json(jsonResponse.createError(error)));            
        }); // end /api/secure/verify

        app.post("/api/secure/deauth", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            var hashid = req.body.hashid;
            var useremail = req.body.useremail;

            if(!hashid || !useremail) {
                res.json(jsonResponse.createError("HttpPOST body is not available."));
            }

            Promise.resolve(this.db.deauthenticate(hashid, useremail))
                .then(data => res.json(jsonResponse.createData(data)))
                .catch(error => res.json(jsonResponse.createError(error)));
        });

        /**
         * Authenticate the sponsor and generate app access hash id
         */
        app.post("/api/secure/auth", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            res.status(200);

            const useremail = req.body.useremail; // either useremail or username
            const password = req.body.password; // clear text password never saved

            if(!useremail || !password) {
                res.json(jsonResponse.createError("HttpPOST: request body not available"));
            }

            Promise.resolve(this.db.authenticate(useremail, password))
                .then(data => res.json(jsonResponse.createData(data)))
                .catch(error => res.json(jsonResponse.createError(error)));
        });

        /**
         * Registers then authenticate new sponsor
         */
        app.post("/api/secure/registration", jsonBodyParser, (req,res) => {
            console.debug(`POST: ${req.url}`);
            if(!req.body) {
                res.status(200);
                res.json(jsonResponse.createError("HttpPOST json body not available"));
            }

            // generate the security object
            var item = req.body;
            var useremail = item.useremail;
            var password = item.password;

            item.security = this.generate.security(useremail, password);

            // create the new sponsor with security
            res.status(200);

            var model = services.getModel(services.SPONSOR_MODEL_NAME);
            var sponsor = new model(item);

            var authPromise = Promise.resolve(this.db.authenticate(useremail, password));
            Promise.resolve(sponsor.save())
                .then(doc => authPromise)
                .then(auth => res.json(jsonResponse.createData(auth)))
                .catch(error => res.json(jsonResponse.createError(error)));
        }); // end /api/secure/registration
    } // end publishWebAPI
} // end SecurityServices namespace