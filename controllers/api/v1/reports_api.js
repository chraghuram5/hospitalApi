const Report=require('../../../models/report');

//Get all the reports
module.exports.reports=async function(req,res){
    
    let reportStatus=req.params.status;

    //Find reports based on report status and populate with doctor details
    let reports=await Report.find({status:reportStatus})
    .populate({
        path:'doctor',
        select:'-password-_id-__v'
    })
    .select('-_id');

    return res.json(200,{
        reports
    })
}