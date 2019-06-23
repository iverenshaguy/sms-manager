import { Sequelize, Model } from 'sequelize';

/**
 * Message Model
 *
 * @export
 * @class Message
 * @extends {Model}
 */
export default class Message extends Model {
  static modelFields = {
    senderId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    receiverId: {
      type: Sequelize.INTEGER,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 918],
          msg: 'Please input a message of not more than 918 characters'
        }
      }
    },
    status: {
      type: Sequelize.ENUM('pending', 'delivered', 'invalid', 'undelivered'),
      allowNull: false
    },
  }

  /**
   * Initializes the Message model
   *
   * @static
   * @memberof Message
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Message model
   */
  static init(sequelize) {
    return super.init(Message.modelFields, { sequelize });
  }

  /**
   * The Message model associations
   *
   * @static
   * @memberof Message
   *
   * @param {any} models all models
   *
   * @returns {null} no return
   */
  static associate(models) {
    const { Contact } = models;

    Message.belongsTo(Contact, {
      as: 'Sender',
      foreignKey: 'senderId',
      onDelete: 'CASCADE'
    });

    Message.belongsTo(Contact, {
      as: 'Receiver',
      foreignKey: 'receiverId',
      onDelete: 'SET NULL'
    });
  }
}
