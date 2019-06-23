import Controller from '../controllers/Auth.controller';
import Schema from '../schemas/auth.schema';

const { signin } = Controller;
const { signin: signinSchema } = Schema;

export const plugin = {
  name: 'authRoute',
  async register(server) {
    server.route([
      {
        method: 'POST',
        path: '/auth/signin',
        handler: signin,
        options: {
          auth: false,
          description: 'SIGN IN',
          notes: 'Signs a user into the app',
          tags: ['api'],
          validate: {
            payload: signinSchema
          }
        }
      }
    ]);
  }
};

export default { plugin };
