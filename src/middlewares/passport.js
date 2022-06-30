/** @format */

const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const Doctor = require("./../models/doctor");
const Patient = require("./../models/patient");
require("dotenv").config();
const { PASSPORT_SECRET_KEY } = process.env;
passport.use(
	new JWTStrategy(
		{
			// supplies the method by which the JWT will be extracted from the Request
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: PASSPORT_SECRET_KEY,
		},
		// return a full user if the validation succeeds, or a null if it fails
		function (jwtPayload, done) {
			const doctor = Doctor.findById(jwtPayload.sub);
			const patient = Patient.findById(jwtPayload.sub);
			if (doctor) {
				return doctor
					.then((doctor) => {
						return done(null, doctor);
					})
					.catch((err) => {
						return done(null, false);
					});
			} else if (patient) {
				return patient
					.then((patient) => {
						return done(null, patient);
					})
					.catch((err) => {
						return done(null, false);
					});
			}
		}
	)
);
