const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');
const session = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken')

const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const questionRouter = require('./routes/questionRouter');

const config = require('./config');

const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const url = config.mongoUrl;
const dbname = config.dbname;

const connect = mongoose.connect(url+dbname);
connect.then((db) => {
    console.log('Connected to server successfully');
}, (err) => {console.log(err)});


let app = express();

let server = http.createServer(app);


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan('tiny'));
app.use(cors({credentials:true}));

app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/question', questionRouter);

server.listen(PORT,() => {
    console.log(`server running on http://localhost:${PORT}`)
});


module.exports = app;

