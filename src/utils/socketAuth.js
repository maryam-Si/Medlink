/** @format */
// To authenticate socket.io connections using JWT,
//  we send the token with the socket.io client.
//And then on the server, we check the token.

const jwt = require("jsonwebtoken");
const { PASSPORT_SECRET_KEY } = process.env;

// authenticate socket.io connections using JWT

// The handshake in Socket.IO is like any other information technology related handshake.
//  It is the process of negotiation, which in Socket.IO's case,
// decides whether a client may connect, and if not, denies the connection.
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
