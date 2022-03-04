/** @format */

const router = require("express").Router();

const UserController = require("./../controllers/user");
const errorInvalid = require("./../middlewares/errorInvalid");

const passport = require("passport");
const adminAuth = require("../middlewares/adminAuth");

router.get("/create-first-admin", UserController.createFirstAdmin);

router.post(
	"/login",
	UserController.validate("login"),
	errorInvalid,
	UserController.login
);

// // Profile Routes
// Get own user's profile
router.get(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	UserController.getUserProfile
);

// Update profile
router.patch(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	UserController.updateUserProfile
);

router.get(
	"/get-all-users",
	passport.authenticate("jwt", { session: false }),
	adminAuth,
	UserController.getAllUsers
);

router.post(
	"/add-user",
	//This will check if the request has a JWT token and if the JWT token is valid
	passport.authenticate("jwt", { session: false }),
	adminAuth,
	UserController.validate("addUser"),
	errorInvalid,
	UserController.addUser
);

router.delete(
	"/delete-user/:id",
	passport.authenticate("jwt", { session: false }),
	adminAuth,
	UserController.deleteUser
);

module.exports = router;
