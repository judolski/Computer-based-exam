const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
	firstname: {
		type: String,
		default: ''
	},
	lastname: {
		type: String,
		default: ''
	},
	middlename: {
        type: String
    },
    gender: {
        type: String
    },
    phone: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
},
{
	timestamps: true
}
    );

//userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',userSchema);