import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user-model';
import _ from 'lodash';

const router = express.Router();

router.get('/get-profile/:email', (req, res) => { 
	const { email } = req.params;
	User.findOne({ email })
	.populate('myFollows.user', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
	.populate('followedUsers.user', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
	.exec((err, userprofile) => {
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

router.put('/change-avatar/:email', (req, res) => {
	const { avatar, sAvatar, email } = req.body.data;
	User.findOneAndUpdate({ email }, { $set: { useravatar: avatar, userSavatar: sAvatar } }, { new: true })
	.populate('myFollows.user', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
	.populate('followedUsers.user', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
	.exec((err, userprofile) => {
		if (err) res.status(400).json({ WentWrong: "Something went wrong when changing profile cover image" })
		res.json({ userprofile })
	})
})


// follow =-=-= best system ever
router.post('/follow-user', (req, res, next) => {
	// kimi follow edirsen 1-ci ozune elave olunur
	const { myID, followUserID } = req.body.data;

	User.findOne({ _id: myID }, (err, user) => {
		
		const check = user.myFollows.filter(user => user.user == followUserID)

		if (_.isEmpty(check)) {
			User.findByIdAndUpdate(user._id, 
				{$push: { 
					myFollows: { 
						user: followUserID 
					} 
				}}, {new: true}, 
		    (err, usr) => {
				if(err)	return res.status(400).json({ myFollows: "Something went wrong" }); 
				next();
			});
		} else {
			User.findByIdAndUpdate(user._id, {
				$pull: { 
					myFollows: { 
						user: followUserID 
					} 
				}}, {new: true}, 
			(err, usr) => {
				if(err)	return res.status(400).json({ myFollows: "Something went wrong" }); 
				next();
			});
		}
	})

}, (req, res) => {
	// 2-c onun sxemasina
	const { myID, followUserID } = req.body.data;

	User.findOne({ _id: followUserID }, (err, user) => {

		const check = user.followedUsers.filter(user => user.user == myID)

		if (_.isEmpty(check)) {
			User.findByIdAndUpdate(user._id, {
				$push: { 
					followedUsers: { 
						user: myID 
					} 
				}}, {new: true}, 
			(err, usr) => {
				if(err)	return res.status(400).json({ followedUsers: "Something went wrong" }); 
				else return res.json({ userprofile: usr });
			});
		} else {
			User.findByIdAndUpdate(user._id, {
				$pull: { 
					followedUsers: { 
						user: myID 
					} 
				}}, {new: true}, 
			(err, usr) => {
				if(err)	return res.status(400).json({ followedUsers: "Something went wrong" }); 
				else return res.json({ userprofile: usr });
			});
		}
	})
})

export default router;