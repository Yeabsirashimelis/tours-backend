import Booking from '../models/bookingModel.js';
import AppError from './appError.js';
import catchAsync from './catchAsync.js';

// Middleware to check if user has already booked this tour
export const checkExistingBooking = catchAsync(async (req, res, next) => {
  const existingBooking = await Booking.findOne({
    user: req.user.id,
    tour: req.params.tourId,
  });

  if (existingBooking) {
    return next(
      new AppError('You have already booked this tour!', 400)
    );
  }

  next();
});

// Middleware to check if user has booked a tour before allowing review
export const checkIfBooked = catchAsync(async (req, res, next) => {
  // Get the tour ID from body or params (for nested routes)
  const tourId = req.body.tour || req.params.tourId;

  if (!tourId) {
    return next(new AppError('Tour ID is required', 400));
  }

  // Check if user has booked this tour
  const booking = await Booking.findOne({
    user: req.user.id,
    tour: tourId,
  });

  if (!booking) {
    return next(
      new AppError(
        'You can only review tours you have booked! Please book this tour first.',
        403
      )
    );
  }

  next();
});
