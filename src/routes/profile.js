import express from 'express';
import mongoose from 'mongoose';
import Profile from '../models/profile-model';

const router = express.Router();

router.post('/get-my-profile', (req, res) => {
	const email = req.body.data;
	Profile.findOne({ user: email })
		.then(profile => {
			if (profile) {
				res.json({ profile })
			} else {
				res.json({ profile: {} })
			}
		})
})

router.post('/editing', (req, res) => {
	const { data } = req.body;
	Profile.findOne({ user: data.email })
		.then(profile => {
			if (profile) {
				if (data.about) {
					Profile.findOneAndUpdate({ user: data.email }, { $set: { "about": data.about  } }, (err, profile) => {
						if (err) return res.status(400).json({ WentWrong: "Wrong edit profile" })
					})
				}
				if (data.portfolio) {
					Profile.findOneAndUpdate({ user: data.email }, { $set: { "portfolio": data.portfolio  } }, (err, profile) => {
						if (err) return res.status(400).json({ WentWrong: "Wrong edit profile" })
					})
				}
				if (data.contact) {
					Profile.findOneAndUpdate({ user: data.email }, { $set: { "contact": data.contact  } }, (err, profile) => {
						if (err) return res.status(400).json({ WentWrong: "Wrong edit profile" })
					})
				}
			} else {
				const profile = new Profile({
					_id: new mongoose.Types.ObjectId(),
					user: data.email,
					about: data.about,
					portfolio: data.portfolio,
					contact: data.contact
				})
				profile.save()
					.then(profile => res.json({ profile }))
					.catch(err => res.status(400).json({ WentWrong: "Something went wrong when editing profile" }))
			}
		})
})

export default router;