const createError = require('http-errors');
const express = require('express');
var path = require('path');
const cors = require('./middleware/cors');
const dotenv = require('dotenv');
var { mongoose } = require('./db/mongoose');
var patientsRouter = require('./routes/patients');
var varsRouter = require('./routes/vars');

var app = express();
dotenv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors);
app.use('/patient', patientsRouter);
app.use('/var', varsRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;