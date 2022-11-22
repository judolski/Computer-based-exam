const express = require('express');
const bodyParser = require('body-parser');
const Question = require('../models/question');

questionRouter = express.Router();
questionRouter.use(bodyParser.json());

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
            res.json({Error:err});
            return;
        })
    })
    
});

questionRouter.route('/')
.get((req, res) => {
    Question.find({}).then((questions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(questions)
    })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({Error:err});
        return;
    })
});

questionRouter.route('/:questionNum')
.get((req, res) => {
    Question.findOne({num: req.params.questionNum})
    .then((question) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(question);
    })
    .catch((err) => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json(err);
        return;
    })
})

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
        res.json({Error:err});
        return;
    })
})

module.exports = questionRouter;