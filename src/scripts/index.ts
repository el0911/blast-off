import emails from '../emails'
import beansEmaiils from '../beansEmails'
import formData from "form-data";
import Mail from "mailgun.js";
import path from "path";
import { promises as fsPromises } from "fs";
import { templatIntoLayouteMail } from '../notificationText';
import { parse } from 'csv-parse'
import fs from 'fs'

//gotten emails send
const filepath = path.join(__dirname, "../email.csv");

const mailgun = new Mail(formData);

const MAILINSTANCE = mailgun.client({ username: "Bsnaija", key: `${process.env.MAIL_API_KEY}`  });

interface emailsInterface {
    email: string;
    name?: string
}

interface emails {
    [key: string]: emailsInterface
}

const newEmailKulture: emails = emails
const emailListBeans: any = beansEmaiils
const sendAnEmail = async (emailAddress: string, email: string, subject: string) => {

    MAILINSTANCE.messages.create("beansio.app", {
        from: `${'el@beansio.app'}`,
        to: [emailAddress],
        subject: subject,
        html: email,
        // inline: [firstFile]
    }).then((msg: any) => {
        console.log(msg);
    }) // logs response data
        .catch((err: any) => {
            console.log(err);
        }); // logs any error

}


const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
const sendEmailList = async (newEmail: emails) => {
    const emailsToSend = []

    for (let i = 0; i < Object.keys(newEmail).length; i++) {
        const object = Object.keys(newEmail)[i];
        const temp: emailsInterface = newEmail[object]

        emailsToSend.push(sendAnEmail(temp['email'], templatIntoLayouteMail('addedslack', {
            email: temp['email'],
            name: temp['name']
        }), 'We just got useful, new slack integration '))
        console.log(`Sendinig eamil ${i}  maiils`)

    }

    console.log('Sendinig all maiils')
    await Promise.all(emailsToSend)
    console.log('Sent all maiils')

}

try {
    var data = fs.readFileSync(filepath, 'utf8');
    const allRows = data.toString().split('\n')
    allRows.forEach(element => {
        const row = element.split(',')
        const email = row[4]
        const first = row[0]
        if (validateEmail(email)) {
            MAILINSTANCE.messages.create("beansio.app", {
                from: `${'el@beansio.app'}`,
                to: email,
                subject: 'Having troubles understading users with audit logs?',
                template: "survey",
                'v:name': first
                // inline: [firstFile]
            }).then((msg: any) => {
             
            }) // logs response data
                .catch((err: any) => {
                });
        }else{
            console.log(email)
        }
    });
} catch (e: any) {
    console.log('Error:', e.stack);
}

// sendEmailList(emailListBeans)