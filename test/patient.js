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
    before((done) => { //Before each test we empty the database
        Doctor.deleteMany({});
        Report.deleteMany({});
        Patient.deleteMany({}, function (err) {
            Patient.create(firstPatient, function (err, patient) {
                patientId = patient._id;
            })
        });
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

    describe('/POST /patients/register', () => {
        it('Route should register latest patient and return the latest Patient', (done) => {
            let patient = {
                name: 'secondPatient',
                phone: '1234567890',
                age: '50'
            }
            chai.request(server)
                .post('/api/v1/patients/register')
                .set({ "Authorization": `Bearer ${token}` })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(patient)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.patientCreated.doc.should.have.property('name').equal(patient.name);
                    done();
                });
        });
        it('Route should be Authorized for patient Registration', (done) => {
            let patient = {
                name: 'thirdPatient',
                phone: '1234567890',
                age: '50'
            }
            let tempToken = 'hello';
            chai.request(server)
                .post('/api/v1/patients/register')
                .set({ "Authorization": `Bearer ${tempToken}` })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(patient)
                .end((err, res) => {
                    res.text.should.equal('Unauthorized');
                    res.should.have.status(401);
                    done();
                });
        });
        it('Route should have name and phone in the form body for patient Registration', (done) => {
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

    describe('/POST /api/v1/patients/:id/create_report', () => {
        it('Route should create the latest report successfully', (done) => {
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

        it('Route should have status in the body', (done) => {
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
    });

    describe('/GET /api/v1/patients/:id/all_reports', () => {
        it('Route should return the reports of the patient in an Array', (done) => {
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

        it('Route should be authorized', (done) => {
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
