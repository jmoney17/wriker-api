import express, { Request, Response, NextFunction } from 'express';

import passport from 'passport';

import User from '../Models/user';
import { GenerateToken } from '../Util/index';

// Process Functions
export function ProcessLoginPage(req: Request, res: Response, next: NextFunction): void
{
    passport.authenticate('local', (err, user, info) => {
        // are there server errors?
        if (err) {
          console.error(err);
          res.end(err);
        }

        // are there login errors?
        if (!user) {
          return res.json({ sucess: false, msg: 'ERROR: Authentication Error' });
        }

        req.logIn(user, function (err) {
          // are there db errors?
          if (err) {
            console.error(err);
            res.end(err);
          }

          const authToken = GenerateToken(user);

          //console.log(authToken);
          return res.json({
            success: true, msg: 'User Logged in Successfully!', user: {
              id: user._id,
              DisplayName: user.DisplayName,
              username: user.username,
              EmailAddress: user.EmailAddress
            }, token: authToken
          });
        });
        return;
      })(req, res, next);
}

export function ProcessRegisterPage(req: Request, res: Response, next: NextFunction): void
{
    // instantiate a new user object
  let newUser = new User
  ({
    username: req.body.username,
    EmailAddress: req.body.emailAddress,
    DisplayName: req.body.firstName + " " + req.body.lastName
  });

  User.register(newUser, req.body.password, (err) => {
      if (err) {
        if (err.name == "UserExistsError") {
          console.error('ERROR: User Already Exists!');
        }
        console.error(err.name); // other error
        return res.json({ success: false, msg: 'Error: Registration Failed!' });
      }

      return res.json({ success: true, msg: 'User Registered Successfully!', user: newUser });

      // automatically login the user
      // return passport.authenticate('local')(req, res, function()
      // {
      //   return res.redirect('/contact-list');
      // });
    });
}

export function ProcessLogoutPage(req: Request, res: Response, next: NextFunction): void
{
  req.logOut();

  res.json({success: true, msg: 'User Logged Out Successfully!'});
}