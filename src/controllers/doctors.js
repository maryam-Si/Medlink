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
