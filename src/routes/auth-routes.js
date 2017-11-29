import express from 'express';
import passport from 'passport';

const router = express.Router();

// facebook oauth
router.get('/facebook2', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/fb/redirect2', passport.authenticate('facebook'), (req, res) => {
  res.redirect('http://localhost:3000/profile')
});

// github oauth
router.get('/github', passport.authenticate('github', {
  scope: ['profile']
}));

router.get('/gt/redirect', passport.authenticate('github'), (req, res) => {
  res.redirect('http://localhost:3000/profile')
});

// logout
router.post('/logout', (req, res) => {
  res.send('logout')
});

export default router;
