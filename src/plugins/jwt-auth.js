import { config as getEnv } from 'dotenv';
import hapiJwt from 'hapi-auth-jwt2';

import validateToken from '../utils/validateToken';

getEnv();

export const plugin = {
  name: 'jwt',
  async register(server) {
    await server.register(hapiJwt);
    server.auth.strategy(
      'jwt',
      'jwt',
      {
        key: process.env.JWT_SECRET_KEY,
        validate: validateToken,
        verifyOptions: {
          expiresIn: '48h',
          issuer: process.env.JWT_ISSUER,
          audience: process.env.JWT_AUDIENCE,
          algorithm: [process.env.JWT_ALGO],
        }
      }
    );
    server.auth.default('jwt');
  }
};

export default { plugin };
