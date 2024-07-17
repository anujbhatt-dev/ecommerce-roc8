import {env} from "~/env"
import nodemailer from "nodemailer";
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Define the transport options
const transportOptions: SMTPTransport.Options = {
  service: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
};

// Create the Nodemailer transporter
export const transporter = nodemailer.createTransport(transportOptions);
