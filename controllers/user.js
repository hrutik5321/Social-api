const User = require("../model/User");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(403).json({
        error: "No User Found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  return res.status(200).json(req.profile);
};

//UPDATE USER
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(403).json({
          error: "You Are Not Authorize",
        });
      }
      res.json(user);
    }
  );
};

exports.followUser = async (req, res) => {
  if (req.profile._id != req.auth._id) {
    const followUser = req.profile;
    const authUser = await User.findById(req.auth._id);
    if (!req.profile.followers.includes(req.auth._id)) {
      await followUser.updateOne({ $push: { followers: req.auth._id } });
      await authUser.updateOne({ $push: { followings: req.profile._id } });

      return res.status(200).json({
        success: "Followed Success",
      });
    } else {
      return res.status(500).json({
        message: "You Already follow This User",
      });
    }
  } else {
    return res.status(400).json({
      error: "You Cant Follow Yourself",
    });
  }
};
