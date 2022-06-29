/** @format */

const router = require("express").Router();
const PatientController = require("../controllers/patients");

router.post("/register", PatientController.register);
router.post("/login", PatientController.login);

module.exports = router;
