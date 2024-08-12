import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';

const file = fs.readFileSync('./api_docs.yaml', 'utf8');
const swaggerDocument = yaml.parse(file);

const docsRouter = express.Router();

// Swagger route
docsRouter.use('', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default docsRouter;
