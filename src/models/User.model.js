import { Sequelize, Model } from 'sequelize';
import bcrypt from 'bcrypt';

/**
 * User Model
 *
 * @export
 * @class User
 * @extends {Model}
 */
export default class User extends Model {
  static modelFields = {
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z .-]{2,39}$/i,
          // eslint-disable-next-line max-len
          msg: 'firstname must start with a letter, can have spaces, fullstops or hyphens and be 3 - \
40 characters long.'
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
40 characters long.'
        }
      },
      set(value) {
        this.setDataValue('lastname', value.trim());
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'There is an existing account with this number',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please input a valid email'
        }
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isMinLength(value) {
          if (value.length < 8) {
            throw new Error('Please input a password with more than 7 characters');
          }

          const hash = User.encryptPassword(value);
          this.setDataValue('password', hash);
        }
      }
    }
  }

  /**
   * Initializes the User model
   *
   * @static
   * @memberof User
   *
   * @param {object} sequelize the sequelize obbject
   *
   * @returns {object} the User model
   */
  static init(sequelize) {
    return super.init(User.modelFields, { sequelize });
  }

  /**
   * Hashes a string password
   *
   * @static
   * @memberof User
   *
   * @param {string} password the supplied password
   *
   * @returns {string} hashedPassword the hashed password
   */
  static encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * Compares a string password with a hashed password
   *
   * @static
   * @memberof User
   *
   * @param {string} password the supplied password
   * @param {string} hashedPassword the hashed password
   *
   * @returns {boolean} the result of the password comparison
   */
  static comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
