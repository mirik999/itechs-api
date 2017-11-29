import express from 'express'; 
import axios from 'axios';
import fetch from 'node-fetch';
import User from '../models/user-model'; 

const router = express.Router();

router.post('/facebook', (req, res) => {
  User.findOne({ facebookId: req.body.data.id })
  .then((currentUser) => {
    if (currentUser) {
      res.json({ user: currentUser.toAuth() })
    } else {
      const user = new User({
        username: req.body.data.name,
        email: req.body.data.email,
        facebookId: req.body.data.id,
        useravatar: req.body.data.picture.data.url
      })
      user.save().then((newUser) => {
        res.json({ user: newUser.toAuth() })
      })
      .catch(err => res.status(400).json({ errors: err.errors }))
    }
  })
});

router.post('/google', (req, res) => {
	User.findOne({ googleId: req.body.data.googleId })
		.then((currentUser) => {
			if (currentUser) {
				res.json({ user: currentUser.toAuth() })
			} else {
				const user = new User({
					username: req.body.data.name,
					email: req.body.data.email,
					googleId: req.body.data.googleId,
					useravatar: req.body.data.imageUrl
				})
				user.save().then((newUser) => {
					res.json({ user: newUser.toAuth() })
				})
				.catch(err => res.status(400).json({ errors: err.errors }))
			}
		})
});

const allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
};

router.post('/github', allowCrossDomain, (req, res) => {
  const { data } = req.body;
	axios.post('http://github.com/login/oauth/access_token', { data })
		.then(data => console.log(data))
		.catch(err => console.log('error'))
});

export default router;