/** @format */

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	username: { type: String, required: true }, //national code
	password: { type: String, required: true },
	isAdmin: { type: Boolean, required: true },
	createdAt: { type: String, required: true },

	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	type: { type: Number }, //1=doctor  2=patient

	profileImage: {
		type: String, // Link
	},
	sex: {
		type: String,
		lowercase: true,
		enum: ["male", "female"],
	},
	dateOfBirth: {
		type: String, // Date
	},
	phoneNumber: {
		type: String,
		trim: true,
	},
	address: {
		type: String,
	},
});

module.exports = mongoose.model("User", UserSchema);
