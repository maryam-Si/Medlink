/** @format */

// Express. js is a framework for Node. js.
//  It is used for designing and building web applications quickly and easily.
const express = require("express");

//  mongodb object modeling for node.js
const mongoose = require("mongoose");
const socket = require("socket.io");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");

//create express app
const app = express();

//authentication middleware
require("./middlewares/passport");

//environment variables config
require("dotenv").config();

//get environment vars
const { PORT, MONGO_DB_LOCAL_URI: dburl } = process.env;

//connect to Database
mongoose.connect(
	dburl,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err) => {
		if (err) console.log(err);
		else console.log("DATA CENTER - Connected");
	}
);

//use to avoid deprecation warnings from the MongoDB driver.
mongoose.set("useCreateIndex", true);

//middleware
app.use(helmet());
app.use(morgan("tiny"));
//convert request body to JSON.
app.use(express.json());

//Routes setting up handle requests [version 1]
app.use("/v1", routes);

// start the Express server
const server = app.listen(PORT, () => {
	console.log(`server started at http://localhost:${PORT}`);
});

const io = socket(server, {
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
	global.chatSocket = socket;
	socket.on("add-user", (userId) => {
		onlineUsers.set(userId, socket.id);
	});

	socket.on("send-msg", (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("msg-recieve", data.msg);
		}
	});
});
