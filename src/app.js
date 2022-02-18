/** @format */

const express = require("express");

//  mongodb object modeling for node.js
const mongoose = require("mongoose");

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
app.listen(PORT, () => {
	console.log(`server started at http://localhost:${PORT}`);
});
