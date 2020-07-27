const Doctor=require('../../../models/doctor');
const jwt=require('jsonwebtoken');

//create session for doctor
module.exports.createSession = async function(req, res){
   try{
    // console.log(req.body);

    //Find the doctor with the credentials from the request body
    let doctor=await Doctor.findOne({username:req.body.username});

    //Validate the doctor object and the password in the request body with password fetched from database
    if(!doctor || doctor.password!=req.body.password){
        return res.json(422,{
            message:"Invalid username or password"
        });
    }

    //Return doctor and JWT upon successful Sign In
    return res.status(200).json({
        message:"Sign in successful",
        data:{
            doctor: doctor,
            token: jwt.sign(doctor.toJSON(),'secret', {expiresIn: '1000000'})
        }
    })
   }
   catch(err){
    //console.log("ERROR");
    //console.log(err);
    return res.json(500,{
        message:"Internal Server error"
    });
   }
}

//register a doctor
module.exports.register=async function(req,res){
    try{
        //Create doctor object which is to be created
        let doctor={};
        doctor.username=req.body.username;
        doctor.password=req.body.password;
        doctor.name=req.body.name;
        //console.log(doctor);

        //Add doctor to the database
        let doctorCreated=await Doctor.create(doctor);

        //Upon succesful registration return the doctor and status message
        return res.json(200,{
            message:"Doctor successfully registered",
            doctorCreated: doctorCreated
        });
    }
    catch(err){
        //console.log("ERROR in registration");

        //If there is any error or if the doctor is already registered, return registration unsuccessful
        return res.json(500,{
            message:"registration unsuccessful",
        })
    }
}