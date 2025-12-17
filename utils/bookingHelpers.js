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

// Middleware to check if user is trying to review a tour they've booked
export const checkIfBooked = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({
    user: req.user.id,
    tour: req.body.tour || req.params.tourId,
  });

  if (!booking) {
    return next(
      new AppError('You can only review tours you have booked!', 403)
    );
  }

  next();
});
