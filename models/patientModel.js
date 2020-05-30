const mongoose = require('mongoose');


const patientSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    room: {
        type: Number,
        required: true,
    },
    update: {
        type: Number,
        required: true,
    },
    bloodType: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    ECGresult: {
        normal: {
            type: Number,
            default: 0,
        },
        veb: {
            type: Number,
            default: 0,
        },
        svt: {
            type: Number,
            default: 0,
        },
        fusion: {
            type: Number,
            default: 0,
        }
    },
    ECGid: {
        type: Number,
        required: true,
        default: 0,
    },
    xRayImg: {
        type: String,
        default: '',
    },
    ImgResult: {
        normal: {
            type: Number,
            default: 0,
        },
        pneumonia: {
            type: Number,
            default: 0,
        },
        covid19: {
            type: Number,
            default: 0,
        }
    }

});

const patientCollection = mongoose.model('patients', patientSchema);

const patients = {
    createPatient: function (newPatient) {
        return patientCollection
            .create(newPatient)
            .then((patientRes) => {
                return patientRes;
            })
            .catch((err) => {
                throw new Error(err);
            });
    },
    getAllpatients: function () {
        return patientCollection
            .find()
            .then((allpatients) => {
                return allpatients;
            })
            .catch((err) => {
                return err;
            });
    },
    updatePatient: function (id, params) {
        return patientCollection
            .findOneAndUpdate({ id: id }, { $set: params }, { new: true })
            .then((patient) => {
                return patient;
            })
            .catch((err) => {
                return err;
            });
    },
    getPatientById: function (id) {
        return patientCollection
            .findOne({ id: id })
            .then((patient) => {
                return patient;
            })
            .catch((err) => {
                return err;
            });
    },
};

module.exports = { patients, patientSchema };