const express = require('express');

const router = express.Router();
const doctorsApi=require("../../../controllers/api/v1/doctors_api");

router.post('/register',doctorsApi.register);
router.post('/create-session',doctorsApi.createSession);

module.exports=router;