import logger from 'winston';

export default {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('Users', {
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
          type: Sequelize.STRING,
        },
        email: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING
        },
        password: {
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
      await queryInterface.dropTable('Users');
    } catch (error) {
      logger.error(error.message);
    }
  }
};
