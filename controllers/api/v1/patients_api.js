const Patient=require('../../../models/patient');
const Report = require('../../../models/report');

module.exports.register=async function(req,res){
    try{
        let patient={};
        patient.name=req.body.name;
        patient.phone=req.body.phone;
        let patientCreated=await Patient.findOrCreate(patient);
        return res.json(200,{
            patientCreated
        });
    }
    catch(err){
        console.log("ERROR in registration");
        return res.json(500,{
            message:"registration unsuccessful",
        })
    }
}

module.exports.createReport=async function(req,res){
    try{
        let report={};
        let id=req.params.id;
        let doctor=req.user;
        report.doctor=doctor;
        report.status="POSITIVE";
        let reportCreated=await Report.create(report);
        let patient=await Patient.findById(id);
        patient.reports.push(reportCreated);
        patient.save();

        return res.json(200,{
            message:"Report created successfully"
        })
    }
    catch(err){
        console.log("ERROR in creating Report");
        console.log(err);
        return res.json(500,{
            message:"report creationg unsuccessful",
        })
    }
}