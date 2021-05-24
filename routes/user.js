const express = require("express");
const { isSignin, isAuthenticated } = require("../controllers/auth");
const router = express.Router();
const {
  getUserById,
  getUser,
  updateUser,
  followUser,
} = require("../controllers/user");
// const User = require("../model/User");

router.param("userId", getUserById);

//GET USER
router.get("/:userId", isSignin, isAuthenticated, getUser);

//UPDATE USER
router.put("/update/:userId", isSignin, isAuthenticated, updateUser);

//FOLLOW USER
router.put("/follow/:userId", isSignin, followUser);

module.exports = router;
