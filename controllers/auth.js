const User = require("../model/User");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//SIGNUP
exports.signUp = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.status(200).json(user);
  });
};

//SIGNIN
exports.signIn = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(403).json({
        error: "User Email Not Found",
      });
    }
    if (!user.autheticate(password)) {
      return res.status(403).json({
        error: "User Password Does Not Match",
      });
    }

    //create Token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, username, email, followers } = user;

    return res
      .status(200)
      .json({ token, user: { _id, username, email, followers } });
  });
};

//CUSTOM MIDDLEWARE
exports.isSignin = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let checker =
    req.params.userId && req.auth && req.params.userId === req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};

// exports.isAuthenticated = (req, res, next) => {
//   let checker = req.profile && req.auth && req.profile._id === req.auth._id;
//   if (!checker) {
//     return res.status(403).json({
//       error: "Access Denied",
//     });
//   }
//   next();
// };
