import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { get } from 'lodash';

import { passportUserConfig, passportAnalyticsAccountConfig } from '../../config';
import User, { UserDocument } from '../users/model';
import AnalyticsAccount from '../analytics-accounts/model';

passport.serializeUser((user: UserDocument, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      done(error);
    });
});

// Initialises passport settings for Wolfgang Digital employee login & registration
passport.use('user', new OAuth2Strategy(passportUserConfig, (accessToken, refreshToken, profile, done) => {
  const email = get(profile, 'emails[0].value');

  // Check if this is a valid Wolfgang Digital email address
  if (!email.match(/@wolfgangdigital.com$/)) {
    done('A valid Wolfgang Digital account is required');
  } else {
    // Check to see if a user with this email exists
    User.findOne({ email })
      .then(existingUser => {
        // If the user exists use that user
        if (existingUser) {
          done(null, existingUser);
        } else {
          // Else create a new user and use that
          User.create({
            firstName: get(profile, 'name.givenName'),
            lastName: get(profile, 'name.familyName'),
            email,
            profilePicture: get(profile, 'photos[0].value')
          })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(done);
        }
      })
      .catch(done);
  }
}));

// Initialises passport settings for Google Analytics accounts
passport.use('analytics-account', new OAuth2Strategy({
  ...passportAnalyticsAccountConfig,
  accessType: 'offline'
}, (accessToken, refreshToken, profile, done) => {
  const email = get(profile, 'emails[0].value');

  // Check if this is a valid Wolfgang Digital email address 
  if (!email.match(/@wolfgangdigital.com$/)) {
    done('A valid Wolfgang Digital analytics account is required');
  } else {
    // Check to see if this account already exists
    AnalyticsAccount.findOne({ email })
      .then(existingAccount => {
        if (existingAccount) {
          // If an account already exists show an error
          done('This account has already been registered');
        } else {
          // Else create a new one
          AnalyticsAccount.create({
            email,
            accessToken,
            refreshToken
          })
            .then(newAccount => {
              done(null, newAccount);
            })
            .catch(done);
        }
      })
      .catch(done);
  }
}));

export default passport;