import Joi from '@hapi/joi';

const name = 'must start with a letter, can have spaces, fullstops or hyphens and be 3 - 40 characters long';

const schema = {
  firstname: Joi.string().required().regex(/^[A-Za-z][A-Za-z .-]{2,39}$/i)
    .error(() => `"firstname" is required and ${name}`),
  lastname: Joi.string().regex(/^[A-Za-z][A-Za-z .-]{2,39}$/i)
    .error(() => `"lastname" ${name}`),
  number: Joi.string().required().regex(/^[+]*[0-9]{3,14}$/)
    .error(() => '"number" is required and must contain numbers, be at least 3 - 14 characters long and can start with a +'),
};

const param = {
  number: Joi.string().required().regex(/^[+]*[0-9]{3,14}$/)
    .error(() => '"number" is required and must contain numbers, be at least 3 - 14 characters long and can start with a +'),
};

export default { schema, param };
