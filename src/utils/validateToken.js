import { config as getEnv } from 'dotenv';

import models from '../models';

const { User } = models;

getEnv();

/**
 * Util to validate token passed in by the user
 *
 * @param  {object} decoded  the content of the decoded token
 * @param  {request} request hapijs request object
 * @param  {function} callback callback function
 *
 * @return {function} the callback function
 */
const validateToken = async (decoded) => {
  if (!decoded || decoded.aud !== process.env.JWT_AUDIENCE) {
    return { isValid: false };
  }

  const { id, email } = decoded;
  const foundUser = await User.findOne({
    where: { id, email },
  });

  if (!foundUser) {
    return { isValid: false };
  }

  return { isValid: true, credentials: { userId: id, email } };
};

export default validateToken;
