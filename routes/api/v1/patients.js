const express = require('express');
const passport=require('passport');

const router = express.Router();
const patientsApi=require("../../../controllers/api/v1/patients_api")

router.post('/register',passport.authenticate('jwt',{session: false}),patientsApi.register);
router.post('/:id/create_report',passport.authenticate('jwt',{session: false}),patientsApi.createReport);
router.get('/:id/all_reports',passport.authenticate('jwt',{session: false}),patientsApi.reportsAll);

module.exports=router;