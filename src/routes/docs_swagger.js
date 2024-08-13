import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../../api_docs.yaml');

const file = fs.readFileSync(filePath, 'utf8');
const swaggerDocument = yaml.parse(file);

const docsRouter = express.Router();

// Swagger route
docsRouter.use('', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default docsRouter;
