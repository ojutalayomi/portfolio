import { sendEmail, sendEmailToMe } from '@/utils/sendEmail';
import type { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(400).json({ message: 'Not Allowed!' });

    try{
        const { name, email, subject, message } = req.body;

        if (!validator.isEmail(email)) {
            console.log(`Received an invalid email: ${email}`);
            
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // const newForm = {
        //     name: name,
        //     email: email,
        //     subject: subject,
        //     message: message
        // };

        // console.log(newForm);
        await sendEmail(name, email);
        await sendEmailToMe(name, email, subject, message);
        return res.status(200).json({ message: 'Message sent.'})
    } catch (err){
      console.error('Error', err)
    }
}