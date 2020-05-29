var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var { vars } = require('../models/varModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get('/', function (req, res, next) {
    vars.getAllvars()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((err) => {
            res.statusMessage = 'Try again later.' + err.message;
            return res.status(500).end();
        });
});

router.get('/:name', function (req, res, next) {
    let name = req.params.name;
    vars.getVarByName(name)
        .then((result) => {
            if (!result) {
                res.statusMessage = 'Var not found';
                return res.status(404).end();
            }
            return res.status(200).json(result);
        })
        .catch((err) => {
            res.statusMessage = 'Try again later.' + err.message;
            return res.status(500).end();
        });
});

router.patch('/:name', jsonParser, function (req, res, next) {
    const name = req.params.name;
    let params = {}
    
    if(req.body.value)
        params['value'] = req.body.value;
    
    vars.updateVar(name,params)
        .then((result) => {
            if (!result) {
                res.statusMessage = 'Var not found';
                return res.status(404).end();
            }
            return res.status(202).json(result);
        })
        .catch((err) => {
            res.statusMessage = 'Try again later.' + err.message;
            return res.status(500).end();
        });
});

router.post('/new', jsonParser, function (req, res, next) {
    let id = uuid.v4();
    const keysString = ["name","value"];

    for (let i in keysString) {
        if (!req.body[keysString[i]]) {
            res.statusMessage = 'Parameter Missing: ' + keysString[i];
            return res.status(406).end();
        }
    }
    
    for (let i in keysString) {
        if (typeof req.body[keysString[i]] !== 'string') {
            res.statusMessage = keysString[i] + 'must be a string';
            return res.status(409).end();
        }
    }

    let newVar = {
        id: id,
        name: req.body["name"],
        value: req.body["value"],
    };
    
    vars.createVar(newVar)
        .then((var_) => {
            return res.status(201).json(var_);
        })
        .catch((err) => {
            res.statusMessage =
                'Something is wrong with the Database - Try again later! ' +
                err.message;
            return res.status(500).end();
        });
});


module.exports = router;