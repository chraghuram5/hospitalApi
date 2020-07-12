const Report=require('../../../models/report');
const jwt=require('jsonwebtoken');

module.exports.reports=async function(req,res){
    
    let reportStatus=req.params.status;
    let reports=await Report.find({status:reportStatus})
    .populate({
        path:'doctor'
    });
    return res.json(200,{
        reports
    })
}