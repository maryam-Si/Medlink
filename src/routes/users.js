/** @format */

const router = require("express").Router();

const UserController = require("./../controllers/user");
const errorInvalid = require("./../middlewares/errorInvalid");

const passport = require("passport");
const adminAuth = require("../middlewares/adminAuth");

router.post(
	"/login",
	UserController.validate("login"),
	errorInvalid,
	UserController.login
);
router.get("/create-first-admin", UserController.createFirstAdmin);

router.get(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	UserController.getUserProfile
);

router.get(
	"/get-all-users",
	passport.authenticate("jwt", { session: false }),
	adminAuth,
	UserController.getAllUsers
);

router.post(
	"/add-user",
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
