import { config as getEnv } from 'dotenv';

import models from '../../models';
import logger from '../../utils/logger';

const { User } = models;

getEnv();

export default {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert('Users', [
        {
          firstname: 'Admin',
          lastname: 'Admin',
          email: process.env.ADMIN_EMAIL,
          password: User.encryptPassword(process.env.ADMIN_PASSWORD),
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
    } catch (error) {
      logger.error(error.message);
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.bulkDelete('Users', null, {});
    } catch (error) {
      logger.error(error.message);
    }
  }
};
