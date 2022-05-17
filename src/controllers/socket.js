const Message = require("../models/message");
const User = require("../models/user");
const mongoose = require("mongoose");

module.exports.socket = async (socket) => {
  const userId = socket.user.sub;

  const user = await User.findById(userId);

  socket.on("user-join-conversation", async (joinParams) => {
    const conversationId = joinParams.conversationId;
    console.log(`user join to ${conversationId}`);
    socket.on("send-message", async (params) => {
      //save message
      const newMessage = new Message({
        _id: new mongoose.Types.ObjectId(),
        conversationId,
        message: params.message,
        viewFor: user.type,
        createdAt: new Date().toISOString(),
      });
      const result = await newMessage.save();
      global.io.emit("message", result);
    });
  });
};
