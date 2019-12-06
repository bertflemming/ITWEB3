'use strict';

// Module dependencies
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const User = mongoose.model('User');
const Highscore = mongoose.model('HighScore');
const secret = process.env.SECRET || 'hemmelige_hest';
const atob = require('atob');

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
          console.log('Message received: '+msg);
          if(msg.split(' ').length === 2){
                let n = parseInt(msg.split(' ')[1]);
                var query = Highscore.find({ n: n}).sort({'score':-1}).limit(10).then(function(scores) {
                    scores.forEach(s => {
                        User.findOne({ _id: s.user}).then(user => {
                            if (user) {
                                console.log("found user");
                            } else {
                                console.log("failed");
                            }
                        });
                    });
                    /* let reply = []
                    scores.forEach(s => {
                        reply.push(User.findOne({_id: mongoose.mongo.ObjectId(s.user)}) + " " + s.score);
                    });
                    console.log(reply);
                    ws.send(JSON.stringify(reply));
                    */ 
                });
          } else {
                let jwtString = msg.split(';')[0].split('.')[1];
                let jwtPayload = JSON.parse(atob(jwtString));
                let n = msg.split(';')[1];
                let score = msg.split(';')[2];
                try{
                    let _id = mongoose.mongo.ObjectId(jwtPayload.id);
                    User.findOne({ _id }).then(user => {
                        if (user) {
                            console.log('User found in database');
                            console.log(user);
                            var highscore = new Highscore({
                                score: score,
                                n: n,
                                user: _id,
                            });
                            highscore.save(function (err){
                                if (err){
                                    console.log('Highscore was NOT saved');
                                }
                                else {
                                    console.log('Highscore was saved');
                                }
                            });
                            // done(null, user);
                        } else {
                            console.log('User not found in database');
                            // done(null, false);
                        }
                    });
                } catch(err) {
                    done(err);
                }
          }
          
        });
    });
};