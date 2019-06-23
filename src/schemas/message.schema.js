import Joi from '@hapi/joi';

const number = 'is required and must contain numbers, be at least 3 - 14 characters long and can start with a +';

const schema = {
  sender: Joi.string().required().regex(/^[+]*[0-9]{3,14}$/)
    .error(() => `"sender" ${number}`),
  receiver: Joi.string().required().regex(/^[+]*[0-9]{3,14}$/)
    .error(() => `"receiver" ${number}`),
  // at most 6 pages of text messages i.e 153 * 6
  message: Joi.string().max(918).required()
};

const param = {
  id: Joi.number().required()
};

export default { schema, param };
