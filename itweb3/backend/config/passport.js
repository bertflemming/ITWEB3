'use strict';

// Module dependencies

const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const secret = process.env.SECRET || 'hemmelige_hest';

passport.serializeUser((user, callback) =>
    callback(null, user.email));

passport.deserializeUser((email, callback) =>
    User.findOne({ email: email }, function(err, user){
        if (err) { return callback(err); }
        callback(null, user);
    }));

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        },
        (email, password, done) => {
            try {
                User.findOne({ email }).then(user => {
                    if (user === null){
                        return done(null, false, { message: 'Invalid email' });
                    } else {
                        bcrypt.compare(password, user.hashedPassword).then(response => {
                            if (!response) {
                                console.log('Invalid password');
                                return done(null, false, { message: 'Invalid password' });
                            }
                            console.log('Successfully authenticated');
                            return done(null, user);
                        });
                    }
                })
            } catch(err) {
                done(err);
            }
        }
    )
);

passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
            session: false,
        },
        (req, email, password, done) => {
            try {
                User.findOne({ email }).then(user => {
                    if (user != null){
                        console.log('Email already taken');
                        return done(null, false, { message: 'Email already taken'});
                    } else {
                        bcrypt.hash(password, 10).then(hash => {
                            const user = new User({
                                email: email,
                                name: req.body.name,
                                hashedPassword: hash,
                            });
                            user.save().then(user => {
                                console.log('User created');
                                return done(null, user);
                            });
                        });
                    }
                });
            } catch(err) {
                done(err);
            }
        }
    )
);

const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
};

passport.use(
    'jwt',
    new JWTStrategy(options, (jwtPayload, done) => {
        try{
            let _id = mongoose.mongo.ObjectId(jwtPayload.id);
            User.findOne({ _id }).then(user => {
                if (user) {
                    console.log('User found in database');
                    done(null, user);
                } else {
                    console.log('User not found in database');
                    done(null, false);
                }
            });
        } catch(err) {
            done(err);
        }
    })
);