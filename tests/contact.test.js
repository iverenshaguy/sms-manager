require('@babel/register');
const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const dotenv = require('dotenv');

const models = require('../src/models').default;
const serverCreator = require('../src/server').default;
const {
  admin, contact, badContact, credentials
} = require('./helpers/fixtures').default;

const lab = (exports.lab = Lab.script());
const {
  describe, it, before, after
} = lab;
const { expect } = Code;

dotenv.config();

describe('Contact', () => {
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

  describe('POST /', () => {
    it('does not create a contact for an unauthorised user', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/contacts',
        payload: contact
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(401);
      expect(result.statusCode).to.equal(401);
      expect(result.error).to.equal('Unauthorized');
      expect(result.message).to.equal('Missing authentication');
    });

    it('creates a new contact for an authorized user', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/contacts',
        payload: contact,
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(201);
      expect(result.statusCode).to.equal(201);
      expect(result.message).to.equal('Contact added successfully');
      expect(result.data.id).to.equal(1);
      expect(result.data.firstname).to.equal('test');
      expect(result.data.lastname).to.equal('test');
      expect(result.data.number).to.equal('2348055555123');
    });

    it('does not create a new contact that already exists', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/contacts',
        payload: contact,
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(409);
      expect(result.statusCode).to.equal(409);
      expect(result.error).to.equal('Conflict');
      expect(result.message).to.equal('This contact already exists');
    });

    it('returns joi validation errrors for bad payload', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/contacts',
        payload: badContact,
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(400);
      expect(result.statusCode).to.equal(400);
      expect(result.error).to.equal('Bad Request');
      expect(result.message).to.equal('This request cannot be completed due to invalid input');
      expect(result.details.firstname[0])
        .to.equal('"firstname" is required and must start with a letter, can have spaces, fullstops or hyphens and be 3 - 40 characters long');
      expect(result.details.lastname[0])
        .to.equal('"lastname" must start with a letter, can have spaces, fullstops or hyphens and be 3 - 40 characters long');
      expect(result.details.number[0])
        .to.equal('"number" is required and must contain numbers, be at least 3 - 14 characters long and can start with a +');
    });
  });

  describe('GET /{number}', () => {
    it('does not get a contact for an unauthorised user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/contacts/2348055555123'
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(401);
      expect(result.statusCode).to.equal(401);
      expect(result.error).to.equal('Unauthorized');
      expect(result.message).to.equal('Missing authentication');
    });

    it('gets a new contact for an authorized user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/contacts/2348055555123',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(200);
      expect(result.statusCode).to.equal(200);
      expect(result.message).to.equal('Contact fetched successfully');
      expect(result.data.id).to.equal(1);
      expect(result.data.firstname).to.equal('test');
      expect(result.data.lastname).to.equal('test');
      expect(result.data.number).to.equal('2348055555123');
    });

    it('does not get a contact that does not exist', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/contacts/2348055555126',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(404);
      expect(result.statusCode).to.equal(404);
      expect(result.error).to.equal('Not Found');
      expect(result.message).to.equal('Contact does not exist');
    });

    it('returns joi validation errrors for bad param', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/contacts/$rdnkel',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(400);
      expect(result.statusCode).to.equal(400);
      expect(result.error).to.equal('Bad Request');
      expect(result.message).to.equal('This request cannot be completed due to invalid input');
      expect(result.details.number[0])
        .to.equal('"number" is required and must contain numbers, be at least 3 - 14 characters long and can start with a +');
    });
  });

  describe('GET /', () => {
    it('does not get contacts for an unauthorised user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/contacts'
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(401);
      expect(result.statusCode).to.equal(401);
      expect(result.error).to.equal('Unauthorized');
      expect(result.message).to.equal('Missing authentication');
    });

    it('gets all contacts for an authorized user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/contacts',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      const [{
        id, firstname, lastname, number
      }] = result.data;

      expect(statusCode).to.equal(200);
      expect(result.statusCode).to.equal(200);
      expect(result.message).to.equal('Contacts fetched successfully');
      expect(result.data.length).to.equal(1);
      expect(id).to.equal(1);
      expect(firstname).to.equal('test');
      expect(lastname).to.equal('test');
      expect(number).to.equal('2348055555123');
    });
  });

  describe('DELETE /{number}', () => {
    it('does not delete a contact for an unauthorised user', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/v1/contacts/2348055555123'
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(401);
      expect(result.statusCode).to.equal(401);
      expect(result.error).to.equal('Unauthorized');
      expect(result.message).to.equal('Missing authentication');
    });

    it('deletes an existing contact for an authorized user', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/v1/contacts/2348055555123',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(200);
      expect(result.statusCode).to.equal(200);
      expect(result.message).to.equal('Contact deleted successfully');
    });

    it('does not delete a contact that does not exist', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/v1/contacts/2348055555123',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(404);
      expect(result.statusCode).to.equal(404);
      expect(result.error).to.equal('Not Found');
      expect(result.message).to.equal('Contact does not exist');
    });

    it('returns joi validation errrors for bad param', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/v1/contacts/$rdnkel',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(400);
      expect(result.statusCode).to.equal(400);
      expect(result.error).to.equal('Bad Request');
      expect(result.message).to.equal('This request cannot be completed due to invalid input');
      expect(result.details.number[0])
        .to.equal('"number" is required and must contain numbers, be at least 3 - 14 characters long and can start with a +');
    });
  });
});
