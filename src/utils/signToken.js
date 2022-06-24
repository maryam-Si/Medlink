/** @format */

const jwt = require("jsonwebtoken");
require("dotenv").config();
const { PASSPORT_SECRET_KEY } = process.env;
exports.signToken = (user) => {
	return jwt.sign(
		{
			iss: "passwortkey",
			sub: user.id,
			iat: new Date().getTime(), // current time
			exp: new Date().setDate(new Date().getDate() + 365), // current time + 1 year ahead
		},
		PASSPORT_SECRET_KEY
	);
};
