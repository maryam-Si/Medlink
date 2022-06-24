/** @format */

const mongoose = require("mongoose");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const { signToken } = require("./../utils/signToken");
const User = require("../models/user");
const Appointment = require("../models/appointment");
const DoctorInfo = require("../models/doctorInfo");
const ClientInfo = require("../models/clientInfo");

//environment variables config
require("dotenv").config();

exports.createFirstAdmin = async (req, res, next) => {
	try {
		const username = "admin";
		const password = "123456789";
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);
		const newUser = new User({
			_id: new mongoose.Types.ObjectId(),
			username,
			password: hashedPassword,
			isAdmin: true,
			createdAt: new Date().toISOString(),
			firstName: "admin",
			lastName: "admin",
		});
		const result = await newUser.save();
		if (result) {
			res.status(200).json({
				message: "first admin successfully added .",
			});
			return;
		}
		throw new Error("Error ");

		//create token for admin
	} catch (err) {
		res.status(500).json({
			error: err.message,
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const findUser = await User.findOne({ username });
		if (!findUser) {
			res.status(400).json({ message: "نام کاربری یا کلمه عبور اشتباه است" });
			return;
		}
		const passwordMatch = await bcrypt.compare(password, findUser.password);
		if (passwordMatch) {
			res.status(200).json({
				result: {
					token: signToken(findUser),
					user: Object.assign(findUser, { password: undefined }),
				},
			});
			return;
		}
		res.status(400).json({ message: "نام کاربری یا کلمه عبور اشتباه است" });

		//create token for  user
		// const token = signToken(adminUser);
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

exports.getUserProfile = async (req, res) => {
	try {
		const inf =
			req.user.type === 1
				? await DoctorInfo.find({ userId: req.user._id })
				: await ClientInfo.find({ userId: req.user._id });

		console.log(req.user._id);
		res.status(200).json({
			result: {
				user: Object.assign(req.user, { password: undefined }),
				info: inf,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

exports.updateUserProfile = async (req, res) => {
	try {
		console.log(req.user);
		// Unrequire list of fields if not provided
		const unrequiredFields = [
			"username",
			"isAdmin",
			"createdAt",
			"type",
			"sex",
			"dateOfBirth",
		];
		unrequiredFields.forEach((field) => {
			if (!req.body[field]) {
				req.body[field] = req.user[field];
			}
		});
		Object.keys(req.body).forEach((field) => {
			req.user[field] = req.body[field];
		});

		await req.user.save();

		res.status(201).json({
			message: "تغییرات با موفقیت اعمال شد.",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// update doctor's information
exports.updateDoctorInfo = async (req, res) => {
	try {
		const doctor = await DoctorInfo.findOne({ userId: req.user._id });
		Object.keys(req.body).forEach((field) => {
			doctor[field] = req.body[field];
		});
		await doctor.save();
		res.status(201).json({
			message: "تغییرات با موفقیت اعمال شد.",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// update patient's information
exports.updateClientInfo = async (req, res) => {
	try {
		const patient = await ClientInfo.findOne({ userId: req.user._id });
		Object.keys(req.body).forEach((field) => {
			patient[field] = req.body[field];
		});
		await patient.save();
		res.status(201).json({
			message: "تغییرات با موفقیت اعمال شد.",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// // GET Patient(s) Routes
// All Patients of especific doctor
exports.getDoctorPatients = async (req, res) => {
	try {
		if (req.user.type == 2) {
			res.status(403).send({ error: "شما دسترسی ندارید" });
		}

		// Change this to allow null
		const bookedAppointments = await Appointment.find(
			{ doctorId: req.user._id },
			function (err) {
				if (err) {
					return res.status(404).send();
				}
			}
		);

		const patients = bookedAppointments.map((app) => app.clientId);

		// Assign all users to the user of bookedAppointments
		const users = await User.find({ _id: { $in: patients } }, function (err) {
			if (err) {
				return res.status(404).send();
			}
		});

		// Only send appropriate data
		res.status(200).json({
			patients: users,
		});
	} catch (e) {
		res.status(500).send();
	}
};

// All Doctors who visited a patient
exports.getPatientDoctors = async (req, res) => {
	try {
		const bookedAppointments = await Appointment.find(
			{ clientId: req.user._id },
			function (err) {
				if (err) {
					return res.status(404).send();
				}
			}
		);

		const doctors = bookedAppointments.map((app) => app.doctorId);

		const users = await User.find({ _id: { $in: doctors } }, function (err) {
			if (err) {
				return res.status(404).send();
			}
		});

		// Only send appropriate data
		res.status(200).json({
			doctors: users,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// get all doctors
exports.getAllDoctors = async (req, res) => {
	try {
		// get all doctors list
		const allUsers = await User.find({ type: 1 });

		// remove password in response
		const result = allUsers.map((user) =>
			Object.assign(user, { password: undefined })
		);

		res.status(200).json({
			result: result,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// get doctor by id
exports.getDoctorById = async (req, res) => {
	try {
		// get all doctors list
		const user = await User.findById({ _id: req.params.id });
		const doctorInfo = await DoctorInfo.findOne({ userId: req.params.id });
		const d = Object.assign(user, { password: undefined });
		const d1 = Object.assign(doctorInfo, { userId: undefined, _id: undefined });

		const doctor = { ...d._doc, ...d1._doc };

		res.status(200).json({
			doctor,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// get all patients by admin
exports.getAllPatients = async (req, res) => {
	try {
		// get all patients list
		const allUsers = await User.find({ type: 2 });

		// remove password in response
		const result = allUsers.map((user) =>
			Object.assign(user, { password: undefined })
		);

		res.status(200).json({
			result: result,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// get patient by id
exports.getPatientById = async (req, res) => {
	try {
		const user = await User.findById({ _id: req.params.id });
		const patientInfo = await ClientInfo.findOne({ userId: req.params.id });
		const d = Object.assign(user, { password: undefined });
		const d1 = Object.assign(patientInfo, {
			userId: undefined,
			_id: undefined,
		});

		const patient = { ...d._doc, ...d1._doc };

		res.status(200).json({
			patient,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};
// add new patient or doctor by admin
exports.addUser = async (req, res) => {
	try {
		let info;
		const {
			username,
			password,
			type,
			firstName,
			lastName,
			profileImage,
			sex,
			dateOfBirth,
			phoneNumber,
			address,
			doctorInfo,
			clientInfo,
		} = req.body;
		const findUser = await User.findOne({ username });
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		if (findUser) {
			res.status(400).json({ message: "این نام کاربری قبلا ثبت شده است." });
			return;
		}
		//save new user
		const newUser = new User({
			_id: new mongoose.Types.ObjectId(),
			username,
			password: hashedPassword,
			isAdmin: false,
			createdAt: new Date().toISOString(),
			firstName,
			lastName,
			type,
			profileImage,
			sex,
			dateOfBirth,
			phoneNumber,
			address,
		});

		//saving the user in database
		const result = await newUser.save();
		// Protect from malicious account information assignment
		if (type == 1) {
			const newDoctor = new DoctorInfo({
				_id: new mongoose.Types.ObjectId(),
				userId: newUser._id,
				...doctorInfo,
			});

			// saving doctor's info in database
			info = await newDoctor.save();
			console.log(await newDoctor.save());
		} else {
			const newPatient = new ClientInfo({
				_id: new mongoose.Types.ObjectId(),
				userId: newUser._id,
				...clientInfo,
			});

			// saving patient's info in database
			info = await newPatient.save();
		}

		if (result && info) {
			res.status(201).json({
				message: "کاربر جدید با موفقیت ثبت شد",
				result: {
					user: Object.assign(result, { password: undefined }),
					Info: info,
				},
			});
			return;
		}

		throw new Error("خطایی رخ داد");
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// delete user by admin
exports.deleteUser = async (req, res) => {
	try {
		const id = req.params.id;
		const findUser = await User.findById(id);
		if (!findUser) {
			res.status(400).json({ message: "کاربر یافت نشد" });
			return;
		}
		if (findUser.isAdmin) {
			res.status(400).json({ message: " کاربر ادمین را نمیتوان حذف کرد " });
			return;
		}
		await findUser.delete();

		res.status(200).json({
			message: "کاربر با موفقیت حذف شد",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

exports.validate = (method) => {
	switch (method) {
		case "login": {
			return [body("username").exists(), body("password").isLength(5)];
		}
		case "addUser": {
			return [
				body("username").exists(),
				body("password").isLength(5).notEmpty(),
				body("type").isNumeric().notEmpty(),
			];
		}
	}
};
