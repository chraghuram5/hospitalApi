# Hospital Api 🏥

## Overview

### An  API for the doctors of a Hospital which has been allocated by the govt for testing, quarantine and well being of COVID-19 patients

## Description

- There can be 2 types of Users
  - Doctors 👨‍⚕️
  - Patients 🤒
- Doctors can register himself and Login
- Each time a patient visits, the doctor does the following
  - Register the patient in the app (using phone number📞)
  - After the checkup, create a Report 📝
- Patient Report will have the following fields
  - Created by doctor
  - Status: NEGATIVE, TRAVELLED-QUARANTINE, SYMPTOMS-QUARANTINE, POSITIVE-ADMIT
  - Date📅

## Routes
- /doctors/register → Doctor's registration with username and password
- /doctors/login → Doctor's login with username and password, receives the JWT to be used
- /patients/register → Patient's registration by Doctor (use JWT)
- /patients/:id/create_report → Patient's report creation with status by Doctor (use JWT)
- /patients/:id/all_reports → List all the reports of a patient oldest to latest (use JWT)
- /reports/:status → List all the reports of all the patients filtered by a specific status

## Run the Application
1. Install [Postman](https://www.postman.com/downloads/)
2. Clone or download the project as zip file.
3. Open New terminal and enter the command `npm install`
4. Start the application using `npm start`
