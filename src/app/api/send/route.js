// app/api/send/route.js

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req, res) {
  const { email, subject, message } = await req.json();

  // Get the credentials from your environment variables
  const user = process.env.GMAIL_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD;

  // Create a transporter object using the default SMTP transport with Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });

  // Set up the email data
  const mailOptions = {
    from: user, // This will be your Gmail address
    to: user, // This is where you will receive the email (your own Gmail)
    replyTo: email, // This is the user's email, so you can reply to them directly
    subject: `Portfolio Contact: ${subject}`, // Prepend subject for clarity
    // Create a prettier HTML body for the email
    html: `
      <h2>New Message from Your Portfolio Contact Form</h2>
      <p><strong>From:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr />
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    // Return a success response
    return NextResponse.json({ status: 200, message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    // Return an error response
    return NextResponse.json({ status: 500, message: "Failed to send email" }, { status: 500 });
  }
}