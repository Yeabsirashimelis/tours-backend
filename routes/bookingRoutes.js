import express from 'express';
import {
  checkIfUserBookedTour,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  getCheckoutSession,
  getMyBookings,
  handleCheckoutSuccess,
  updateBooking,
} from '../controllers/bookingController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Checkout success handler (after Stripe redirects back)
router.get('/checkout-success', handleCheckoutSuccess);

// Get checkout session for a tour (create Stripe checkout)
router.get('/checkout-session/:tourId', getCheckoutSession);

// Get current user's bookings
router.get('/my-bookings', getMyBookings);

// Check if user has booked a specific tour
router.get('/check-booking/:tourId', checkIfUserBookedTour);

// Admin/lead-guide only routes
router.use(restrictTo('admin', 'lead-guide'));

router.route('/').get(getAllBookings).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
