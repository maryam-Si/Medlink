/** @format */

//Once the user is logged in,
// each subsequent request will include the JWT,
//allowing the user to access routes, services,
//and resources that are permitted with that token

const jwt = require("jsonwebtoken");
const { PASSPORT_SECRET_KEY } = process.env;
module.exports.socketAuth = function (socket, next) {
	if (socket.handshake.query && socket.handshake.query.token) {
		jwt.verify(
			socket.handshake.query.token,
			PASSPORT_SECRET_KEY,
			function (err, decoded) {
				if (err) return next(new Error("Authentication error"));
				socket.user = decoded;
				next();
			}
		);
	} else {
		next(new Error("Authentication error"));
	}
};
