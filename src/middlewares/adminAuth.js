/** @format */

const adminAuth = async (req, res, next) => {
	try {
		if (req.user.isAdmin) next();
		else res.status(403).json({ message: "شما دسترسی ادمین ندارید" });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

module.exports = adminAuth;
