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
    before((done) => { //Before each test we empty the database
        Doctor.deleteMany({});
        Report.deleteMany({});
        Patient.deleteMany({}, function (err) {
            Patient.create({ name: 'firstPatient', phone: '0987654321', age: '30' }, function (err, patient) {
                patientId = patient._id;
            })
        });
        Doctor.create({ username: 'doctor', password: 'doctor', name: 'doctor' }, (err) => {
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
        it('it should return the same patient', (done) => {
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
        it('it should be authorized', (done) => {
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
        it('Patient should have name and phone', (done) => {
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

    describe('/POST /api/v1/patients/5f1c6f1e5fe07773b896aa1e/create_report', () => {
        it('Report should be created succesfully', (done) => {
            let status = {
                status: "TRAVELLED-QUARANTINE"
            }
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
            let status = {
                status: "QUARANTINE"
            }

            let tempToken = "wrongToken"
            chai.request(server)
                .post('/api/v1/patients/' + patientId + '/create_report')
                .set({ "Authorization": `Bearer ${tempToken}` })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(status)
                .end((err, res) => {
                    res.text.should.equal('Unauthorized');
                    res.should.have.status(401);
                    done();
                });
        });
    });

});
