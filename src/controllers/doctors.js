/** @format */

const mongoose = require("mongoose");
const Doctor = require("../models/doctor");
const bcrypt = require("bcrypt");
const { signToken } = require("./../utils/signToken");
exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const findDoctor = await Doctor.findOne({ username });
		if (!findDoctor) {
			res.status(400).json({ message: "نام کاربری اشتباه است" });
			return;
		}
		const passwordMatch = await bcrypt.compare(password, findDoctor.password);
		if (passwordMatch) {
			res.status(200).json({
				result: {
					token: signToken(findDoctor),
					doctor: Object.assign(findDoctor, { password: undefined }),
				},
			});
			return;
		}
		res.status(400).json({ message: " کلمه عبور اشتباه است" });
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

exports.register = async (req, res) => {
	try {
		const {
			username,
			password,
			firstName,
			lastName,
			medicalCode,
			speciality,
			WorkSchedule,
			profileImage,
			sex,
			dateOfBirth,
			phoneNumber,
			address,
			city,
		} = req.body;
		const findDoctor = await Doctor.findOne({ username });
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		if (findDoctor) {
			res.status(400).json({ message: "این نام کاربری قبلا ثبت شده است." });
			return;
		}
		//save new user
		const newDoctor = new Doctor({
			_id: new mongoose.Types.ObjectId(),
			username,
			password: hashedPassword,
			createdAt: new Date().toISOString(),
			firstName,
			lastName,
			profileImage,
			sex,
			dateOfBirth,
			phoneNumber,
			address,
			medicalCode,
			speciality,
			WorkSchedule,
			city,
		});

		//saving the user in database
		const result = await newDoctor.save();

		if (result) {
			res.status(201).json({
				message: " ثبت‌نام با موفقیت انجام شد.",
				doctor: Object.assign(result, { password: undefined }),
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

exports.updateDoctor = async (req, res) => {
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

// get doctor by id
exports.getDoctorById = async (req, res) => {
	try {
		const doctor = await Doctor.findById({ _id: req.params.id });

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

// get all doctors
exports.getAllDoctors = async (req, res) => {
	try {
		// get all doctors list
		const allDoctors = await Doctor.find({});

		// remove password in response
		const result = allDoctors.map((doctor) =>
			Object.assign(doctor, { password: undefined })
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
exports.deleteDoctor = async (req, res) => {
	try {
		const id = req.params.id;
		const findDoctor = await Doctor.findById(id);
		if (!findDoctor) {
			res.status(400).json({ message: "کاربر یافت نشد" });
			return;
		}

		await findDoctor.delete();

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
