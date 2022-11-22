const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors')

const userRouter = require('./routes/userRouter');
const questionRouter = require('./routes/questionRouter');

const config = require('./config');
const assert = require('assert');

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

let corsOptions = {origin:"*"};
let server = http.createServer(app)

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));

app.use('/user', userRouter);
app.use('/question', questionRouter);

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.get("/", (req,res) => {
    res.json({maessage: "welcome"});
})

server.listen(PORT,() => {
    console.log(`server running on http://localhost:${PORT}`)
});


module.exports = app;

