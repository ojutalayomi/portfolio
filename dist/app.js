"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const path_1 = require("path");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
// Google API modules
const googleapis_1 = require("googleapis");
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
/*
app.get('/home',(req: Request, res: Response, next: NextFunction) => {
    const name: string = 'Ayomide';
    res.render('home', { name });
});*/
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
