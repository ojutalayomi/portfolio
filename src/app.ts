import { config } from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import { json, urlencoded } from 'body-parser';

// Core Node.js modules
import { writeFileSync, readFileSync } from 'fs';
import { join as _join } from 'path';
import os from 'os';
import cluster from 'cluster';

// Third-party modules
import nodemailer from 'nodemailer';
import validator from 'validator';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Google API modules
import { google } from 'googleapis';
import { sendEmail, sendEmailToMe } from './sendEmail';
const { OAuth2 } = google.auth;

// 
// import { home } from './routes/home';

config();

const app: Application = express();
app.use(cookieParser());

// Use body-parser to parse form data
app.use(json({ limit: '7mb' }));
app.use(urlencoded({ extended: true, limit: '7mb' }));


// Serving static files
app.use(express.static(_join(__dirname, '../public')));
app.use(express.static(__dirname));

app.use(cors());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', _join(__dirname, 'views'));

// app.use(home);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.render('index');
});

app.post('/contact', async(req: Request, res: Response) => {
    try{
        const { name, email, subject, message } = req.body;

        if (!validator.isEmail(email)) {
            console.log(`Received an invalid email: ${email}`);
            
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const newForm = {
            name: name,
            email: email,
            subject: subject,
            message: message
        };

        console.log(newForm);
        await sendEmail(name, email);
        await sendEmailToMe(name, email, subject, message);
        return res.status(200).json({ message: 'Message sent.'})
    } catch (err){
      console.error('Error', err)
    }
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