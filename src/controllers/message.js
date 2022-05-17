const Conversation = require("../models/conversation");
const Messages = require("../models/message");
const User = require("../models/user");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    //find conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(400).json({
        message: "گفتگویی یافت نشد .",
      });
    }

    //find user for chat title
    const userChat = await User.findById(
      req.user.type === 1 ? conversation.patientId : conversation.doctorId
    );

    const messages = await Messages.find({
      conversationId,
    }).sort({ createdAt: "desc" });

    res.json({
      result: {
        messages,
        chatWith: {
          firstName: userChat.firstName,
          lastName: userChat.lastName,
        },
      },
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data)
      return res.status(201).json({ msg: "Message added successfully." });
    else
      return res
        .status(400)
        .json({ msg: "Failed to add message to the database" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
