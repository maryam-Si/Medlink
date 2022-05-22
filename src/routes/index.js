/** @format */

const router = require("express").Router();
const path = require("path");

//admin routers
router.use("/users", require("./users.js"));

router.use("/appointments", require("./appointments.js"));

router.use("/messages", require("./messages.js"));
router.use("/conversations", require("./conversation"));
router.use("/medicalRecords", require("./medicalRecods"));

//file uploads
router.get("/image/:filename", (req, res) => {
	const { filename } = req.params;
	const dirname = path.resolve();
	const fullfilepath = path.join(dirname, "uploads/" + filename);
	return res.type("image/png").sendFile(fullfilepath);
});
module.exports = router;
