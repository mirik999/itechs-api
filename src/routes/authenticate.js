import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import User from '../models/user-model';
import parseErrors from '../utils/parseErrors';

const router = express.Router();

function toTitleCase(str)
{
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(" ", "");
}

router.post('/register', (req, res) => {
	const { uname, email, pass } = req.body.data;
	const uniqueNick = `${uname.trim()}${Math.floor(Math.random() * 100)}`;
	const avatar = `https://api.adorable.io/avatars/286/${uniqueNick}@adorable.png`;
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		username: toTitleCase(uname),
		email: email,
		useravatar: avatar,
		userip: ip
	})
	user.setPassword(pass)
	user
		.save()
		.then(userRecord => res.json({ user: userRecord.toAuth() }))
		.catch(err => {
			console.log(err)
			return res.status(400).json({ errors: { global: parseErrors(err.errors) }})
		})
})

router.post('/enter', (req, res) => {
	const { email, pass } = req.body.data;
	User.findOne({ email })
	.then(user => {
		if (user && user.isValidPassword(pass)) {
			res.json({ user: user.toAuth() })
		} else {
				res.status(400).json({errors: {global: "The data is not in the correct format"}})
		}
	})
});

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
      user.save().then((newUser) => res.json({ user: newUser.toAuth() }))
	      .catch(err => {
					console.log(err)
					return res.status(400).json({ errors: { global: parseErrors(err.errors) }})
				})
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
				user.save().then((newUser) => res.json({ user: newUser.toAuth() }))
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