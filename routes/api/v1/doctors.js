const express = require('express');

const router = express.Router();
const doctorsApi=require("../../../controllers/api/v1/doctors_api");

//Route for Doctor's registration
router.post('/register',doctorsApi.register);

//Route for creating session for doctor's
router.post('/login',doctorsApi.createSession);

module.exports=router;