import Controller from '../controllers/Contact.controller';
import Schema from '../schemas/contact.schema';

const {
  create, fetch, fetchAll, destroy
} = Controller;

const { schema, param: paramSchema } = Schema;

export const plugin = {
  name: 'contactRoute',
  async register(server) {
    server.route([
      {
        method: 'POST',
        path: '/contacts',
        handler: create,
        options: {
          auth: 'jwt',
          description: 'CREATE A CONTACT',
          notes: 'Creates a new contact',
          tags: ['api'],
          validate: {
            payload: schema
          },
        },
      },
      {
        method: 'GET',
        path: '/contacts/{number}',
        handler: fetch,
        options: {
          auth: 'jwt',
          description: 'GET A CONTACT',
          notes: 'Gets a contact',
          tags: ['api'],
          validate: {
            params: paramSchema
          }
        }
      },
      {
        method: 'GET',
        path: '/contacts',
        handler: fetchAll,
        options: {
          auth: 'jwt',
          description: 'GET ALL CONTACTS',
          notes: 'Gets all contacts',
          tags: ['api'],
        }
      },
      {
        method: 'DELETE',
        path: '/contacts/{number}',
        handler: destroy,
        options: {
          auth: 'jwt',
          description: 'DELETE A CONTACT',
          notes: 'Deletes a contact',
          tags: ['api'],
          validate: {
            params: paramSchema
          }
        }
      },
    ]);
  }
};

export default { plugin };
