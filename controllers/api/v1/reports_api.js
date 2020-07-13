const Report=require('../../../models/report');
const jwt=require('jsonwebtoken');

module.exports.reports=async function(req,res){
    
    let reportStatus=req.params.status;
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