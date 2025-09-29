import dotenv from 'dotenv';
import mongoose from 'mongoose';

// UNCAUGHT EXCEPTION - ARE PROBLEMS WHICH ARE NOT HANDLED IN THE "SYNCRHONOUS CODE"
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💥 Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });
// console.log (process.env);

import app from './app.js';

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Unhandled rejections are Promises that were rejected without a .catch() handler.
// They can come from anywhere in the app (not just Express), e.g. database connection errors.
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥 Shutting down...');
  console.log(err.name, err.message);

  //process.exit will exit ever ything, so we have to finish the requests which are currently getting service
  //server.close only closes the server after finish the pending requests. this the the gracefull way to shut the server down
  server.close(() => {
    process.exit(1);
  });
});
