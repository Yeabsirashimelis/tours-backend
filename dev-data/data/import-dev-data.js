//this file is a script to push the a demo data we have to the databbase
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import Tour from '../../models/tourModel.js';

dotenv.config({ path: './config.env' });
// console.log(process.env);

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connection successful!'));

//read JSON file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//import data into db
const importData = async () => {
  try {
    await Tour.create(tours); //pass the array (many objects)
    console.log('data successfully loaded');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('invalid option');
}

console.log(process.argv);
