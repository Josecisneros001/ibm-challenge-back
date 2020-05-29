const createError = require('http-errors');
const express = require('express');
const cors = require('./middleware/cors');
const dotenv = require('dotenv');
var { mongoose } = require('./db/mongoose');
var patientsRouter = require('./routes/patients');

var app = express();
dotenv.config();

app.use(cors);
app.use('/patient', patientsRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

app.listen( 3001, ()=>{
    console.log("This server is running on port 3001.")
});

module.exports = app;