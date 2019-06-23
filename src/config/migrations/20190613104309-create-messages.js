import logger from 'winston';

export default {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('Messages', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        senderId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Contacts',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        receiverId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Contacts',
            key: 'id'
          },
          onDelete: 'SET NULL'
        },
        message: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('pending', 'delivered', 'invalid', 'undelivered'),
          allowNull: false,
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
      await queryInterface.dropTable('Messages');
    } catch (error) {
      logger.error(error.message);
    }
  }
};
