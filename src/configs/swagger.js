import swaggerJsdoc from 'swagger-jsdoc';
import environment from './enviroment.js'

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "LogRocket Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
      },
      servers: [
        {
          url: 'http://localhost:8080',
          description: 'DEV server',
        },
      ],
    },
    apis: ["../routes/*.js"],
  };
  
export const swaggerDocs = swaggerJsdoc(options);