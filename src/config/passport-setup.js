import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GitHubStrategy from 'passport-github2';
import User from '../models/user-model';
// keys
import keys from './keys';

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
	.then((user) => {
		done(null, user);
	})
});

passport.use(
  new FacebookStrategy({
    clientID: keys.fblogin.clientID,
    clientSecret: keys.fblogin.clientSecret,
    callbackURL: '/auth/fb/redirect',
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)']
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id })
		.then((currentUser) => {
			if (currentUser) {
        console.log(currentUser);
				done(null, currentUser);
			} else {
				new User({
					username: profile.name.givenName,
					facebookId: profile.id,
					useravatar: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'
				})
				.save()
				.then((newUser) => {
          console.log(newUser);
					done(null, newUser);
				})
			}
		})
  })
)

passport.use(
  new GitHubStrategy({
    clientID: keys.gtlogin.clientID,
    clientSecret: keys.gtlogin.clientSecret,
    callbackURL: '/auth/gt/redirect'
  }, (accessToken, refreshToken, profile, done) => {
		User.findOne({ githubId: profile.id })
		.then((currentUser) => {
			if (currentUser) {
        console.log(currentUser);
				done(null, currentUser);
			} else {
				new User({
					username: profile.username,
					githubId: profile.id,
					useravatar: profile._json.avatar_url
				})
				.save()
				.then((newUser) => {
          console.log(newUser);
					done(null, newUser);
				})
			}
		})
  })
)