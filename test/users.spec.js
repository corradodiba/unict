const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../app');
const User = require('../models/user');
const crypto = require('crypto');

chai.use(chaiHttp);

describe('GET /', () => {

  it('test users', async() => {
    const result = await chai.request(app).get('/users');
    expect(result.status).to.be.equal(200);
    expect(result.body).to.be.instanceOf(Array);
    expect(result.body).to.has.lengthOf(0);
<<<<<<< HEAD
  })
));
=======
  });

});

describe.only('POST /', () => {

  describe('sending valid user', async() => {

    let user = undefined;
    let cryptedPassword = undefined;

    before('create new valid user payload', () => {

      user = {
        name: "Emmet",
        surname: "Brown",
        email: "strange.doc@hilltown.com",
        password: "outtatime"
      }

      cryptedPassword = new Buffer(
        crypto.createHash('sha256').update(user.password, 'utf8').digest()
      ).toString('base64');

    });

    it('should create a new user', async() => {

      const result = await chai.request(app)
        .post('/users/')
        .type('json')
        .send({...user });

      expect(result.status).to.be.equal(201);
      expect(result.body.name).to.be.equal(user.name);
      expect(result.body.surname).to.be.equal(user.surname);
      expect(result.body.email).to.be.equal(user.email);
      expect(result.body.password).to.be.equal(cryptedPassword);

    });

    after('deleting created user from db', async() => {
      user != undefined ?
        await User.findOneAndDelete({ email: user.email }) : null;
    });

  });


  describe('sending invalid user', () => {

    let user = undefined;

    before('create new wrong user payload', () => {

      user = {
        name: 15,
        surname: "Brown",
        email: "strange.doc@hilltown.com",
        password: "o"
      }

    });

    it('should create a new user', async() => {

      const result = await chai.request(app)
        .post('/users')
        .type('json')
        .send({...user });

      expect(result.status).to.be.equal(400);

    });

    after('deleting created user from db', async() => {
      user != undefined ?
        await User.findOneAndDelete({ email: user.email }) : null;
    });

  });




});
>>>>>>> d3392f2... Add tests for POST /users route
