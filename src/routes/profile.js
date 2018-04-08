import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user-model';
import _ from 'lodash';

const router = express.Router();

router.get('/get-profile/:email', (req, res) => { 
	const { email } = req.params;
	User.findOne({ email }, (err, userprofile) => {
		if (err) res.status(400).json({ WentWrong: "Something went wrong when getting profile" })
		res.json({ userprofile })
	})
})

router.get('/get-profile-by-name/:name', (req, res) => { 
	const { name } = req.params;
	User.findOne({ username: name }, (err, userprofile) => {
		if (err) res.status(400).json({ WentWrong: "Something went wrong when getting profileByName" })
		res.json({ userprofile })
	})
})

router.put('/editing/:email', (req, res) => {
	const { email, about, portfolio, contact, github } = req.body.data;
		User.findOneAndUpdate({ email }, { $set: { about, portfolio, contact, github	} }, (err, user) => {
			if (err) return res.status(400).json({ WentWrong: "Wrong edit profile" })
			res.json({ edited: true })
		})
})

router.put('/change-cover/:email', (req, res) => {
	const { bgImg, smallImage, email } = req.body.data;
	User.findOneAndUpdate({ email }, { $set: { bgImg, smallImage } }, (err, userprofile) => {
		if (err) res.status(400).json({ WentWrong: "Something went wrong when changing profile cover image" })
		res.json({ userprofile })
	})
})


// follow
router.post('/follow-user', (req, res, next) => {
	// kimi follow edirsen 1-ci ozune elave olunur
	const { followUserEmail, followUserName, myEmail } = req.body.data;

	User.findOne({ email: myEmail }, (err, user) => {
		
		const check = user.myFollows.filter(user => user.followedUserEmail === followUserEmail)

		if (_.isEmpty(check)) {
			User.findByIdAndUpdate(user._id, {$push: { myFollows: { "followedUserName": followUserName, "followedUserEmail": followUserEmail,  } }}, 
			{safe: true}, (err, usr) => {
				if(err)	return res.status(400).json({ myFollows: "Something went wrong" }); 
				next();
			});
		} else {
			User.findByIdAndUpdate(user._id, {$pull: { myFollows: { "followedUserName": followUserName, "followedUserEmail": followUserEmail,   } }}, 
			{safe: true}, (err, usr) => {
				if(err)	return res.status(400).json({ myFollows: "Something went wrong" }); 
				next();
			});
		}
	})

}, (req, res) => {
	// 2-c onun sxemasina
	const { followUserEmail, myUserName, myEmail } = req.body.data;

	User.findOne({ email: followUserEmail }, (err, user) => {

		const check = user.followedUsers.filter(user => user.followedUserEmail === myEmail)

		if (_.isEmpty(check)) {
			User.findByIdAndUpdate(user._id, {$push: { followedUsers: { "followedUserName": myUserName, "followedUserEmail": myEmail,  } }}, 
			{safe: true}, (err, usr) => {
				if(err)	return res.status(400).json({ followedUsers: "Something went wrong" }); 
				else return res.json({ followedUsers: true });
			});
		} else {
			User.findByIdAndUpdate(user._id, {$pull: { followedUsers: { "followedUserName": myUserName, "followedUserEmail": myEmail,   } }}, 
			{safe: true}, (err, usr) => {
				if(err)	return res.status(400).json({ followedUsers: "Something went wrong" }); 
				else return res.json({ followedUsers: false });
			});
		}
	})
})

export default router;