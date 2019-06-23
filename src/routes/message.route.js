import Controller from '../controllers/Message.controller';
import Schema from '../schemas/message.schema';

const {
  create, fetch, fetchAll, destroy
} = Controller;

const { schema, param: paramSchema } = Schema;

export const plugin = {
  name: 'messageRoute',
  async register(server) {
    server.route([
      {
        method: 'POST',
        path: '/messages',
        handler: create,
        options: {
          auth: 'jwt',
          description: 'CREATE A MESSAGE',
          notes: 'Creates a message',
          tags: ['api'],
          validate: {
            payload: schema
          }
        }
      },
      {
        method: 'GET',
        path: '/messages/{id}',
        handler: fetch,
        options: {
          auth: 'jwt',
          description: 'GET A MESSAGE',
          notes: 'Gets a message',
          tags: ['api'],
          validate: {
            params: paramSchema
          }
        }
      },
      {
        method: 'GET',
        path: '/messages',
        handler: fetchAll,
        options: {
          auth: 'jwt',
          description: 'GET ALL MESSAGES',
          notes: 'Gets all messages',
          tags: ['api'],
        }
      },
      {
        method: 'DELETE',
        path: '/messages/{id}',
        handler: destroy,
        options: {
          auth: 'jwt',
          description: 'DELETE A MESSAGE',
          notes: 'Deletes a message',
          tags: ['api'],
          validate: {
            params: paramSchema
          }
        }
      }
    ]);
  }
};

export default { plugin };
