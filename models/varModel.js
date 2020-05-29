const mongoose = require('mongoose');


const varSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
});
varSchema.set('timestamps', true);

const var_Collection = mongoose.model('vars', varSchema);

const vars = {
    createVar: function (newVar) {
        return var_Collection
            .create(newVar)
            .then((var_Res) => {
                return var_Res;
            })
            .catch((err) => {
                throw new Error(err);
            });
    },
    getAllvars: function () {
        return var_Collection
            .find()
            .then((allvars) => {
                return allvars;
            })
            .catch((err) => {
                return err;
            });
    },
    updateVar: function (name, params) {
        return var_Collection
            .findOneAndUpdate({ name: name }, { $set: params }, { new: true })
            .then((var_) => {
                return var_;
            })
            .catch((err) => {
                return err;
            });
    },
    getVarById: function (id) {
        return var_Collection
            .findOne({ id: id })
            .then((var_) => {
                return var_;
            })
            .catch((err) => {
                return err;
            });
    },
    getVarByName: function (name) {
        return var_Collection
            .findOne({ name: name })
            .then((var_) => {
                return var_;
            })
            .catch((err) => {
                return err;
            });
    },
};

module.exports = { vars, varSchema };