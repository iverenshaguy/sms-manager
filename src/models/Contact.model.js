import { Sequelize, Model } from 'sequelize';

/**
 * Contact Model
 *
 * @export
 * @class Contact
 * @extends {Model}
 */
export default class Contact extends Model {
  static modelFields = {
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z .-]{2,39}$/i,
          // eslint-disable-next-line max-len
          msg: 'firstname must start with a letter, can have spaces, fullstops or hyphens and be 3 - \
40 characters long'
        }
      },
      set(value) {
        this.setDataValue('firstname', value.trim());
      }
    },
    lastname: {
      type: Sequelize.STRING,
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z .-]{2,39}$/i,
          // eslint-disable-next-line max-len
          msg: 'lastname must start with a letter, can have spaces, fullstops or hyphens and be 3 - \
40 characters long'
        }
      },
      set(value) {
        this.setDataValue('lastname', value.trim());
      }
    },
    number: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[+]*[0-9]{3,14}$/,
          msg: 'number must contain numbers, be at least 3 - 14 characters long and can \
          start with a +'
        }
      },
      set(value) {
        this.setDataValue('number', value.trim());
      }
    },
  }

  /**
   * Initializes the Contact model
   *
   * @static
   * @memberof Contact
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Contact model
   */
  static init(sequelize) {
    return super.init(Contact.modelFields, { sequelize });
  }

  /**
   * The contact model associations
   *
   * @static
   * @memberof Contact
   *
   * @param {any} models all models
   *
   * @returns {null} no return
   */
  static associate(models) {
    const { Message } = models;

    Contact.hasMany(Message, {
      as: 'Sender',
      foreignKey: 'senderId',
      onDelete: 'CASCADE'
    });

    Contact.hasMany(Message, {
      as: 'Receiver',
      foreignKey: 'receiverId',
      onDelete: 'SET NULL'
    });
  }
}
