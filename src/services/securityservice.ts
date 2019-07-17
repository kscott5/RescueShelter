import * as crypto from "crypto";
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

function generateEncryptedData(data: string, salt: string = 'Rescue Shelter: Security Question Answer') {
    // Key length is dependent on the algorithm. In this case for aes 256, it is
    // 256/8bits or 32 bytes.

    const key = crypto.scryptSync(data, salt, 32);
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv('aes-256-ccm', key, iv);

    let encryptedData = '';
    cipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = cipher.read())) {
            encryptedData += chunk.toString('hex');
        }
    });

    return encryptedData;
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

export function generate(useremail: string, textPassword: string, question?: any) {
    const encryptedPassword = generateSecurityPassword(textPassword, useremail);
    const securityModel = {password: encryptedPassword};

    if(question && question["question"] && question["anwer"]) {
        const questionModel = generateQuestion(question["question"], question["answer"]);
        securityModel["question"] = [
            questionModel
        ]
    }

    return securityModel;
}

export function generateModel(useremail: string, textPassword, question: string, answer: string) {
    return generate(useremail, textPassword, {
        question: question, answer: answer
    });
}