"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailToMe = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
function sendEmail(head, email) {
    return __awaiter(this, void 0, void 0, function* () {
        // send mail with defined transport object
        let info = yield transporter.sendMail({
            from: 'Ayomide Ojutalayo', // sender address
            to: email,
            subject: 'Feedback Received',
            html: `
      <h1>Hi ${head}</h1>
      <p>Thanks for contacting me.</p>
      <p>You will get a response as soon as possible.</p>
    `,
        });
        console.log('Message sent: %s', info.messageId);
    });
}
exports.sendEmail = sendEmail;
function sendEmailToMe(head, email, subject, message) {
    return __awaiter(this, void 0, void 0, function* () {
        // send mail with defined transport object
        let info = yield transporter.sendMail({
            from: head, // sender address
            to: process.env.EMAIL_USER,
            subject: subject,
            html: `
      <h1>Hi, you've got a message from ${head}</h1>
      <p>Email Address: ${email}</p>
      <p>${subject}</p>
      <p>${message}</p>
    `,
        });
        console.log('Message sent: %s', info.messageId);
    });
}
exports.sendEmailToMe = sendEmailToMe;
