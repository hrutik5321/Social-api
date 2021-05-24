const express = require("express");
const router = express.Router();
const { signUp, signIn, isSignin } = require("../controllers/auth");
const User = require("../model/User");

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Your Server Is Running",
  });
});

//SignUp
router.post("/signup", signUp);

//Signin
router.post("/signin", signIn);

//testing route
router.get("/testing", isSignin, (req, res) => {
  return res.status(200).json({
    message: "Testing Route Working",
    user: req.auth._id,
  });
});

module.exports = router;
