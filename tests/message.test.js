require('@babel/register');
const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const dotenv = require('dotenv');

const models = require('../src/models').default;
const serverCreator = require('../src/server').default;
const {
  admin, contact, contact2, credentials, message, badMessage
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
    await models.Contact.create(contact);
    await models.Contact.create(contact2);
  });

  after(async () => {
    await server.stop();
    await models.sequelize.sync({ force: true });
  });

  describe('POST /', () => {
    it('does not create a message for an unauthorised user', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/messages',
        payload: message
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(401);
      expect(result.statusCode).to.equal(401);
      expect(result.error).to.equal('Unauthorized');
      expect(result.message).to.equal('Missing authentication');
    });

    it('creates a new message for an authorized user', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/messages',
        payload: message,
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(201);
      expect(result.statusCode).to.equal(201);
      expect(result.message).to.equal('Message created successfully');
      expect(result.data.id).to.equal(1);
      expect(result.data.sender).to.equal('2348055555123');
      expect(result.data.receiver).to.equal('2348055555124');
      expect(result.data.message).to.equal(message.message);
    });

    it('does not create a new message for a sender that does not exist', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/messages',
        payload: {
          ...message,
          sender: '23454670998'
        },
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(400);
      expect(result.statusCode).to.equal(400);
      expect(result.error).to.equal('Bad Request');
      expect(result.message).to.equal('Sender does not exist');
    });

    it('does not create a new message for a receiver that does not exist', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/messages',
        payload: {
          ...message,
          receiver: '23454670998'
        },
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(400);
      expect(result.statusCode).to.equal(400);
      expect(result.error).to.equal('Bad Request');
      expect(result.message).to.equal('Receiver does not exist');
    });

    it('does not create a new message for a sender and receiver that do not exist', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/messages',
        payload: {
          ...message,
          sender: '23454670997',
          receiver: '23454670998'
        },
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(400);
      expect(result.statusCode).to.equal(400);
      expect(result.error).to.equal('Bad Request');
      expect(result.message).to.equal('Sender and receiver do not exist');
    });

    it('returns joi validation errrors for bad payload', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/messages',
        payload: badMessage,
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
      expect(result.details.sender[0])
        .to.equal('"sender" is required and must contain numbers, be at least 3 - 14 characters long and can start with a +');
      expect(result.details.receiver[0])
        .to.equal('"receiver" is required and must contain numbers, be at least 3 - 14 characters long and can start with a +');
      expect(result.details.message[0])
        .to.equal('"message" length must be less than or equal to 918 characters long');
    });
  });

  describe('GET /{id}', () => {
    it('does not get a message for an unauthorised user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/messages/1'
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(401);
      expect(result.statusCode).to.equal(401);
      expect(result.error).to.equal('Unauthorized');
      expect(result.message).to.equal('Missing authentication');
    });

    it('gets a new message for an authorized user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/messages/1',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(200);
      expect(result.statusCode).to.equal(200);
      expect(result.message).to.equal('Message fetched successfully');
      expect(result.data.id).to.equal(1);
      expect(result.data.sender).to.equal('2348055555123');
      expect(result.data.receiver).to.equal('2348055555124');
      expect(result.data.message).to.equal(message.message);
    });

    it('does not get a message that does not exist', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/messages/2',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(404);
      expect(result.statusCode).to.equal(404);
      expect(result.error).to.equal('Not Found');
      expect(result.message).to.equal('Message does not exist');
    });

    it('returns joi validation errrors for bad param', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/messages/$rdnkel',
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
      expect(result.details.id[0])
        .to.equal('"id" must be a number');
    });
  });

  describe('GET /', () => {
    it('does not get messages for an unauthorised user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/messages'
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(401);
      expect(result.statusCode).to.equal(401);
      expect(result.error).to.equal('Unauthorized');
      expect(result.message).to.equal('Missing authentication');
    });

    it('gets all messages for an authorized user', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/messages',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      const [{
        id, sender, receiver, message: responseMessage
      }] = result.data;

      expect(statusCode).to.equal(200);
      expect(result.statusCode).to.equal(200);
      expect(result.message).to.equal('Messages fetched successfully');
      expect(result.data.length).to.equal(1);
      expect(id).to.equal(1);
      expect(sender).to.equal('2348055555123');
      expect(receiver).to.equal('2348055555124');
      expect(responseMessage).to.equal(message.message);
    });
  });

  describe('DELETE /{id}', () => {
    it('does not delete a message for an unauthorised user', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/v1/messages/1'
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(401);
      expect(result.statusCode).to.equal(401);
      expect(result.error).to.equal('Unauthorized');
      expect(result.message).to.equal('Missing authentication');
    });

    it('deletes an existing message for an authorized user', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/v1/messages/1',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(200);
      expect(result.statusCode).to.equal(200);
      expect(result.message).to.equal('Message deleted successfully');
    });

    it('does not delete a message that does not exist', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/v1/messages/2',
        auth: {
          credentials,
          strategy: 'jwt'
        }
      });

      const { result, statusCode } = response;

      expect(statusCode).to.equal(404);
      expect(result.statusCode).to.equal(404);
      expect(result.error).to.equal('Not Found');
      expect(result.message).to.equal('Message does not exist');
    });

    it('returns joi validation errrors for bad param', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/v1/messages/$rdnkel',
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
      expect(result.details.id[0])
        .to.equal('"id" must be a number');
    });
  });
});
