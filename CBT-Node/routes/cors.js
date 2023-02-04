const express = require('express');
const cors = require('cors');
const app = express();

const whiteList = ['http://localhost:3000', 'http://localhost:4200'];
const corsOptionDelegate = (req, callback) => {
    let corsOptions;

    if(whiteList.indexOf(req.header('Origin')) != -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
}

app.use(cors(corsOptionDelegate, {credentials:true}));

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionDelegate);