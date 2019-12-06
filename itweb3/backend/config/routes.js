'use strict';

// Module dependencies
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const User = mongoose.model('User');
const secret = process.env.SECRET || 'hemmelige_hest';

module.exports = router => {
    // User routes
    router.post('/user/register', (req, res, next) => {
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                console.log(err);
                res.status(400).json({ message: err });
            }
            if (info != undefined){
                console.log(info.message);
                res.status(400).json({ message: info.message });
            }
            else {
                req.logIn(user, err => {
                    const data = {
                        name: req.body.name,
                        username: req.body.email,
                    };
                    let _id = mongoose.mongo.ObjectId(user._id);
                    User.findOne({ _id }).then(user => {
                        user
                            .update({
                                name: data.name,
                                username: data.username,
                            })
                            .then(() => {
                                console.log('User created in database');
                                res.status(200).json({ message: 'Success' });
                            });
                    });
                });
            }
        })(req, res, next);
    });

    router.post('/user/login', (req, res, next) => {
        passport.authenticate('login', (err, user, info) => {
            if (err) {
                console.log(err);
                res.status(400).json({ message: err });
            }
            if (info != undefined) {
                console.log(info.message);
                res.status(400).json({ message: info.message });
            }
            else {
                req.logIn(user, err => {
                    let _id = mongoose.mongo.ObjectId(user._id);
                    User.findOne({ _id }).then(user => {
                        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
                        res.status(200).json({
                            auth: true,
                            token: token,
                            message: 'Success',
                        });
                    });
                });
            }
        })(req, res, next);
    });

    router.ws('/', (ws, req) => {
        ws.on('message', (msg) => {
          console.log(msg);
        });
    });
};