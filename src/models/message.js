/** @format */

const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		conversationId: { type: mongoose.Schema.Types.ObjectId, required: true },
		message: { type: String, required: true },
		viewFor: { type: Number, required: true }, //1=doctor 2=patient
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
