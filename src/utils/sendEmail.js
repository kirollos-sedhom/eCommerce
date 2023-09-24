import nodemailer from "nodemailer";
import { User } from "../../DB/models/user.model.js";
export const sendEmail = async ({ to, subject, html, attachments }) => {
  // sender
  const transporter = nodemailer.createTransport({
    // recieves a really cool object
    host: "localhost", // or the host of the service im using to send emails
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASS,
    },
  });
  // reciever
  const emailInfo = await transporter.sendMail({
    from: `"Route Academy" <${process.env.EMAIL}>`, // the name of the company sending the mail
    to,
    subject,
    html,
    attachments,
  });
  return emailInfo.accepted.length < 1 ? false : true;
};
