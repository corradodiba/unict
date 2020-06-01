const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');

const app = require("../app");
const { fakeLogin } = require("./utils/fakeLogin");

const User = require("../models/user");

chai.use(chaiHttp);

describe("GET /", () => {

  it("should be born to be alive 🕺💿", async() => {
    const result = await chai.request(app).get("/");

    expect(result.status).to.be.equal(200);
    expect(result.body).to.have.property("message");
    expect(result.body.message).to.be.equal("I'm alive");
  })

});

describe("GET /me", () => {

  describe('GET /me with fake generated existant user', () => {

    const password = "testing-password@1";
    let user = undefined;
    let token = undefined;

    before('create new user into db', async() => {
      user = await User.create({
        name: "Emmet",
        surname: "Brown",
        email: "strange.doc@hilltown.com",
        password,
      });
    });

    beforeEach('some', async() => {
      if (user == undefined) return;
      const { accessToken } = await fakeLogin(user.email, password);
      token = accessToken;
    });

    it('should return same fake-logged user', async() => {
      const result = await chai.request(app)
        .get('/me')
        .set('authorization', `Bearer ${token}`);
      expect(result.status).to.be.equal(200);
      expect(result.body.name).to.be.equal(user.name);
      expect(result.body.surname).to.be.equal(user.surname);
      expect(result.body.email).to.be.equal(user.email);
    });

    after('deleting created user from db', () => {
      user != undefined ? user.remove() : null;
    });

  });

  describe('GET /me with non-existant user', () => {

    let token = undefined;
    const user = {
      name: "Martin",
      surname: "McFly",
      email: "marty.mcfly@hilltown.com",
      password: "getta88mph",
    }

    beforeEach('some', async() => {
      if (user == undefined) return;
      token = jwt.sign(user, JWT_SECRET);
    });

    it('should return 404 because user doesn\'t exist in db', async() => {
      // ** Making a request without inserting the actual user into db,
      // ** but creating token for it
      const result = await chai.request(app)
        .get('/me')
        .set('authorization', `Bearer ${token}`);
      expect(result.status).to.be.equal(404);
      expect(result.body).to.have.property('message');
      expect(result.body.message).to.be.equal('User not found');
    });

  });

});