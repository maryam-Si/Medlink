/** @format */

const mongoose = require("mongoose");

// Schemas define the structure of your document
const DoctorSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	username: { type: String, required: true }, //national code
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	medicalCode: { type: String, required: true },
	speciality: [String, required],
	WorkSchedule: {
		activeDays: [
			{ day: String, start: String, end: String, duration: String }, //duration->minutes
		],
		bookingInAdvance: String, //days exp 20 days
	},

	profileImage: {
		data: Buffer,
		contentType: String,
	},

	sex: {
		type: String,
		lowercase: true,
		enum: ["male", "female"],
	},
	dateOfBirth: {
		type: String,
	},
	phoneNumber: {
		type: String,
		trim: true,
	},
	address: {
		type: String,
	},
	city: {
		type: String,
	},
	createdAt: { type: String, required: true },
});
// To use our schema definition, we need to convert our UserSchema into a Model we can work with.
module.exports = mongoose.model("Doctor", DoctorSchema);

// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
