const Post = require("../model/Post");
const User = require("../model/User");

exports.getPostById = (req, res, next, id) => {
  Post.findById(id).exec((err, pos) => {
    if (err) {
      return res.status(403).json({
        error: "No Post Found inDb",
      });
    }
    req.post = pos;
    next();
  });
};

exports.createPost = (req, res) => {
  const post = new Post({
    ...req.body,
    userId: req.auth._id,
  });
  post.save((err, post) => {
    if (err) {
      return res.status(403).json({
        error: "Error to Save Post",
      });
    }
    return res.status(200).json(post);
  });
};

//GET POST
exports.getPost = (req, res) => {
  return res.status(200).json(req.post);
};

//UPDATE POST
exports.updatePost = async (req, res) => {
  if (req.post.userId === req.auth._id) {
    const post = req.post;
    await post.updateOne({ $set: req.body });
    return res.status(200).json({
      message: "Post Updated",
    });
  } else {
    return res.status(500).json({
      error: "You Can Update Only Your Posts",
    });
  }
};

//DELETE POST
exports.deletePost = async (req, res) => {
  if (req.post.userId === req.auth._id) {
    const post = req.post;
    await post.deleteOne();
    return res.status(200).json({
      message: "Post Deleted",
    });
  } else {
    return res.status(500).json({
      error: "You Can Delete Only Your Posts",
    });
  }
};

exports.likePost = async (req, res) => {
  const post = req.post;
  if (!post.likes.includes(req.auth._id)) {
    await post.updateOne({ $push: { likes: req.auth._id } });
    return res.status(200).json({
      message: "Post Hase Been Liked",
    });
  } else {
    await post.updateOne({ $pull: { likes: req.auth._id } });
    return res.status(200).json({
      message: "Post Hase Been Disliked",
    });
  }
};

//TIMELINE
exports.getTimeLine = async (req, res) => {
  const currentUser = await User.findById(req.auth._id);
  const userPosts = await Post.find({ userId: currentUser._id });
  const friendsPosts = await Promise.all(
    currentUser.followings.map((friendId) => {
      return Post.find({ userId: friendId });
    })
  );
  return res.status(200).json(userPosts.concat(...friendsPosts));
};
