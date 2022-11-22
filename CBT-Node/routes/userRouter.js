let User  = require('../models/user');
const express = require('express');
const bodyParser = require('body-parser');


userRouter = express.Router();
userRouter.use(bodyParser.json())

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
                user = new User({
                    firstname : req.body.firstname,
                    lastname : req.body.lastname,
                    gender: req.body.gender,
                    phone : req.body.phone,
                    middlename : req.body.middlename,
                    email: req.body.email,
                    password: req.body.password
                });
                
                user.save().then((data) => {
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
        });
    }).catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});
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
})

userRouter.route('/login')
.post((req, res) => {
    User.findOne({email:req.body.email})
    .then((user) => {
        if (!user) {
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.send('Invalid credentials');
            return;
        } 
        else if (user && user.password != req.body.password) {
            res.statusCode = 401;
            res.setHeader('Content-Type','application/json');
            res.send('Your password is incorresct');
            return;
        } 
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/text');
            res.send('You are Logged in Successfully');
        }
    })
})



module.exports = userRouter;
