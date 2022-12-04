const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const newFileStore = require('session-file-store')(session);


const userRouter = require('./routes/userRouter');
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

let corsOptions = ({origin: ["http://localhost:4200"], credentials: true})
let server = http.createServer(app)

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge: 86400000}
    //store: newFileStore()
}));

app.use('/users', userRouter);
app.use('/question', questionRouter);

// parse requests of content-type - application/x-www-form-urlencoded
app.get("/", (req,res) => {
    res.json({maessage: "welcome"});
})

server.listen(PORT,() => {
    console.log(`server running on http://localhost:${PORT}`)
});


module.exports = app;

