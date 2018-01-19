import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import User from '../models/user-model';
import Profile from '../models/profile-model';
import parseErrors from '../utils/parseErrors';

const router = express.Router();

router.post('/fblogin', (req, res) => {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  User.findOne({ facebookId: req.body.data.id })
  .then((currentUserFace) => {
    if (currentUserFace) {
      res.json({ user: currentUserFace.toAuth() })
    } else {
	    //user
      const user = new User({
	      _id: new mongoose.Types.ObjectId(),
        username: req.body.data.name,
        email: req.body.data.email,
        facebookId: req.body.data.id,
        useravatar: req.body.data.picture.data.url,
	      userip: ip
      })
      user.save().then((newUser) => {
	      //profile
	      const profile = new Profile({ _id: new mongoose.Types.ObjectId(), user: newUser.email })
	      profile.save().catch(err => res.status(400).json({ errors: { global: "error when creating user profile" }}))
	      // return user
        res.json({ user: newUser.toAuth() })
      })
	      .catch(err => res.status(400).json({ errors: { global: parseErrors(err.errors) }}))
    }
  })
});

router.post('/gglogin', (req, res) => {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	User.findOne({ googleId: req.body.data.googleId })
		.then((currentUserGoogle) => {
			if (currentUserGoogle) {
				res.json({ user: currentUserGoogle.toAuth() })
			} else {
				const user = new User({
					_id: new mongoose.Types.ObjectId(),
					username: req.body.data.name,
					email: req.body.data.email,
					googleId: req.body.data.googleId,
					useravatar: req.body.data.imageUrl,
					userip: ip
				})
				user.save().then((newUser) => {
					//profile
					const profile = new Profile({ _id: new mongoose.Types.ObjectId(), user: newUser.email })
					profile.save().catch(err => res.status(400).json({ errors: { global: "error when creating user profile" }}))
					// return user
					res.json({ user: newUser.toAuth() })
				})
					.catch(err => res.status(400).json({ errors: { global: parseErrors(err.errors) }}))
			}
		})
});


// router.post('/github', (req, res) => {
//   const { data } = req.body;
// 	axios.post('https://github.com/login/oauth/access_token', { data })
// 		.then(data => console.log(data))
// 		.catch(err => console.log('error'))
// });

export default router;