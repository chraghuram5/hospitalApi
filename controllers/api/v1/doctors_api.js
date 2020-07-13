const Doctor=require('../../../models/doctor');
const jwt=require('jsonwebtoken');

module.exports.createSession = async function(req, res){
   try{
    console.log(req.body);
    let doctor=await Doctor.findOne({username:req.body.username});
    if(!doctor || doctor.password!=req.body.password){
        return res.json(422,{
            message:"Invalid username or password"
        });
    }

    return res.json(200,{
        message:"Sign in successful",
        data:{
            doctor: doctor,
            token: jwt.sign(doctor.toJSON(),'secret', {expiresIn: '1000000'})
        }
    })
   }
   catch(err){
    console.log("ERROR");
    console.log(err);
    return res.json(500,{
        message:"Internal Server error"
    });
   }
}

module.exports.register=async function(req,res){
    try{
        let doctor={};
        doctor.username=req.body.username;
        doctor.password=req.body.password;
        doctor.name=req.body.name;
        console.log(doctor);
        let doctorCreated=await Doctor.create(doctor);
        return res.json(200,{
            message:"Doctor successfully registered",
            doctorCreated: doctorCreated
        });
    }
    catch(err){
        console.log("ERROR in registration");
        return res.json(500,{
            message:"registration unsuccessful",
        })
    }
}