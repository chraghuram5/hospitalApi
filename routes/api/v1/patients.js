const express = require('express');
const passport=require('passport');

const router = express.Router();
const patientsApi=require("../../../controllers/api/v1/patients_api")

router.post('/register',patientsApi.register);
router.post('/:id/create_report',passport.authenticate('jwt',{session: false}),patientsApi.createReport);

module.exports=router;