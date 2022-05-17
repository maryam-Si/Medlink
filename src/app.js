/** @format */

// Express. js is a framework for Node. js.
//  It is used for designing and building web applications quickly and easily.
const express = require("express");

//  mongodb object modeling for node.js
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const { createServer } = require("http");
const { socketAuth } = require("./utils/socketAuth");
const { socket } = require("./controllers/socket");
const cors = require("cors");
//create express app
const app = express();

//authentication middleware
require("./middlewares/passport");

//environment variables config
require("dotenv").config();

//get environment vars
const { PORT, MONGO_DB_LOCAL_URI: dburl, SOCKET_PORT } = process.env;

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

//enable cors
app.use(cors());
//middleware
app.use(helmet());
app.use(morgan("tiny"));
//convert request body to JSON.
app.use(express.json());

//Routes setting up handle requests [version 1]
app.use("/v1", routes);

//create socket io connection
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.use(socketAuth).on("connection", socket);

//store to global
global.io = io;

//start socket io app
httpServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${SOCKET_PORT}`);
});

// start the Express server
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
