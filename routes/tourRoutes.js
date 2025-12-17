import express from 'express';

import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getDistances,
  getMonthlyPlan,
  getTour,
  getToursByGuide,
  getTourStats,
  getToursWithin,
  updateTour,
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import reviewRouter from './reviewRoutes.js';
import {
  uploadMultipleImages,
  resizeTourImages,
} from '../utils/imageUpload.js';
import { validateGuides } from '../utils/tourValidation.js';

const router = express.Router();

// Nested route: POST /tours/:tourId/reviews
// Nested route: GET /tours/:tourId/reviews
router.use('/:tourId/reviews', reviewRouter);

//params middleware
// router.param('id', checkID);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

// Geospatial routes
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

// Get tours by specific guide
router.route('/guide/:guideId').get(getToursByGuide);

router
  .route('/')
  .get(protect, getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), validateGuides, createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadMultipleImages([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
    resizeTourImages,
    validateGuides,
    updateTour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
