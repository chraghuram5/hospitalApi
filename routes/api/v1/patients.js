const express = require('express');
const passport=require('passport');

const router = express.Router();
const patientsApi=require("../../../controllers/api/v1/patients_api")

//Route for registration of patients by doctor, requires JWT
router.post('/register',passport.authenticate('jwt',{session: false}),patientsApi.register);

//Route for creating patient report based on Id by doctor, requires JWT
router.post('/:id/create_report',passport.authenticate('jwt',{session: false}),patientsApi.createReport);

//Route for fetching all reports of a patient based on id, requires JWT
router.get('/:id/all_reports',passport.authenticate('jwt',{session: false}),patientsApi.reportsAll);

module.exports=router;