import Boom from '@hapi/boom';

import models from '../models';
import logger from '../utils/logger';

const { Contact } = models;

/**
 * ContactController
 * Controller for sms sender and receiver
 *
 * @export
 */
const ContactController = {

  /**
   *  Method for creating a contact
   *
   * @param {any} request - hapijs request object
   * @param {any} reply - hapijs reply method
   *
   * @returns {object} response object
   *
   * @memberOf ContactController
   */
  async create(request, reply) {
    try {
      const [contact, created] = await Contact.findOrCreate({
        where: {
          number: request.payload.number,
        },
        defaults: request.payload,
      });

      if (!created) {
        return Boom.conflict('This contact already exists');
      }

      const newContact = ContactController.getContactObject(contact);

      return reply.response({
        statusCode: 201,
        message: 'Contact added successfully',
        data: newContact
      }).code(201);
    } catch (error) {
      logger.error(error.message);
      return Boom.internal(error);
    }
  },

  /**
   *  Method for fetching a contact
   *
   * @param {any} request - hapijs request object
   * @param {any} reply - hapijs reply method
   *
   * @returns {object} response object
   *
   * @memberOf ContactController
   */
  async fetch(request, reply) {
    try {
      const { number } = request.params;
      const contact = await Contact.findOne({
        where: { number },
      });

      if (!contact) {
        return Boom.notFound('Contact does not exist');
      }

      const foundContact = ContactController.getContactObject(contact);

      return reply.response({
        statusCode: 200,
        message: 'Contact fetched successfully',
        data: foundContact
      }).code(200);
    } catch (error) {
      logger.error(error.message);
      return Boom.internal(error);
    }
  },

  /**
   *  Method for fetching all contacts
   *
   * @param {any} request - hapijs request object
   * @param {any} reply - hapijs reply method
   *
   * @returns {object} response object
   *
   * @memberOf ContactController
   */
  async fetchAll(request, reply) {
    try {
      const contacts = await Contact.findAll();
      const foundContacts = contacts.map(contact => ContactController.getContactObject(contact));

      return reply.response({
        statusCode: 200,
        message: 'Contacts fetched successfully',
        data: foundContacts
      }).code(200);
    } catch (error) {
      logger.error(error.message);
      return Boom.internal(error);
    }
  },

  /**
   *  Method for destroying a contact
   *
   * @param {any} request - hapijs request object
   * @param {any} reply - hapijs reply method
   *
   * @returns {object} response object
   *
   * @memberOf ContactController
   */
  async destroy(request, reply) {
    try {
      const { number } = request.params;
      const contact = await Contact.findOne({
        where: { number },
      });

      if (!contact) {
        return Boom.notFound('Contact does not exist');
      }

      await contact.destroy();

      return reply.response({
        statusCode: 200,
        message: 'Contact deleted successfully'
      }).code(200);
    } catch (error) {
      logger.error(error.message);
      return Boom.internal(error);
    }
  },

  /**
   *  Method for getting pojo contact from sequelize object
   *
   * @param {any} contact - sequelize object
   *
   * @returns {object} POJO (Plain Ordinary Javascript Object)
   *
   * @memberOf ContactController
   */
  getContactObject(contact) {
    const pojo = contact.get({ raw: true });

    delete pojo.updatedAt;

    return pojo;
  }
};
export default ContactController;
