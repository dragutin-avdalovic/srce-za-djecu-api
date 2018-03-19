import express from 'express';
import bodyParser from 'body-parser';
import db from './config/database';
import json2xls from 'json2xls';

const app = express();
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to DB');
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(json2xls.middleware);

/**
 * ROUTES
 */
const users = require('./routes/users/index');
const accessCard = require('./routes/access-card/index');
const socialCard = require('./routes/social-card/index');
const volunteers = require('./routes/volunteers/index');

app.use('/api/v1/', users);
app.use('/api/v1/', accessCard);
app.use('/api/v1/', socialCard);
app.use('/api/v1/', volunteers);

app.listen(3000, () => console.log('W-API listening on port 3000!'));
