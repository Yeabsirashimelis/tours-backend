import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';
/*
The slugify npm package is used to convert strings into URL-friendly "slugs." A slug is a simplified, human-readable, and SEO-friendly version of a string, typically used in URLs, filenames, or unique identifiers. 
*/

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal 40 character'],
      minlength: [10, 'A tour name must have more or equal 10 characters'],

      //using external library using mongoose
      // validate: [validator.i  sAlpha, 'Tour name must only contain characters'], //check if the name contains letters only
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //the price discount should always be less than the price
          //this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price {VALUE} should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual properties - don't be saved in the database, but it will returned as part of the document
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; //this - the current document
});

// Virtual populate - get reviews for a tour
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create(), not for insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); //all lowercase slug
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('will save document...');
//   next();
// });

// // runs after .save() and .create(), not for insertMany()
// // we have access to the created document now.
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE- only run for find
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } }); //don't include secret tours
//   next();
// });

//run for findById and findOne
// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } }); //don't include secret tours
//   next();
// });

//use regular expression to make it run for queries starts with find
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); //don't include secret tours
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
//we want the secret tours to be removed from the aggregation related routes
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //add to the pipeline filter in the aggregation pipeline
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
