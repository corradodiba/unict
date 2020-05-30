const expect = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const createTweet = require("./utils/createTweet");

chai.use(chaiHttp);

describe("GET: /users", () => {
  it("Empty Array if no tweets are found", async () => {
    const result = await chai.request(app).get("/tweets");
    expectJson(result);
    expect(result.body).to.be.instanceOf(Array);
    expect(result.body).to.has.lengthOf(0);
  });
  describe("Tweets inside database", () => {
    let tweet = undefined;
    before(() => {
      tweet = createTweet();
    });
    after(() => {
      if (tweet == undefined) return;
      tweet.remove();
    });
    it("Tweets found if present in database", async () => {
      const tweets = await chai.request(app).get("/tweets");
      expectJson(tweets);
      expect(tweets.body).to.be.instanceOf(Array);
      expect(tweets.body).to.be.lengthOf(1);
    });
  });
});
