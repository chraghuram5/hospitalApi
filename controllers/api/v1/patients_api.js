const Patient = require('../../../models/patient');
const Report = require('../../../models/report');

module.exports.register = async function (req, res) {
    try {
        let patient = {};
        patient.name = req.body.name;
        patient.phone = req.body.phone;
        let patientCreated = await Patient.findOrCreate(patient);
        return res.json(200, {
            patientCreated
        });
    }
    catch (err) {
        console.log("ERROR in registration");
        return res.json(500, {
            message: "registration unsuccessful",
        })
    }
}

module.exports.createReport = async function (req, res) {
    try {
        let report = {};
        let id = req.params.id;
        let doctor = req.user;
        report.doctor = doctor;
        report.status = req.body.status;
        let reportCreated = await Report.create(report);
        let patient = await Patient.findById(id);
        patient.reports.push(reportCreated);
        patient.save();

        return res.json(200, {
            message: "Report created successfully"
        })
    }
    catch (err) {
        console.log("ERROR in creating Report");
        console.log(err);
        return res.json(500, {
            message: "report creationg unsuccessful",
        })
    }
}

module.exports.reportsAll = async function (req, res) {

    try {
        let patientId = req.params.id;
        let patientReports = await Patient.findById(patientId)
        .populate({
            path:'reports',
            populate:{
                path:'doctor',
            }
        });

        let reports=patientReports.reports;

        function compare(a, b) {
           
            let c=a.createdAt;
            let d=b.createdAt;
          
            let comparison = 0;
            if (c > d) {
              comparison = 1;
            } else if (c<d) {
              comparison = -1;
            }
            return comparison;
          }
          
          reports.sort(compare);
        return res.json(200, {
            reports
        })
    }
    catch(err){
        console.log("ERROR in fetching Report");
        console.log(err);
        return res.json(500, {
            message: "reports fetching unsuccessful",
        })
    }

}