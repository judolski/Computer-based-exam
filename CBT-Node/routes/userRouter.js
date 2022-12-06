const User  = require('../models/user');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/signup')
.post((req,res) => {
    User.findOne({phone: req.body.phone})
    .then((user ) => {
        if (user) {
            res.statusCode = 409;
            res.setHeader('Content-Type', 'application/json');
            res.json({message:'User with the phone: ' +user.phone+ ' already exist'});
            return;
        }
        User.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
                res.statusCode = 409;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: 'User with the email: ' +user.email+ ' already exist'});
                return;
            }
            else {
               bcrypt.hash(req.body.password, 10)
               .then((hash) => {
                    if (hash) {
                        user = new User({
                            firstname : req.body.firstname,
                            lastname : req.body.lastname,
                            gender: req.body.gender,
                            phone : req.body.phone,
                            middlename : req.body.middlename,
                            email: req.body.email,
                            password: hash
                        });
                        
                        user.save().then((data) => {
                            console.log(hash);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({message:'Registration Successful'});
                        })
                        .catch((err) => {
                            res.statusCode = 500;
                            res.setHeader('Content-Type','application/json');
                            res.json({err: err});
                            return;
                        });
                    }
                })
            }
        });
    }).catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({err: err.message});
        return;
    })
})


userRouter.route('/')
.get((req, res) => { 
    User.find({}).then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(users);
    })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});
        return;
    });
})
.delete((req, res) => {
    User.deleteMany({}).then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(users); 
    })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});
        return;   
    });
});

userRouter.route('/user')
.post((req, res) => {
    if (!req.body.session) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({message: 'You are not logged in'});
        return;
    }
    if (req.body.session) {
        User.findOne({email: JSON.parse(req.body.session)})
        .then((user) => {
            if (user) {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(user);
            }
            else {
                console.log('You are not logged in')
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: 'User not found.'});
                return;
            }
             
        })
        .catch((err) => {
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({err: err});
            return;
        })
    } 
})
.put((req, res) => {
    if (req.body.session) {
        User.updateOne({email: JSON.parse(req.body.session)},
        {$set: {score: JSON.parse(req.body.score)}})
        .then((result) => {
            if (result && result.matchedCount > 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({message: 'Score submitted'}); 
                console.log(req.body.score)
                return;
            }
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({message: 'Unable to complete, please contact the administrator'});
            return;
        });
    }
});

userRouter.route('/user/:id')
.delete((req, res) => {
    console.log(req.params.id);
    User.deleteOne({_id: req.params.id}).then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result); 
        console.log(result);
    })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});
        return;   
    });
})
.put((req, res) => {
        console.log(req.params.id)
        User.updateOne({_id: req.params.id},
        {$set: {score: ""}})
        .then((result) => {
            if (result && result.matchedCount > 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({message: 'Score submitted'}); 
                console.log('Score saved')
                return;
            }
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({message: 'Unable to complete, please contact the administrator'});
            return;
        });
});




userRouter.route('/login')
.post((req, res, next) => {
    User.findOne({email:req.body.email})
    .then((user) => {
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type','application/json');
            res.json({email_message: 'Invalid user'});
            return;
        } 
        if (user) {
            bcrypt.compare(req.body.password, user.password)
            .then((result) => {
                if (result) {
                    req.session.regenerate((err) => {
                        if (err) {return next(err) }

                        req.session.user = user;

                        req.session.save((err) => {
                            if (err) { return next(err) }

                            console.log("you are logged in as " +req.session.user.email)
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json({message: 'You are Logged in Successfully!', redirect: 'http://localhost:4200/questions', userSession: req.session.user});
                        });
                    
                    });
                }
                else {
                    res.statusCode = 401;
                    res.setHeader('Content-Type','application/json');
                    res.json({password_message: 'Your password is incorresct'});
                    return;
                }
            })
            .catch((err) => {
                res.statusCode = 500;
                res.setHeader('Content-Type','application/json');
                res.json({err: err});
                return;
            });
        } 
    });
});

userRouter.route('/logout')
.get((req, res) => {
    console.log(req.session.user);
    req.session.destroy((err) => {
        if(err) { res.end(err) }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({message: 'you are logged out successfully'}) 
        }
    });   
});


module.exports = userRouter;
