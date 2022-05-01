// EXPRESS MODULES
import createError from 'http-errors';
import express, { NextFunction } from 'express';

// MONGO MODULES
import mongoose, {mongo} from 'mongoose';

// AUTHENTICATION MODULES
import session from "express-session";
import passport from "passport";
import passportLocal from "passport-local";
import flash from 'connect-flash';

// JWT modules
import cors from 'cors';
import passportJWT from 'passport-jwt';

// JWT aliases
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

// authentication model and stratefy alias
let localStrategy = passportLocal.Strategy;

// import User Model
import User from '../Models/user';


import authRouter from '../Routes/auth';
import contactListRouter from '../Routes/contact-list';

const app = express();

import * as DBConfig from './db';

mongoose.connect(DBConfig.RemoteURI);

const db = mongoose.connection;
db.on('error', function()
{
  console.error('connection error');
});

db.once('open', function(){
  console.log(`Connected to MongoDB at: ${DBConfig.Host}`);
});

// add cors
app.use(cors());

// setup express session
app.use(session({
  secret: DBConfig.SessionSecret,
  saveUninitialized: false,
  resave: false
}));

// init flash
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// implement ath strat
passport.use(User.createStrategy());

// serialize/deserialize the user data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//JWT options
let jwtOptions = 
{
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: DBConfig.SessionSecret
}

// JWT Strategy
let strategy = new JWTStrategy(jwtOptions, function(jwt_payload, done)
{
  User.findById(jwt_payload.id)
    .then(user => {
      return done(null, user);
    })
    .catch(err => {
      return done(err, false);
    });
});

passport.use(strategy);

// router config

app.use('/api', authRouter);
app.use('/api', passport.authenticate('jwt', {session: false}), contactListRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
  next(createError(404));
});

// error handler
app.use(function(err: createError.HttpError, req: express.Request, 
  res: express.Response, next: NextFunction) 
  {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render("error", {message: err.message, error: err, title: '', page: '', displayName: ''});
  res.json({ success: true, message: err.message, error: err, title: '', page: '', displayName: ''})
});

export default app;
