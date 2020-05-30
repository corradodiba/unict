const expect = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('GET: /users', () => {
    it('Empty Array if no tweets are found', async () => {
        const result = await chai.request(app).get('/tweets');
        expectJson(result);
        expect(result.body).to.be.instanceOf(Array);
        expect(result.body).to.has.lengthOf(0);
    })
});