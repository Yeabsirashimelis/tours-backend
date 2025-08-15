import AppError from '../utils/appError.js';

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  //check if the error is operations (not from code error or third party error. we don't send errors like that to the client)
  //we set this property in the AppError class (make the errors operational if they are related to request and response)
  //Operational, trusted errr: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error error:don't leak error details
  } else {
    // 1, log error
    console.error('ERROR 💥', err);

    // 2, send generic message
    res
      .status(500)
      .json({ status: 'error', message: 'something went very wrong' });
  }
};

export const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    error.stack = err.stack;

    sendErrorForProd(err, res);
  }
  next();
};
