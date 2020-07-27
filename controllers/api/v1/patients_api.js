const Patient = require('../../../models/patient');
const Report = require('../../../models/report');

//Register a patient
module.exports.register = async function (req, res) {
    try {

        //Create patient object which is to be registered
        let patient = {};
        patient.name = req.body.name;
        patient.phone = req.body.phone;

        //Create a patient if he doesn't exist or find the patient if already exists
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

        //Create report object which is to be added to the database
        let report = {};
        let id = req.params.id;
        let doctor = req.user;
        report.doctor = doctor;
        report.status = req.body.status;
        report.date=new Date().toDateString();

        //Add report object to the database
        let reportCreated = await Report.create(report);

        //Find the patient to whom this report belongs to
        let patient = await Patient.findById(id);

        //Add the report to the patient as well
        patient.reports.push(reportCreated);
        patient.save();

        //Return success message if report is created successfully
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

        //Get reports of the patient based on Id and populate with doctor details
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

        //Sort the reports based on their data 
        reports.sort((a,b)=>{
            if(a.date>b.date)
                return 1;
            else
                return -1;
        })

        //Return the reports on success
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