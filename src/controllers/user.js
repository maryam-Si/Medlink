/** @format */

const mongoose = require("mongoose");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const { signToken } = require("./../utils/signToken");
const User = require("../models/user");
const Appointment = require("../models/appointment");
const DoctorInfo = require("../models/doctorInfo");
const ClientInfo = require("../models/clientInfo");
const clientInfo = require("../models/clientInfo");

exports.registerDoctor = async (req, res) => {
	try {
		const {
			username,
			password,
			firstName,
			lastName,
			sex,
			dateOfBirth,
			phoneNumber,
			profileImage,
			address,
			medicalCode,
			speciality,
			WorkSchedule,
			city,
			yearsExperience,
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
			firstName,
			lastName,
			type: 1,
			profileImage,
			sex,
			dateOfBirth,
			phoneNumber,
			address,
		});
		//saving the user in database
		const newUserAdded = await newUser.save();

		const newDoctorInfo = new DoctorInfo({
			_id: new mongoose.Types.ObjectId(),
			userId: newUser._id,
			medicalCode,
			speciality,
			WorkSchedule,
			city,
			yearsExperience,
		});

		//saving the user in database
		const newDoctorInfoAdded = await newDoctorInfo.save();

		if (newUserAdded && newDoctorInfoAdded) {
			res.status(201).json({
				message: " ثبت‌نام با موفقیت انجام شد.",
				user: Object.assign(newUserAdded, { password: undefined }),
				doctorInfo: newDoctorInfoAdded,
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

exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const findUser = await User.findOne({ username });
		if (!findUser) {
			res.status(400).json({ message: "نام کاربری  اشتباه است" });
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
		res.status(400).json({ message: " کلمه عبور اشتباه است" });

		//create token for  user
		// const token = signToken(adminUser);
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

exports.registerPatient = async (req, res) => {
	try {
		const {
			username,
			password,
			firstName,
			lastName,
			profileImage,
			sex,
			dateOfBirth,
			phoneNumber,
			address,
			weight,
			height,
			bloodType,
			isPregnant,
			specialDiseases,
			currentMedications,
			medicationAllergies,
			surgeries,
		} = req.body;

		const findUser = await User.findOne({ username });

		if (findUser) {
			res.status(400).json({ message: "این نام کاربری قبلا ثبت شده است." });
			return;
		}
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		const newUser = new User({
			_id: new mongoose.Types.ObjectId(),
			username,
			password: hashedPassword,
			firstName,
			lastName,
			type: 2,
			profileImage,
			sex,
			dateOfBirth,
			phoneNumber,
			address,
		});

		//saving the user in database
		const newUserAdded = await newUser.save();

		const newClientInfo = new ClientInfo({
			_id: new mongoose.Types.ObjectId(),
			userId: newUser._id,
			weight,
			height,
			bloodType,
			isPregnant,
			specialDiseases,
			currentMedications,
			medicationAllergies,
			surgeries,
		});

		const newClientInfoAdded = newUserAdded && (await newClientInfo.save());
		if (newClientInfo && newUserAdded) {
			res.status(201).json({
				message: " ثبت‌نام با موفقیت انجام شد.",
				user: Object.assign(newUserAdded, { password: undefined }),
				patientInfo: newClientInfoAdded,
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

exports.updateDoctor = async (req, res) => {
	try {
		// Unrequire list of fields if not provided
		const unrequiredFields = ["username", "type", "medicalCode"];
		unrequiredFields.forEach((field) => {
			if (req.body[field]) {
				req.body[field] = req.user[field];
			}
		});

		const user = await User.findById(req.user._id);
		Object.keys(user._doc).forEach((prop) => {
			if (req.body[prop]) {
				user._doc[prop] = req.body[prop];
			}
		});
		const userChanged = await user.save();

		const doctorInfo = await DoctorInfo.findOne({ userId: req.user._id });
		Object.keys(doctorInfo._doc).forEach((prop) => {
			if (req.body[prop]) {
				doctorInfo._doc[prop] = req.body[prop];
			}
		});
		const doctorInfoChanged = await doctorInfo.save();
		if (userChanged || doctorInfoChanged) {
			res.status(201).json({
				message: "تغییرات با موفقییت ثبت شد.",
				userInfo: Object.assign(userChanged, { password: undefined }),
				doctorInfo: doctorInfoChanged,
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

exports.updatePatient = async (req, res) => {
	try {
		// Unrequire list of fields if not provided
		const unrequiredFields = ["username", "type"];
		unrequiredFields.forEach((field) => {
			if (req.body[field]) {
				req.body[field] = req.user[field];
			}
		});

		const user = await User.findById(req.user._id);
		Object.keys(user._doc).forEach((prop) => {
			if (req.body[prop]) {
				user._doc[prop] = req.body[prop];
			}
		});
		const userChanged = await user.save();

		const patientInfo = await ClientInfo.findOne({ userId: req.user._id });
		Object.keys(patientInfo._doc).forEach((prop) => {
			if (req.body[prop]) {
				patientInfo._doc[prop] = req.body[prop];
			}
		});
		const patientInfoChanged = await patientInfo.save();

		if (userChanged || patientInfoChanged) {
			res.status(201).json({
				message: "تغییرات با موفقییت ثبت شد.",
				userInfo: Object.assign(userChanged, { password: undefined }),
				patientInfo: Object.assign(patientInfoChanged, { userId: undefined }),
			});
		}
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
		const doctors = await DoctorInfo.find().populate("userId");

		res.status(200).json({
			result: doctors.map((item) => ({
				_id: item.userId.id,
				userInfo: Object.assign(item.userId, {
					password: undefined,
					_id: undefined,
				}),
				doctorInfo: Object.assign(item, { userId: undefined }),
			})),
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// // get doctor by id
exports.getDoctorById = async (req, res) => {
	try {
		// get all doctors list
		const user = await User.findById({ _id: req.params.id });
		const doctorInfo = await DoctorInfo.findOne({ userId: req.params.id });
		const d = Object.assign(user, { password: undefined });
		const d1 = Object.assign(doctorInfo, { _id: undefined });

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

// // get all patients
exports.getAllPatients = async (req, res) => {
	try {
		const patients = await ClientInfo.find().populate("userId");
		res.status(200).json({
			result: patients.map((item) => ({
				_id: item.userId.id,
				userInfo: Object.assign(item.userId, {
					password: undefined,
					_id: undefined,
				}),
				patientInfo: Object.assign(item, { userId: undefined }),
			})),
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// // get patient by id
exports.getPatientById = async (req, res) => {
	try {
		const user = await User.findById({ _id: req.params.id });
		const patientInfo = await ClientInfo.findOne({ userId: req.params.id });
		const d = Object.assign(user, { password: undefined });
		const d1 = Object.assign(patientInfo, {
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

// // // GET Patient(s) Routes
// // All Patients of especific doctor
// exports.getDoctorPatients = async (req, res) => {
// 	try {
// 		if (req.user.type == 2) {
// 			res.status(403).send({ error: "شما دسترسی ندارید" });
// 		}

// 		// Change this to allow null
// 		const bookedAppointments = await Appointment.find(
// 			{ doctorId: req.user._id },
// 			function (err) {
// 				if (err) {
// 					return res.status(404).send();
// 				}
// 			}
// 		);

// 		const patients = bookedAppointments.map((app) => app.clientId);

// 		// Assign all users to the user of bookedAppointments
// 		const users = await User.find({ _id: { $in: patients } }, function (err) {
// 			if (err) {
// 				return res.status(404).send();
// 			}
// 		});

// 		// Only send appropriate data
// 		res.status(200).json({
// 			patients: users,
// 		});
// 	} catch (e) {
// 		res.status(500).send();
// 	}
// };

// // All Doctors who visited a patient
// exports.getPatientDoctors = async (req, res) => {
// 	try {
// 		const bookedAppointments = await Appointment.find(
// 			{ clientId: req.user._id },
// 			function (err) {
// 				if (err) {
// 					return res.status(404).send();
// 				}
// 			}
// 		);

// 		const doctors = bookedAppointments.map((app) => app.doctorId);

// 		const users = await User.find({ _id: { $in: doctors } }, function (err) {
// 			if (err) {
// 				return res.status(404).send();
// 			}
// 		});

// 		// Only send appropriate data
// 		res.status(200).json({
// 			doctors: users,
// 		});
// 	} catch (err) {
// 		console.log(err);
// 		res.status(500).json({
// 			error: err,
// 		});
// 	}
// };

// // delete doctor
exports.deleteDoctor = async (req, res) => {
	try {
		const id = req.params.id;
		const findUser = await User.findById(id);
		if (!findUser) {
			res.status(400).json({ message: "کاربر یافت نشد" });
			return;
		}

		await findUser.delete();
		await DoctorInfo.deleteOne({ userId: findUser._id });

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
// // delete patient
exports.deletePatient = async (req, res) => {
	try {
		const id = req.params.id;
		const findUser = await User.findById(id);
		if (!findUser) {
			res.status(400).json({ message: "کاربر یافت نشد" });
			return;
		}

		await findUser.delete();
		await ClientInfo.deleteOne({ userId: findUser._id });

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

// exports.validate = (method) => {
// 	switch (method) {
// 		case "login": {
// 			return [body("username").exists(), body("password").isLength(5)];
// 		}
// 		case "addUser": {
// 			return [
// 				body("username").exists(),
// 				body("password").isLength(5).notEmpty(),
// 				body("type").isNumeric().notEmpty(),
// 			];
// 		}
// 	}
// };
