const chai = require("chai");
const chaiHttp = require("chai-http");
const { createTweet } = require("./utils/createTweet");
const app = require("../app");
const { expect } = chai;
const mongoose = require("mongoose");
const { fakeLogin } = require("./utils/fakeLogin");
const User = require("../models/user");
const Tweet = require("../models/tweet");
const { accessToken } = require("./utils/getAccessToken");
chai.use(chaiHttp);

describe("GET: /tweets", () => {
  it("Empty Array if no tweets are found", async () => {
    const { body } = await chai.request(app).get("/tweets");
    expect(body).to.be.instanceOf(Array);
    expect(body).to.has.lengthOf(0);
  });
  describe("Tweets inside database", () => {
    let tweet = undefined;
    before(async () => {
      tweet = await createTweet();
    });
    after(() => {
      if (tweet == undefined) return;
      tweet.remove();
    });
    it("Tweets found if present in database", async () => {
      const tweets = await chai.request(app).get("/tweets");
      expect(tweets.body).to.be.instanceOf(Array);
      expect(tweets.body).to.be.lengthOf(1);
    });
  });
});

describe("[DELETE] /tweets/:id", () => {
  it("should return 404 status if user don't exists", async () => {
    const newObjectId = mongoose.Types.ObjectId();
    const result = await chai
      .request(app)
      .delete(`/tweets/${newObjectId}`)
      .set("authorization", accessToken(newObjectId));
    expect(result).to.have.property("status", 404);
    expect(result).to.have.property("body");
    expect(result.body).to.be.deep.equals({ message: "Tweet not found" });
  });
  describe("With an existing user", () => {
    const password = "dummypassword@1";
    let token = undefined;
    let createdTweet = undefined;
    let user = undefined;
    before("create tweet", async () => {
      user = await User.create({
        email: "test@test.it",
        password,
        name: "Giusy",
        surname: "Giangravè",
      });
      const { accessToken } = await fakeLogin(user.email, password);
      createdTweet = await createTweet(user._id.toString());
      token = accessToken;
    });
    after("delete tweet", () => {
      createdTweet ? createdTweet.remove() : console.log("missing tweet");
      user ? user.remove() : console.log("missing user");
    });
    it("Delete existing tweet", async () => {
      const result = await chai
        .request(app)
        .delete(`/tweets/${createdTweet._id.toString()}`)
        .set("authorization", `Bearer ${token}`);
      expect(result).to.have.property("status", 200);
      expect(result).to.have.property("body");
      expect(result.body).to.be.deep.equals({
        message: "Tweet successfully deleted",
      });
    });
  });
});

describe("[Create] /tweets", () => {
  const token = accessToken();

  describe("Creating invalid tweet", () => {
    it("check if tweet length is lower min: 1", async () => {
      const incorrectMinLengthTweet = "";
      const result = await chai
        .request(app)
        .post("/tweets")
        .send({
          tweet: incorrectMinLengthTweet,
        })
        .set("authorization", token);
      expect(result).to.have.property("status", 400);
      expect(result.body).to.have.property("errors");
      expect(result.body.errors).instanceOf(Array);
    });
    it("check if tweet length is greater max: 120", async () => {
      const incorrectMaxLengthTweet = Array(200).join("t");
      const result = await chai
        .request(app)
        .post("/tweets")
        .send({
          tweet: incorrectMaxLengthTweet,
        })
        .set("authorization", token);
      expect(result).to.have.property("status", 400);
      expect(result.body).to.have.property("errors");
      expect(result.body.errors).instanceOf(Array);
    });
  });

  describe("Creating a valid Tweet", () => {
    const password = "mySecretPW";
    let token = undefined;
    let user = undefined;
    let createdTweet = undefined;
    before("creating a new user", async () => {
      user = await User.create({
        name: "Corrado",
        surname: "Dibattista",
        email: "corradodiba@test.it",
        password,
      });
      const { accessToken } = await fakeLogin(user.email, password);
      token = accessToken;
    });
    after("removing user created", async () => {
      user ? user.remove() : console.log("user not found!");
      createdTweet
        ? await Tweet.findByIdAndDelete(createdTweet._id.toString())
        : console.log("tweet not found!");
    });
    it("check valid tweet", async () => {
      const validTweet = "I'm a valid tweet";
      const result = await chai
        .request(app)
        .post("/tweets")
        .send({
          tweet: validTweet,
        })
        .set("authorization", `Bearer ${token}`);
      expect(result).to.have.property("status", 201);
      expect(result.body).to.has.property("_id");
      expect(result.body).to.has.property("tweet", validTweet);
      createdTweet = await Tweet.findById(result.body._id);
    });
  });
});
