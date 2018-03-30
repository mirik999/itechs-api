import express from 'express';
import mongoose from 'mongoose';
import Profile from '../models/profile-model';

const router = express.Router();

router.get('/get-profile/:email', (req, res) => { 
	const { email } = req.params;
	Profile.findOne({ user: email }, (err, profile) => {
		if (err) res.status(400).json({ WentWrong: "Something went wrong when getting profile" })
		res.json({ profile })
	})
})

router.put('/editing/:email', (req, res) => {
	const { email, about, portfolio, contact, github } = req.body.data;
		Profile.findOneAndUpdate({ user: email }, { $set: { about, portfolio, contact, github	} }, (err, profile) => {
			if (err) return res.status(400).json({ WentWrong: "Wrong edit profile" })
			res.json({ edited: true })
		})
})

router.put('/change-cover/:email', (req, res) => {
	const { bgImg, smallImage, email } = req.body.data;
	Profile.findOneAndUpdate({ user: email }, { $set: { bgImg, smallImage } }, (err, profile) => {
		if (err) res.status(400).json({ WentWrong: "Something went wrong when changing profile cover image" })
		res.json({ profile })
	})
})


export default router;