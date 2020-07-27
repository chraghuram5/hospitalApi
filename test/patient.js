let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let request = require('request');
let Patient = require('../models/patient');
let Doctor = require('../models/doctor');
let Report = require('../models/report');

chai.should();
chai.use(chaiHttp);

describe('Hospital Api', () => {

    //Data required for executing test cases
    let token = '';
    let patientId = 'abcdfed';

    let status = {
        status: "TRAVELLED-QUARANTINE"
    }

    let doctor = {
        username: "doctor",
        password: "doctor",
        name: "doctor"
    }

    let firstPatient = {
        name: 'firstPatient',
        phone: '1234567890',
        age: '30'
    }

    let secondPatient = {
        name: 'secondPatient',
        phone: '1234567890',
        age: '50'
    }

    let thirdPatient = {
        name: 'thirdPatient',
        phone: '1234567890',
        age: '50'
    }

    //Setting up the initial data in the test database
    before((done) => { //Before each test we empty the database

        //Deleting existing doctors
        Doctor.deleteMany({});

        //Delete Existing reports
        Report.deleteMany({});

        //Delete existing Patients and create a new patient
        Patient.deleteMany({}, function (err) {
            Patient.create(firstPatient, function (err, patient) {
                patientId = patient._id;
            })
        });

        //Create a doctor and assign the token
        Doctor.create(doctor, (err) => {
            const options = {
                url: 'http://localhost:8000/api/v1/doctors/login',
                json: true,
                form: {
                    username: 'doctor',
                    password: 'doctor'
                }
            }
            request.post(options, (err, res, body) => {
                if (err) {
                    //console.log("error");
                    return;
                }
                //console.log(res.body.data.token);
                token = res.body.data.token;
                done();
            })
        })
    });

    //Test cases for /patients/register route
    describe('/POST /patients/register', () => {
        //Test case for checking registration and latest patient
        it('should register latest patient and return the latest Patient', (done) => {
            chai.request(server)
                .post('/api/v1/patients/register')
                .set({ "Authorization": `Bearer ${token}` })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(secondPatient)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.patientCreated.doc.should.have.property('name').equal(secondPatient.name);
                    done();
                });
        });

        //Test case for checking authorization
        it('should be Authorized for patient Registration', (done) => {
            let tempToken = 'hello';
            chai.request(server)
                .post('/api/v1/patients/register')
                .set({ "Authorization": `Bearer ${tempToken}` })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(thirdPatient)
                .end((err, res) => {
                    res.text.should.equal('Unauthorized');
                    res.should.have.status(401);
                    done();
                });
        });

        //Test case for validating absence of name and phone in the form body
        it('should have name and phone in the form body for patient Registration', (done) => {
            let patient = {
                age: '50'
            }
            //console.log('patientId', patientId);
            chai.request(server)
                .post('/api/v1/patients/register')
                .set({ "Authorization": `Bearer ${token}` })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(patient)
                .end((err, res) => {
                    res.body.should.have.property('message').equal('registration unsuccessful');
                    done();
                });
        });
    });


    //Test case for /api/v1/patients/:id/create_report
    describe('/POST /api/v1/patients/:id/create_report', () => {
        //Test case for checking the latest report creation
        it('should create the latest report successfully', (done) => {
            chai.request(server)
                .post('/api/v1/patients/' + patientId + '/create_report')
                .set({ "Authorization": `Bearer ${token}` })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(status)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('report');
                    res.body.should.have.property('message').equal('Report created successfully');
                    res.body.report.should.have.property('status').equal(status.status);
                    done();
                });
        });

        //Test case for checking the authorization
        it('Authorization required for report creation', (done) => {
            let tempStatus = {
                status: "QUARANTINE"
            }
            let tempToken = "wrongToken"
            chai.request(server)
                .post('/api/v1/patients/' + patientId + '/create_report')
                .set({ "Authorization": `Bearer ${tempToken}` })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(tempStatus)
                .end((err, res) => {
                    res.text.should.equal('Unauthorized');
                    res.should.have.status(401);
                    done();
                });
        });

        //Test case for validating the absence of status in the body
        it('should have status in the body', (done) => {
            let tempStatus = {}
            let tempToken = "wrongToken"
            chai.request(server)
                .post('/api/v1/patients/' + patientId + '/create_report')
                .set({ "Authorization": `Bearer ${tempToken}` })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(tempStatus)
                .end((err, res) => {
                    res.text.should.equal('Unauthorized');
                    res.should.have.status(401);
                    done();
                });
        });

        //Test case for validating the correct Id in the url
        it('should have correct id in the url', (done) => {
            let tempId="abcd1234"
            chai.request(server)
                .post('/api/v1/patients/' + tempId + '/create_report')
                .set({ "Authorization": `Bearer ${token}` })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(status)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').equal("ERROR in creating Report. Please check valid status are 'NEGATIVE','TRAVELLED-QUARANTINE','SYMPTOMS-QUARANTINE','POSITIVE-ADMIT'");
                    done();
                });
        });
    });

    //Test case for /api/v1/patients/:id/all_reports
    describe('/GET /api/v1/patients/:id/all_reports', () => {

        //Test case for checking the reports of the patient with an id
        it('should return the reports of the patient in an Array', (done) => {
            chai.request(server)
                .get('/api/v1/patients/' + patientId + '/all_reports')
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('reports');
                    res.body.reports[0].should.have.property('status').equal(status.status);
                    res.body.reports[0].doctor.should.have.property('username').equal(doctor.username);
                    res.body.reports[0].doctor.should.have.property('name').equal(doctor.name);
                    done();
                });
        });

        //Test case for checking authorization
        it('should be authorized', (done) => {
            let tempToken="wrongToken";
            chai.request(server)
                .get('/api/v1/patients/' + patientId + '/all_reports')
                .set({ "Authorization": `Bearer ${tempToken}` })
                .end((err, res) => {
                    res.text.should.equal('Unauthorized');
                    res.should.have.status(401);
                    done();
                });
        });
    });

});
