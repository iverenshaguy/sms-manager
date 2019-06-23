import { config as getEnv } from 'dotenv';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

import Package from '../../package.json';
import validationFailAction from '../utils/validationFailAction';

getEnv();

export default {
  server: {
    port: process.env.PORT || '3000',
    routes: {
      cors: true,
      validate: {
        options: {
          abortEarly: false
        },
        failAction: validationFailAction,
      },
    },
    router: {
      stripTrailingSlash: true
    }
  },
  register: {
    plugins: [
      {
        plugin: './plugins/jwt-auth',
        options: {
          name: 'jwt'
        }
      },
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: 'SMS Manager API Documentation',
            version: Package.version,
            description: 'A REST API to manage SMS'
          },
          securityDefinitions: {
            jwt: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header'
            }
          },
          security: [{ jwt: [] }]
        }
      },
      {
        plugin: './routes/auth.route',
        options: {
          name: 'authRoute'
        },
        routes: {
          prefix: '/v1'
        },
      },
      {
        plugin: './routes/contact.route',
        options: {
          name: 'contactRoute'
        },
        routes: {
          prefix: '/v1'
        },
      },
      {
        plugin: './routes/message.route',
        options: {
          name: 'messageRoute'
        },
        routes: {
          prefix: '/v1'
        },
      },
    ]
  }
};
