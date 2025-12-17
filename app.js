import express from 'express';

import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import AppError from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//1, GLOBAL MIDDLEWARES

//set security HTTP headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //logging the request automatically
}

//limit requests from same IP
//for the same ip address - 100 requests in one hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'too many requests from this IP ADDRESS, please try again in an hour',
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

//Data sanitization XXS attacks (cross-site scripting)
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    //whitelist is the query params fields for which duplicate is allowed
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//serving static files from the public folder
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//  3, ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
