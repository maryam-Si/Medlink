const mongoose = require("mongoose");
const Conversation = require("../models/conversation");

module.exports.createConversation = async (req, res, next) => {
  try {
    const { doctorId, patientId } = req.body;

    const newConversation = new Conversation({
      _id: new mongoose.Types.ObjectId(),
      patientId,
      doctorId,
      createdAt: new Date().toISOString(),
    });

    const result = await newConversation.save();

    if (result)
      return res
        .status(201)
        .json({ msg: "conversation added successfully.", result });
    else
      return res
        .status(400)
        .json({ msg: "Failed to add message to the database" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
