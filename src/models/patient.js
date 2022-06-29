/** @format */

const mongoose = require("mongoose");

// Schemas define the structure of your document
const PatientSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	username: { type: String, required: true }, //national code
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	profileImage: {
		data: Buffer,
		contentType: String,
	},
	sex: {
		type: String,
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
	weight: {
		type: String,
	},
	height: { type: String },

	bloodType: {
		type: String,
		enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
	},
	isPregnant: { type: Boolean },
	specialDiseases: [String],

	currentMedications: [String],

	medicationAllergies: [String],
	surgeries: [String],
	createdAt: { type: String, required: true },
});
// To use our schema definition, we need to convert our UserSchema into a Model we can work with.
module.exports = mongoose.model("Patient", PatientSchema);

// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
