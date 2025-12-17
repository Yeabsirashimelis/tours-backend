import mongoose from 'mongoose';
import Tour from './tourModel.js';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
      trim: true,
      maxlength: [500, 'Review must be less than 500 characters'],
      minlength: [10, 'Review must be at least 10 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Review must have a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create compound index to ensure one user can only review a tour once
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Query middleware to populate user and tour data
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Static method to calculate average ratings for a tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // Reset to defaults if no reviews
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Update ratings after a new review is saved
reviewSchema.post('save', function () {
  // this points to current review
  // this.constructor points to the Review model
  this.constructor.calcAverageRatings(this.tour);
});

// Update ratings after a review is updated or deleted
// findByIdAndUpdate and findByIdAndDelete trigger findOneAnd... query middleware
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Store the review document for use in post middleware
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
