import logger from 'winston';

export default {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('Contacts', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        firstname: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        lastname: {
          type: Sequelize.STRING
        },
        number: {
          allowNull: false,
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    } catch (error) {
      logger.error(error.message);
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.dropTable('Contacts');
    } catch (error) {
      logger.error(error.message);
    }
  }
};
