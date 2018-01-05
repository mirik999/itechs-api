import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/new-feedback', (req, res) => {
	const { name, text, email } = req.body.data;

		const smtpTransport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'tech.devs.az@gmail.com',
				pass: "developers2017"
			}
		});

		const mailOptions = {
			from: `${name}`,
			to: 'miraliko@hotmail.com',
			subject: 'FeedBack from Devs.az',
			html: `<p>${text}<br><br>sent by: <strong>${name} - ${email}</strong></p>`
		};

		smtpTransport.sendMail(mailOptions, (err, info) => {
			if (err) return res.status(400).json({ sendEmail: "Error when sending the feedback" })
			res.json({ feedback: "Sended" })
			smtpTransport.close();
		})

})

export default router;