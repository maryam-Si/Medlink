/** @format */

const { createConversation } = require("../controllers/conversation");

const router = require("express").Router();
const passport = require("passport");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createConversation
);

module.exports = router;
