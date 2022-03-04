/** @format */

const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require("./../models/user");
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
			return User.findById(jwtPayload.sub)
				.then((user) => {
					return done(null, user);
				})
				.catch((err) => {
					return done(null, false);
				});
		}
	)
);
