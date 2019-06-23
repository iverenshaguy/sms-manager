import Boom from '@hapi/boom';

import models from '../models';
import logger from '../utils/logger';
import sendMessage from '../utils/sendMessage';

const { Message, Contact } = models;

/**
 * MessageController
 * Controller for sms sender and receiver
 *
 * @export
 */
const MessageController = {
  /**
   *  Method for creating a message
   *
   * @param {any} request - hapijs request object
   * @param {any} reply - hapijs reply method
   *
   * @returns {object} response object
   *
   * @memberOf MessageController
   */
  async create(request, reply) {
    try {
      const {
        message, sender, receiver
      } = request.payload;

      const senderId = await MessageController.getContactId(sender);
      const receiverId = await MessageController.getContactId(receiver);

      if (!senderId && !receiverId) {
        return Boom.badRequest('Sender and receiver do not exist');
      }

      if (!senderId) {
        return Boom.badRequest('Sender does not exist');
      }

      if (!receiverId) {
        return Boom.badRequest('Receiver does not exist');
      }

      const created = await Message.create(
        {
          message, receiver, status: 'pending', senderId, receiverId
        }
      );
      const newMessage = MessageController.getMessageObject(created, { sender, receiver });

      sendMessage(created);

      return reply.response({
        statusCode: 201,
        message: 'Message created successfully',
        data: newMessage
      }).code(201);
    } catch (error) {
      logger.error(error.message);
      return Boom.internal(error);
    }
  },

  /**
   *  Method for fetching a message
   *
   * @param {any} request - hapijs request object
   * @param {any} reply - hapijs reply method
   *
   * @returns {object} response object
   *
   * @memberOf MessageController
   */
  async fetch(request, reply) {
    try {
      const {
        id
      } = request.params;

      const message = await Message.findOne(
        {
          where: {
            id
          },
          include: [
            {
              association: 'Sender',
              attributes: ['number'],
            },
            {
              association: 'Receiver',
              attributes: ['number'],
            }
          ]
        }
      );

      if (!message) {
        return Boom.notFound('Message does not exist');
      }

      const foundMessage = MessageController.getMessageObject(message);

      return reply.response({
        statusCode: 200,
        message: 'Message fetched successfully',
        data: foundMessage
      }).code(200);
    } catch (error) {
      logger.error(error.message);
      return Boom.internal(error);
    }
  },

  /**
   *  Method for fetching all messages
   *
   * @param {any} request - hapijs request object
   * @param {any} reply - hapijs reply method
   *
   * @returns {object} response object
   *
   * @memberOf MessageController
   */
  async fetchAll(request, reply) {
    try {
      const messages = await Message.findAll(
        {
          include: [
            {
              association: 'Sender',
              attributes: ['number'],
            },
            {
              association: 'Receiver',
              attributes: ['number']
            }
          ]
        }
      );

      const foundMessages = messages.map(message => MessageController.getMessageObject(message));

      return reply.response({
        statusCode: 200,
        message: 'Messages fetched successfully',
        data: foundMessages
      }).code(200);
    } catch (error) {
      logger.info(error.message);
      return Boom.internal(error);
    }
  },

  /**
   *  Method for deleting a message
   *
   * @param {any} request - hapijs request object
   * @param {any} reply - hapijs reply method
   *
   * @returns {object} response object
   *
   * @memberOf MessageController
   */
  async destroy(request, reply) {
    try {
      const { id } = request.params;
      const message = await Message.findOne(
        {
          where: {
            id
          },
        }
      );

      if (!message) {
        return Boom.notFound('Message does not exist');
      }

      await message.destroy();

      return reply.response({
        statusCode: 200,
        message: 'Message deleted successfully'
      }).code(200);
    } catch (error) {
      logger.error(error.message);
      return Boom.internal(error);
    }
  },

  /**
   *  Method for getting a contact id based on its number
   *
   * @param {any} number - contact number
   *
   * @returns {object} contact
   *
   * @memberOf MessageController
   */
  async getContactId(number) {
    const contact = await Contact.findOne({ where: { number } });

    if (!contact) {
      return null;
    }

    return contact.id;
  },

  /**
   *  Method for getting pojo message from sequelize object
   *
   * @param {any} message - sequelize object
   * @param {any} association - association
   *
   * @returns {object} POJO (Plain Ordinary Javascript Object)
   *
   * @memberOf MessageController
   */
  getMessageObject(message, association = null) {
    const pojo = message.get({ raw: true });
    const {
      id, message: sms, status, createdAt, Sender, Receiver
    } = pojo;
    let sender, receiver;

    if (Sender || Receiver) {
      const senderPojo = Sender.get({ raw: true });
      const receiverPojo = Receiver.get({ raw: true });

      sender = senderPojo.number;
      receiver = receiverPojo.number;
    }

    if (association) {
      /* eslint-disable */
      sender = association.sender;
      receiver = association.receiver;
    }

    return {
      id,
      status,
      sender,
      receiver,
      createdAt,
      message: sms,
    };
  }
};
export default MessageController;
