const express = require('express');
const bodyParser = require('body-parser');

const fs = require("fs");

const AdminUser = require('../models/admin');
const Question = require('../models/question');
const User = require('../models/user');
const authenticate = require('../authenticate');

const cors = require('./cors');

const adminRouter = express.Router();
adminRouter.use(bodyParser.json());


adminRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.post(cors.corsWithOptions, authenticate.isAuthenticated, (req, res) => {
    AdminUser.findOne({username:req.body.session})
    .then((user) => {
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type','application/json');
            res.json({errMsg: 'Invalid username'});
            return;
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json'); 
            res.json({session: user.username, role:user.roles});
            return;
        }
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});
        return;
    });
});

adminRouter.route('/login')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.post(cors.corsWithOptions, (req, res) => {
    AdminUser.findOne({username:req.body.username, pwd: req.body.password})
    .then((user) => {
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type','application/json');
            res.json({message: 'Invalid username or password'});
            return;
        }
        else {
            let username = user.username;
            let token = authenticate.generateToken(username);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({username: username, token: token});
            return;
        }
    })
    .catch((err) => {
        console.log(err)
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({message: err.error});
        return;
    });
});

adminRouter.route('/refreshToken')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.post(cors.cors, authenticate.isAuthenticated, (req, res) => {
    let username = req.body.username;
    let token = authenticate.generateToken(username);
    if (token) {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({token: token});
        return;
    }
    else {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({message: "Unable to generate token"});
        return;
    }
})

adminRouter.route('/questions')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.get(cors.cors, authenticate.isAuthenticated, (req, res) => {
    Question.find({}).then((questions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(questions)
        return;
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({message: 'Internal server error occur, please retry'});
        return;
    });
    
});

adminRouter.route('/questions/question')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.put(cors.corsWithOptions, authenticate.isAuthenticated, (req, res) => {
    Question.updateMany({_id:req.body.dataToUpdate}, req.body.formValue)
    .then((result) => {
        if (result.modifiedCount > 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result);
            console.log(result);
            return;
        }
    }).catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});
        return;
    });
})

adminRouter.route('/questions/question/:id')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.delete(cors.corsWithOptions, authenticate.isAuthenticated, (req, res) => {
    Question.deleteOne({_id: req.params.id})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result); 
    })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});
        return;   
    });
})
.get(cors.cors, authenticate.isAuthenticated, (req, res) => {
    Question.findOne({_id: req.params.id})
    .then((question) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(question);
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({message: 'Internal server error occur, please retry'});
        return;
    });
});


adminRouter.route('/users')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200; })
.get(cors.cors, authenticate.isAuthenticated, (req, res) => { 
    User.find({}).then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(users);
    })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.json({message: err});
        return;
    });
});

adminRouter.route('/users/user')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.put(cors.corsWithOptions, authenticate.isAuthenticated, (req, res) => {
    User.updateOne({_id: req.body.dataToUpdate}, req.body.formValue)
    .then((result) => {
        if (result.modifiedCount > 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({message: 'Updated successfully'}); 
            console.log('Update successful')
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

adminRouter.route('/users/user/:id')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus = 200;})
.get(cors.cors, authenticate.isAuthenticated, (req, res) => {
    data = JSON.parse(req.params.id);
    User.findOne({[data.queryField]: data.value})
    .then((user) => {
        if(user) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(user);
            return;
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type','application/json');
            res.json({message: "No record found"});
            return;
        }
        
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});
        return;
    })
})
.put(cors.corsWithOptions, authenticate.isAuthenticated, (req, res) => {
    User.updateOne({_id: req.params.id},
    {$set: {score: ""}})
    .then((result) => {
        if (result) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result); 
            return;
        }
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({message: 'Unable to complete, please contact the administrator'});
        return;
    });
})
.delete(cors.corsWithOptions, authenticate.isAuthenticated,(req, res) => {
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
});

module.exports = adminRouter;