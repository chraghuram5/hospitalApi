const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    reports:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report'
        }
    ]
}, {
    timestamps: true
});

patientSchema.plugin(findOrCreate)

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;