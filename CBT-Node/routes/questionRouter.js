const express = require('express');
const bodyParser = require('body-parser');
const Question = require('../models/question');
const User = require('../models/user');

questionRouter = express.Router();
questionRouter.use(bodyParser.json());


questionRouter.route('/')
.post((req, res) => {
    if (req.body.session) {
        User.findOne({email: JSON.parse(req.body.session)})
        .then((user) => {
            if (!user) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: 'You are not logged in'});
                return;
            }
            console.log('you are logged in as: ',JSON.parse(req.body.session));
            Question.find({}).then((questions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(questions)
            })
            .catch((err) => {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: 'Internal server error occur, please retry'});
                return;
            });

        }).catch((err) => {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({message: 'You are not logged in'});
            return;
        });
        
    }
    else {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({message: 'You are not logged in'});
        return;  
    }
    
});


questionRouter.route('/setquestion')
.post((req, res) => {
    Question.findOne({num: req.body.num})
    .then((data) => {
        if (data) {
            res.statusCode = 409;
            res.setHeader('Content-Type', 'application/json');
            res.json({message:' Duplicate question number'});
            return;
        }
        questions = new Question({
            num: req.body.num,
            question: req.body.question,
            corr_ans: req.body.corr_ans,
            option1: req.body.option1,
            option2: req.body.option2,
            option3: req.body.option3,
            option4: req.body.option4,
            ans1: req.body.ans1,
            ans2: req.body.ans2,
            ans3: req.body.ans3,
            ans4: req.body.ans4
        });
        questions.save().then((data) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(data); 
            console.log("Questions successfully added");      
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err:err});
            return;
        })
    })
    
});



questionRouter.route('/deleteall')
.delete((req, res) => {
    Question.deleteMany({}).then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:err});
        return;
    })
})

module.exports = questionRouter;