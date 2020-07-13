const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    status:{
        type:String,
        enum:['NEGATIVE','TRAVELLED-QUARANTINE','SYMPTOMS-QUARANTINE','POSITIVE-ADMIT'],
        default:'NEGATIVE'
    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    date:{
        type: String
    }
});



const Report = mongoose.model('Report', reportSchema);

module.exports = Report;