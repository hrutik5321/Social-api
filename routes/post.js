const express = require("express");
const { isSignin } = require("../controllers/auth");
const {
  createPost,
  getPostById,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getTimeLine,
} = require("../controllers/post");
const Post = require("../model/Post");
const router = express.Router();

router.param("postId", getPostById);

//CREATE POST
router.post("/createPost", isSignin, createPost);

//GETPOST
router.get("/:postId", getPost);

//UPDATE POST
router.put("/update/:postId", isSignin, updatePost);

//DELETE POST
router.delete("/delete/:postId", isSignin, deletePost);

//LIKE DISLIKE POST
router.put("/:postId/like", isSignin, likePost);

//USER TIMELINE
router.get("/timeline/all", isSignin, getTimeLine);

module.exports = router;
