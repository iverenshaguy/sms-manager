import jwt from 'jsonwebtoken';
import { config as getEnv } from 'dotenv';

getEnv();

/**
 * Util to generate token for logged in user
 *
 * @param {object} user user object
 *
 * @returns {string} token
 */
async function generateToken({
  id, email
}) {
  const token = await jwt.sign(
    { id, email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '48h',
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      algorithm: process.env.JWT_ALGO,
    }
  );

  return token;
}

export default generateToken;
