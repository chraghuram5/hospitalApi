const Patient = require('../../../models/patient');
const Report = require('../../../models/report');

//Register a patient
module.exports.register = async function (req, res) {
    try {
        let patient = {};
        patient.name = req.body.name;
        patient.phone = req.body.phone;
        let patientCreated = await Patient.findOrCreate(patient);
        return res.status(200).json({
            patientCreated
        });
    }
    catch (err) {
        //console.log("ERROR in registration");
        return res.status(500).json({
            message: "registration unsuccessful",
        })
    }
}

//Create report for a patient
module.exports.createReport = async function (req, res) {
    try {
        let report = {};
        let id = req.params.id;
        let doctor = req.user;
        report.doctor = doctor;
        report.status = req.body.status;
        report.date=new Date().toDateString();
        let reportCreated = await Report.create(report);
        let patient = await Patient.findById(id);
        patient.reports.push(reportCreated);
        patient.save();

        return res.status(200).json({
            message: "Report created successfully",
            report:reportCreated
        })
    }
    catch (err) {
        //console.log("ERROR in creating Report. Please check valid status are 'NEGATIVE','TRAVELLED-QUARANTINE','SYMPTOMS-QUARANTINE','POSITIVE-ADMIT'");
        //console.log(err);
        return res.status(500).json({
            message: "ERROR in creating Report. Please check valid status are 'NEGATIVE','TRAVELLED-QUARANTINE','SYMPTOMS-QUARANTINE','POSITIVE-ADMIT'",
        })
    }
}

//fetching all the reports
module.exports.reportsAll = async function (req, res) {

    try {
        let patientId = req.params.id;
        let patientReports = await Patient.findById(patientId)
        .populate({
            path:'reports',
            populate:{
                path:'doctor',
                select:'-password-_id-__v',
            },
            select:'-_id-__v'
        });

        let reports=patientReports.reports;

        reports.sort((a,b)=>{
            if(a.date>b.date)
                return 1;
            else
                return -1;
        })
        return res.status(200).json({
            reports
        })
    }

    catch(err){
        //console.log("ERROR in fetching Report");
        //console.log(err);
        return res.json(500, {
            message: "reports fetching unsuccessful",
        })
    }

}