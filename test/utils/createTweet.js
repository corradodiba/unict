const Tweet = require("../../models/tweet");
const mongoose = require("mongoose");

module.exports.createTweet = async (userId) => {
  const newTweet = {
    _author: userId || mongoose.Types.ObjectId(),
    tweet: "Hi everyone, this is team flex!",
  };
  return await Tweet.create(newTweet);
};
