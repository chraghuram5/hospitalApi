const passport=require('passport');
const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const Doctor=require('../models/doctor');

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

//secret used for decrypting
opts.secretOrKey = 'secret';

//configuring strategy
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    Doctor.findOne({_id: jwt_payload._id}, function(err, doctor) {
        if (err) {
            console.log('Error in finding doctor from JWT');
            return done(err, false);
        }
        console.log(doctor);
        if (doctor) {
            return done(null, doctor);
        } else {
            return done(null, false);
        }
    });
}));

module.exports=passport;