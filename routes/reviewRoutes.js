import express from 'express';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setTourUserIds,
  updateReview,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import { checkIfBooked } from '../utils/bookingHelpers.js';

const router = express.Router({ mergeParams: true }); // mergeParams allows access to tourId from parent router

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, checkIfBooked, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);

export default router;
