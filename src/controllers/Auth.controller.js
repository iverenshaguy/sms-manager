import Boom from '@hapi/boom';

import models from '../models';
import generateToken from '../utils/generateToken';
import logger from '../utils/logger';

const { User } = models;

/**
 * AuthController
 * Controller for authenticationg users
 *
 * @export
 */
const AuthController = {
  /**
   *  Method for signing in a user
   *
   * @param {any} request - hapijs request object
   * @param {any} reply - hapijs reply method
   *
   * @returns {object} response object
   *
   * @memberOf AuthController
   */
  async signin(request, reply) {
    try {
      const { email, password } = request.payload;
      const foundUser = await User.findOne({
        where: {
          email
        }
      });

      if (!foundUser) {
        return Boom.unauthorized('Invalid credentials');
      }

      const {
        id, firstname, lastname, password: hashedPassword
      } = foundUser.get({ plain: true });
      const isVerifiedCredentials = User.comparePassword(password, hashedPassword);

      if (!isVerifiedCredentials) {
        return Boom.unauthorized('Invalid credentials');
      }

      const token = await generateToken({ id, email });

      return reply.response({
        statusCode: 200,
        data: {
          id,
          firstname,
          lastname,
          email
        },
        token
      }).code(200);
    } catch (error) {
      logger.info(error.message);
      return Boom.internal(error);
    }
  }
};
export default AuthController;
