const User  = require('../models/user');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");

const cors = require('./cors');
const mailerConfig = require('../mailer-config');

userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/signup')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.post(cors.corsWithOptions, (req,res) => {
    User.findOne({phone: req.body.phone})
    .then((user ) => {
        if (user) {
            res.statusCode = 409;
            res.setHeader('Content-Type', 'application/json');
            res.json({message:'User with the phone "'+user.phone+'" already exist'});
            return;
        }
        User.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
                res.statusCode = 409;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: 'User with the email "'+user.email+'" already exist'});
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
                            console.log(data);
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

userRouter.route('/user')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.post(cors.corsWithOptions, (req, res) => {
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
.put(cors.corsWithOptions, (req, res) => {
    if (req.body.session) {
        fieldToUpdate = req.body.fieldToUpdate;
        User.updateOne({email: JSON.parse(req.body.session)},
        {$set: {[fieldToUpdate]: req.body.value}})
        .then((result) => {
            if (result && result.modifiedCount > 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json();
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

userRouter.route('/user/resetpassword')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.post(cors.corsWithOptions, (req, res) => {
    let username = req.body.email;
    User.findOne({email: username})
    .then((user) => {
        if(user) {
            const jwtKey = "my_key";
            const jwtKeyExp = 300;
            const token = jwt.sign({username}, jwtKey, {
            algorithm: "HS256",
            expiresIn: jwtKeyExp
            });
            resetPass =  token.substr(-6);
            bcrypt.hash(resetPass, 10)
            .then((hash_pass) => {
                if (hash_pass) {
                    User.updateOne({email: username},
                        {$set: {password: hash_pass}
                    })
                    .then((result) => {
                        if(result) {
                            console.log("password saved");
                            let message = {
                                from: mailerConfig.user,
                                to: username,
                                subject: 'Password Reset',
                                html: `<p><b>Hello `+user.firstname.toUpperCase()+`,</b><br></p>
                                <p>Your request for password reset has been processed.Please see your new Password below.</p>
                                <p><b>New password: </b>`+resetPass+`</p><br><br>
                                <b>Thank You,<br>JC-TECHNOLOGY</b>`
                            };
                            mailerConfig.transporter.sendMail(message, (error, info) => {
                                if(error) {
                                    res.statusCode = 503;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({message: "Service unavailable"});
                                    return;
                                }
                                else {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type','application/json');
                                    res.json({message: "A new password has been sent to your mail"});
                                    return;
                                }
                            });
                        }
                        else {
                            res.statusCode = 412;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({message: 'Unable to reset password.'});
                            return;
                        }
                    }).catch((err) => {
                        res.statusCode = 500;
                        res.setHeader('Content-Type','application/json');
                        res.json({message: err});
                        return;
                    });
                }
            });
        }
        else{
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({message: 'You have not registered.'});
            return;
        }
    });
});

userRouter.route('/user/:id')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.delete(cors.corsWithOptions, (req, res) => {
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

userRouter.route('/login')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.post(cors.corsWithOptions, (req, res, next) => {
    User.findOne({email:req.body.email})
    .then((user) => {
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type','application/json');
            res.json({email_message: 'Invalid user'});
            console.log(user)
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
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.get(cors.cors, (req, res) => {
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
