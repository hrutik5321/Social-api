const router = require("express").Router();
const Conversation = require("../model/Conversation");
const { isSignin } = require("../controllers/auth");

router.post("/", isSignin, async (req, res) => {
  const newConversation = new Conversation({
    members: [req.auth._id, req.body.receiverId],
  });
  try {
    const saveConversation = await newConversation.save();
    return res.status(200).json(saveConversation);
  } catch (err) {
    return res.status(200).json(err);
  }
});

router.get("/", isSignin, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.auth._id] },
    });
    return res.status(200).json(conversation);
  } catch (err) {
    return res.status(200).json(err);
  }
});

module.exports = router;
