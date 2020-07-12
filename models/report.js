const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    status:{
        type:String,
        required:true
    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }
}, {
    timestamps: true
});



const Report = mongoose.model('Report', reportSchema);

module.exports = Report;