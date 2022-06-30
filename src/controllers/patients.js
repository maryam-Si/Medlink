/** @format */

const mongoose = require("mongoose");
const Patient = require("../models/patient");
const { signToken } = require("../utils/signToken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
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

		const findPatient = await Patient.findOne({ username });

		if (findPatient) {
			res.status(400).json({ message: "این نام کاربری قبلا ثبت شده است." });
			return;
		}
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		const newPatient = new Patient({
			_id: new mongoose.Types.ObjectId(),
			username,
			password: hashedPassword,
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
			createdAt: new Date().toISOString(),
		});

		//saving the user in database
		const result = await newPatient.save();
		if (result) {
			res.status(201).json({
				message: " ثبت‌نام با موفقیت انجام شد.",
				patient: Object.assign(result, { password: undefined }),
			});
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
		const findPatient = await Patient.findOne({ username });
		if (!findPatient) {
			res.status(400).json({ message: "نام کاربری اشتباه است" });
			return;
		}
		const passwordMatch = await bcrypt.compare(password, findPatient.password);
		if (passwordMatch) {
			res.status(200).json({
				result: {
					token: signToken(findPatient),
					patient: Object.assign(findPatient, { password: undefined }),
				},
			});
			return;
		}
		res.status(400).json({ message: " کلمه عبور اشتباه است" });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

exports.updatePatient = async (req, res) => {
	try {
		console.log(req.user);

		// Unrequire list of fields if not provided
		Object.keys(req.body).forEach((field) => {
			req.user[field] = req.body[field];
		});

		const result = await req.user.save();
		if (result) {
			res.status(201).json({
				message: "تغییرات با موفقیت اعمال شد.",
			});
		}
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
		const patient = await Patient.findById({ _id: req.params.id });

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

// get all patient
exports.getAllPatients = async (req, res) => {
	try {
		const getAllPatient = await Patient.find({});

		// remove password in response
		const result = getAllPatient.map((patient) =>
			Object.assign(patient, { password: undefined })
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

// delete user
exports.deletePatient = async (req, res) => {
	try {
		const id = req.params.id;
		const findPatient = await Patient.findById(id);
		if (!findPatient) {
			res.status(400).json({ message: "کاربر یافت نشد" });
			return;
		}

		await findPatient.delete();

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
