/** @format */

const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: String, required: true },
});

module.exports = mongoose.model("Conversation", ConversationSchema);
