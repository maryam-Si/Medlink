/** @format */

const router = require("express").Router();
const path = require("path");
//admin routers
router.use("/users", require("./users.js"));

//file uploads
router.get("/image/:filename", (req, res) => {
	const { filename } = req.params;
	const dirname = path.resolve();
	const fullfilepath = path.join(dirname, "uploads/" + filename);
	return res.type("image/png").sendFile(fullfilepath);
});
module.exports = router;
