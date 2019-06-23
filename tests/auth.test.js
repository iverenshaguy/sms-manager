require('@babel/register');
const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const dotenv = require('dotenv');

const models = require('../src/models').default;
const serverCreator = require('../src/server').default;
const { admin, badAdmin, credentials } = require('./helpers/fixtures').default;

const lab = (exports.lab = Lab.script());
const {
  describe, it, before, after
} = lab;
const { expect } = Code;

dotenv.config();

describe('Auth', () => {
  let server;

  before(async () => {
    await models.sequelize.sync({ force: true });
    const { init } = await serverCreator();
    server = await init();
  });

  before(async () => {
    await models.User.create(admin);
  });

  after(async () => {
    await server.stop();
    await models.sequelize.sync({ force: true });
  });

  it('signs a user into the app', async () => {
    const {
      email, password, firstname, lastname
    } = admin;
    const response = await server.inject({
      method: 'POST',
      url: '/v1/auth/signin',
      payload: {
        email,
        password
      }
    });

    const { result, statusCode } = response;

    expect(statusCode).to.equal(200);
    expect(result.statusCode).to.equal(200);
    expect(result.data.firstname).to.equal(firstname);
    expect(result.data.lastname).to.equal(lastname);
    expect(result.data.email).to.equal(email);
    expect(result.data.password).to.equal(undefined);
  });

  it('does not sign in a user with invalid credentials', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/auth/signin',
      payload: {
        email: 'wrong@test.com',
        password: 'wrongpassword'
      }
    });

    const { result, statusCode } = response;

    expect(statusCode).to.equal(401);
    expect(result.statusCode).to.equal(401);
    expect(result.error).to.equal('Unauthorized');
    expect(result.message).to.equal('Invalid credentials');
  });

  it('returns joi validation errrors for bad payload', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/auth/signin',
      payload: badAdmin
    });

    const { result, statusCode } = response;

    expect(statusCode).to.equal(400);
    expect(result.statusCode).to.equal(400);
    expect(result.error).to.equal('Bad Request');
    expect(result.message).to.equal('This request cannot be completed due to invalid input');
    expect(result.details.email[0]).to.equal('"email" must be a valid email');
    expect(result.details.password[0]).to.equal('"password" is not allowed to be empty');
    expect(result.details.password[1])
      .to.equal('"password" length must be at least 8 characters long');
  });

  it('returns not found error for unexisting route', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/dtryu',
      auth: {
        credentials,
        strategy: 'jwt'
      }
    });

    const { result, statusCode } = response;

    expect(statusCode).to.equal(404);
    expect(result.statusCode).to.equal(404);
    expect(result.error).to.equal('Not Found');
    expect(result.message).to.equal('Resource not found');
  });
});
