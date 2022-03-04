/** @format */

const mongoose = require("mongoose");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const { signToken } = require("./../utils/signToken");
const User = require("../models/user");
const { param } = require("../routes/users");
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
					user: Object.assign(findUser, { password }),
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
		res.status(200).json({
			result: { user: Object.assign(req.user, { password: undefined }) },
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
		// Unrequire list of fields if not provided
		const unrequiredFields = [
			"username",
			"password",
			"isAdmin",
			"createdAt",
			"type",
		];
		unrequiredFields.forEach((field) => {
			if (!req.body[field]) {
				req.body[field] = req.user[field];
			}
		});

		Object.keys(req.body).forEach((update) => {
			req.user[update] = req.body[update];
		});

		await req.user.save();

		res.status(201).send(req.user);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

// // GET Client(s) Routes
// All patients of doctor ===> ?

exports.getAllUsers = async (req, res) => {
	try {
		const allUsers = await User.find().map((_res) =>
			_res.map((_user) => Object.assign(_user, { password: undefined }))
		);
		res.status(200).json({
			result: allUsers,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};
exports.addUser = async (req, res) => {
	try {
		const {
			username,
			password,
			type,
			fullName,
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
			fullName,
			type,
			profileImage,
			sex,
			dateOfBirth,
			phoneNumber,
			address,
			doctorInfo,
			clientInfo,
		});
		// Protect from malicious account information assignment
		if (newUser.type == 1) {
			delete newUser.clientInfo;
		} else {
			delete newUser.doctorInfo;
		}
		//saving the user in database
		const result = await newUser.save();

		if (result) {
			res.status(201).json({
				message: "کاربر جدید با موفقیت ثبت شد",
				result: {
					user: Object.assign(result, { password: undefined }),
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
				body("profileImage").optional().isString(),
				body("fullName").optional().isString(),
				body("sex").optional().isString(),
				body("phoneNumber").optional().isString(),
				body("dateOfBirth").optional().isString(),
				body("doctorInfo").optional().isObject(),
				body("clientInfo").optional().isObject(),
			];
		}
	}
};
