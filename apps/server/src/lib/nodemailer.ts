import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	auth: {
		pass: process.env.NODEMAILER_APP_PASSWORD,
		user: process.env.NODEMAILER_USER,
	},
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
});

export default transporter;
