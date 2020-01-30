import { Router } from 'express';
import passport from 'passport';

import { googleUserScopes, googleAnalyticsScopes, IS_DEVELOPMENT_MODE } from '../../config';

const router = Router();

// Route to log in using Google OAuth
router.get('/user/login', passport.authenticate('user', {
  scope: googleUserScopes
}));

// Callback URL for Google OAuth for users - redirects to user dashboard
router.get('/user/redirect', passport.authenticate('user'), (req, res) => {
  const url = IS_DEVELOPMENT_MODE ? 'http://localhost:3000' : 'https://wolfgang-analytics.netlify.com';
  res.redirect(url);
});

// Route to register an analytics account using Google OAuth
// @ts-ignore
router.get('/analytics-account/register', passport.authenticate('analytics-account', {
  scope: googleAnalyticsScopes,
  prompt: 'consent',
  // @ts-ignore
  accessType: 'offline'
}));

// Callback URL for Google OAuth for analytics accounts
router.get('/analytics-account/redirect', passport.authenticate('analytics-account', { session: false }), (req, res) => {
  const url = IS_DEVELOPMENT_MODE ? 'http://localhost:3000' : 'https://wolfgang-analytics.netlify.com';
  res.redirect(url);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect(`${req.hostname}/login`);
});

export default router;