const express = require('express');

const router = express.Router();
const reportsApi=require("../../../controllers/api/v1/reports_api")

//Route for fetching all reports based on the status
router.get('/:status',reportsApi.reports);

module.exports=router;