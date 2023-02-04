const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    username: {
        type: String
    },
    pwd: {
        type: String
    },
    roles: {
        type: String
    }
},
{
	timestamps: true
});

module.exports = mongoose.model('AdminUser',AdminSchema);