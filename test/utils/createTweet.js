const Tweet = require("../../models/tweet");

module.exports.createTweet = async () => {
  const newTweet = {
    _author: mongoose.Types.ObjectId(),
    tweet: "Hi everyone, this is team flex!",
  };
  return await Tweet.create(newTweet);
};
