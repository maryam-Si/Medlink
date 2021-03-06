/** @format */

const mongoose = require("mongoose");
const User = require("../models/user");
const Appointment = require("../models/appointment");
const DoctorInfo = require("../models/doctorInfo");
// // get Doctor's times
exports.getDoctorTimes = async (req, res) => {
	try {
		// Check if the doctor exists
		const doctor = await DoctorInfo.findOne({ userId: req.params.doctorId });
		console.log(doctor);
		if (doctor) {
			res.status(200).json({
				workSchedule: doctor.workSchedule,
			});
		} else {
			res.status(400).send({ error: "دکتر وجود ندارد" });
		}
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};
exports.getBookedAppointments = async (req, res) => {
	try {
		const bookedApp = await Appointment.find({
			doctorId: req.params.doctorId,
			date: req.params.date,
		});

		const result = bookedApp.map((app) => ({
			startTime: app.startTime,
			endTime: app.endTime,
		}));
		if (bookedApp) {
			res.status(200).json({
				bookedAppointments: result,
			});
		} else {
			res.status(400).json({
				message: "در این تاریخ نوبتی ثبت نشده است.",
			});
		}
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

// Get all Appointments
exports.getAppointments = async (req, res) => {
	try {
		const Appointments =
			req.user.type == 1
				? await Appointment.find({ doctorId: req.user._id })
				: await Appointment.find({ clientId: req.user._id });

		const getAllAppointments = async () => {
			let result;
			if (req.user.type === 2) {
				result = Appointments.map(async (appointment) => {
					const returnedDoctor = await User.findOne({
						_id: appointment.doctorId,
					});
					const returnedAppointment = { ...appointment._doc };
					returnedAppointment.doctorInfo = {
						...returnedDoctor._doc,
						password: undefined,
						username: undefined,
					};
					return returnedAppointment;
				});
			} else {
				result = Appointments.map(async (appointment) => {
					const returnedClient = await User.findOne({
						_id: appointment.clientId,
					});
					const returnedAppointment = { ...appointment._doc };
					returnedAppointment.patientInfo = {
						...returnedClient._doc,
						password: undefined,
						username: undefined,
					};
					return returnedAppointment;
				});
			}
			return Promise.all(result);
		};

		if (Appointments.length > 0) {
			const awaitedAppointments = await getAllAppointments();

			res.status(200).json({ result: awaitedAppointments });
		} else {
			res.status(404).json({ error: "no Appointments found" });
		}
	} catch (e) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

exports.createAppointment = async (req, res) => {
	try {
		const { startTime, endTime, date, doctorId, clientId } = req.body;

		const newAppointment = new Appointment({
			_id: new mongoose.Types.ObjectId(),
			startTime,
			endTime,
			date,
			doctorId,
			clientId,
			createdAt: new Date().toISOString(),
		});

		//saving the appointment in database
		const result = await newAppointment.save();

		if (result) {
			res.status(201).json({
				message: " نوبت با موفقیت ثبت شد",
				result: {
					Appointment: result,
				},
			});
			return;
		}

		throw new Error("خطایی رخ داد");
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

exports.getAppointmentsByAdmin = async (req, res) => {
	try {
		const appointments = await Appointment.find({});
		if (appointments.length > 0) {
			res.status(200).json({ result: appointments });
		} else {
			res.status(404).send({ error: "no Appointments found" });
		}
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

exports.cancelAppointment = async (req, res) => {
	try {
		const findAppointment = await Appointment.findOne({ _id: req.params.id });
		if (!findAppointment) {
			res.status(404).json({ message: "نوبت یافت نشد." });
		}

		await findAppointment.delete();

		res.status(200).json({
			message: "نوبت کنسل شد.",
		});
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

// check if a patient have had appointments or not with specific doctor
exports.hasAppointmentBefore = async (req, res) => {
	try {
		const appointments = await Appointment.find({
			clientId: req.user._id,
			doctorId: req.params.doctorId,
		});

		if (appointments.length > 0) {
			res.status(200).json({ hasAppointment: true });
		} else {
			res.status(404).json({ hasAppointment: false });
		}
	} catch (e) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};
