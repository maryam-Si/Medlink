/** @format */

const { getMessages } = require("../controllers/message");
const router = require("express").Router();
const passport = require("passport");

router.get(
  "/:conversationId",
  passport.authenticate("jwt", { session: false }),
  getMessages
);

module.exports = router;
