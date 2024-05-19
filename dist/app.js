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
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const path_1 = require("path");
const validator_1 = __importDefault(require("validator"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
// Google API modules
const googleapis_1 = require("googleapis");
const sendEmail_1 = require("./sendEmail");
const { OAuth2 } = googleapis_1.google.auth;
// 
// import { home } from './routes/home';
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Use body-parser to parse form data
app.use((0, body_parser_1.json)({ limit: '7mb' }));
app.use((0, body_parser_1.urlencoded)({ extended: true, limit: '7mb' }));
// Serving static files
app.use(express_1.default.static((0, path_1.join)(__dirname, '../public')));
app.use(express_1.default.static(__dirname));
app.use((0, cors_1.default)());
// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', (0, path_1.join)(__dirname, 'views'));
// app.use(home);
app.get('/', (req, res, next) => {
    res.render('index');
});
app.post('/contact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, subject, message } = req.body;
        if (!validator_1.default.isEmail(email)) {
            console.log(`Received an invalid email: ${email}`);
            return res.status(400).json({ error: 'Invalid email address' });
        }
        const newForm = {
            name: name,
            email: email,
            subject: subject,
            message: message
        };
        // console.log(newForm);
        yield (0, sendEmail_1.sendEmail)(name, email);
        yield (0, sendEmail_1.sendEmailToMe)(name, email, subject, message);
        return res.status(200).json({ message: 'Message sent.' });
    }
    catch (err) {
        console.error('Error', err);
    }
}));
/*
app.get('/home',(req: Request, res: Response, next: NextFunction) => {
    const name: string = 'Ayomide';
    res.render('home', { name });
});*/
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
