const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    num: {
        type: Number,
        unique: [true, 'num already exist']
    },
    question: {
        type: String,
        default: ''
    },
    corr_ans: {
        type: String
    },
    option1: {
        type: String
    },
    option2: {
        type: String
    },
    option3: {
        type: String
    },
    option4: {
        type: String
    },
    ans1: {
        type: String
    },
    ans2: {
        type: String
    },
    ans3: {
        type: String
    },
    ans4: {
        type: String
    }
});


module.exports = mongoose.model('Question', questionSchema);