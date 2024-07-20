import {env} from "~/env"
import nodemailer from "nodemailer";
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transportOptions: SMTPTransport.Options = {
  service: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT),
  secure: true, 
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
};

export const transporter = nodemailer.createTransport(transportOptions);
