import 'dotenv/config';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connectDatabase from './src/configs/database.js';
import environment from './src/configs/enviroment.js';
import { errorHandlingMiddleware } from './src/middleware/errorHandlingMiddleware.js';
import ApiError from './src/utils/ApiError.js';
import router from './src/routes/index.js';
import passport from 'passport';
import User from './src/models/User.js';
import googlePassport from './src/passports/passport.google.js';
import session from 'express-session';
import clientRouter from './src/routes/client/index.js';

const PORT = environment.app.port;

const app = express();

connectDatabase();

// init middleware
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(session({ secret: 'beemely', saveUninitialized: false, resave: false }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('google', googlePassport);

// Routes
app.use('/api', router);
app.use('/api/client', clientRouter);

// Error handler
app.all('*', (req, res, next) => {
  const error = new ApiError(404, 'Route not found');
  next(error);
});

app.use(errorHandlingMiddleware);

// run server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit server express`));
});
