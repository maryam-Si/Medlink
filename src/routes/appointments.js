/** @format */

const router = require("express").Router();

const AppointmentController = require("./../controllers/appointment");

const passport = require("passport");
const adminAuth = require("../middlewares/adminAuth");

// get all doctor's appointments or patient's appointments
router.get(
	"/get-appointments/:id",
	passport.authenticate("jwt", { session: false }),
	AppointmentController.getAppointments
);
// get all appointments

router.get(
	"/get-all-appointments",
	passport.authenticate("jwt", { session: false }),
	adminAuth,
	AppointmentController.getAppointmentsByAdmin
);

// get doctor's times
router.get(
	"/get-doctor-times/:doctorId",
	passport.authenticate("jwt", { session: false }),
	AppointmentController.getDoctorTimes
);

// create appointment

router.post(
	"/create-appointment",
	passport.authenticate("jwt", { session: false }),
	AppointmentController.createAppointment
);

// cancel appointment
router.delete(
	"/cancel-appointment/:id",
	passport.authenticate("jwt", { session: false }),
	AppointmentController.cancelAppointment
);

module.exports = router;
