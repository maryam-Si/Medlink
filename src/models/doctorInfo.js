/** @format */

const mongoose = require("mongoose");

//Each schema maps to a MongoDB collection and
//defines the shape of the documents within that collection.

const DoctorInfo = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		medicalCode: { type: String, required: true },
		speciality: [{ type: String, required: true }],
		WorkSchedule: {
			activeDays: [
				{ day: String, start: String, end: String, duration: String }, //duration->minutes
			],
			bookingInAdvance: String, //days exp 20 days
		},

		yearsExperience: {
			type: Number,
		},
		city: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("DoctorInfo", DoctorInfo);
