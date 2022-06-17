/** @format */

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
