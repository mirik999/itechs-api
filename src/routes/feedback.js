import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/new-feedback', (req, res) => {
	// const { name, email, text, token } = req.body.data;
	//
	// nodemailer.createTestAccount((err, account) => {
	//
	// 	const transporter = nodemailer.createTransport("SMTP", {
	// 		host: 'smtp-mail.outlook.com',
	// 		secureConnection: false,
	// 		port: 587,
	// 		tls: {
	// 			ciphers:'SSLv3'
	// 		},
	// 		auth: {
	// 			user: 'miraliko@hotmail.com',
	// 			pass: 'xattab23'
	// 		}
	// 	})
	//
	// 	const mailOptions = {
	// 		from: `${name} - ${email}`,
	// 		to: 'miraliko@hotmail.com',
	// 		subject: `FeedBack from Devs.az`,
	// 		text: '',
	// 		html: `<p>${text}</p>`
	// 	};
	//
	// 	transporter.sendMail(mailOptions, (err, info) => {
	// 		if (err) {
	// 			return console.log(err)
	// 		}
	// 		console.log('message sent', info.messageId);
	// 	})
	//
	// })

})

export default router;