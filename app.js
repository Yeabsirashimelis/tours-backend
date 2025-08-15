import express from 'express';

import qs from 'qs';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import { fail } from 'assert';
import AppError from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//1, MIDDLEWARES

// if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev')); //logging the request automatically
// }
app.use(express.json());
app.use(express.static(`${__dirname}/public`)); //serving static files from the public folder

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//  3, ROUTES
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

//for route calls that don't exist
app.all('*', (req, res, next) => {
  //this is before using error middleware
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  //this is after using error middlware. but it will be repetitive to use this in all the controller functions
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err); //passing error to the next function makes the callstack to pass all other middlewares and go to the error middleware

  //use custom ERROR class I created which can be used anywhere
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); //passing error to the next function makes the callstack to pass all other middlewares and go to the error middleware
});

//error middleware - automatically called when there is an error
app.use(globalErrorHandler);
export default app;
