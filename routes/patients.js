var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var { patients } = require('../models/patientModel');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get('/', function (req, res, next) {
    patients.getAllpatients()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((err) => {
            res.statusMessage = 'Try again later.' + err.message;
            return res.status(500).end();
        });
});

router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    patients.getPatientById(id)
        .then((result) => {
            if (!result) {
                res.statusMessage = 'Patient not found';
                return res.status(404).end();
            }
            return res.status(200).json(result);
        })
        .catch((err) => {
            res.statusMessage = 'Try again later.' + err.message;
            return res.status(500).end();
        });
});

router.patch('/:id', jsonParser, function (req, res, next) {
    const id = req.params.id;
    let params = {}
    
    if(req.body.ECGresult)
        params['ECGresult'] = {
            normal: req.body.ECGresult.normal,
            veb: req.body.ECGresult.veb,
            svt: req.body.ECGresult.svt,
            fusion: req.body.ECGresult.fusion,
        };
    
    if(req.body.ImgResult)
        params['ImgResult'] = {
            normal: req.body.ImgResult.normal || 0,
            pneumonia: req.body.ImgResult.pneumonia || 0,
            covid19: req.body.ImgResult.covid19 || 0,
        };
    
    if(req.body.xRayImg)
        params['xRayImg'] = req.body["xRayImg"];
    
    patients.updatePatient(id,params)
        .then((result) => {
            if (!result) {
                res.statusMessage = 'Patient not found';
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
    let keysString = ["firstName", "lastName", "dob", "reason", "bloodType"];
    let keysNumber = ["ECGid", "room", "update"];
    let ECGresult;
    if(req.body.ECGresult)
        ECGresult = {
            normal: req.body.ECGresult.normal || 0,
            veb: req.body.ECGresult.veb || 0,
            svt: req.body.ECGresult.svt || 0,
            fusion: req.body.ECGresult.fusion || 0,
        };
    else
        ECGresult = {
            normal: 0,
            veb: 0,
            svt: 0,
            fusion: 0,
        };
    let ImgResult;
    if(req.body.ImgResult)
        ImgResult = {
            normal: req.body.ImgResult.normal || 0,
            pneumonia: req.body.ImgResult.pneumonia || 0,
            covid19: req.body.ImgResult.covid19 || 0,
        };
    else
        ImgResult = {
            normal: 0,
            pneumonia: 0,
            covid19: 0,
        };
    
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
    
    for (let i in keysNumber) {
        if (typeof req.body[keysNumber[i]] !== 'number') {
            res.statusMessage = keysNumber[i] + 'must be a number';
            return res.status(409).end();
        }
    }
    
    let newPatient = {
        id: id,
        firstName: req.body["firstName"],
        lastName: req.body["lastName"],
        dob: req.body["dob"],
        reason: req.body["reason"],
        room: req.body["room"],
        update: req.body["update"],
        bloodType: req.body["bloodType"],
        genre: req.body["genre"],
        ECGresult: ECGresult,
        ECGid: req.body["ECGid"],
        xRayImg: req.body["xRayImg"],
        ImgResult: ImgResult
    };
    
    patients.createPatient(newPatient)
        .then((patient) => {
            return res.status(201).json(patient);
        })
        .catch((err) => {
            res.statusMessage =
                'Something is wrong with the Database - Try again later! ' +
                err.message;
            return res.status(500).end();
        });
});


module.exports = router;