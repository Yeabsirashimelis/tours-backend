import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

export const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

export const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { tour: newTour },
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) return next(new AppError('Tour not found with that Id', 404));

  res.status(200).json({
    status: 'success',
    result: 1,
    data: { tour },
  });
});

export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) return next(new AppError('Tour not found with that Id', 404));

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) return next(new AppError('Tour not found with that Id', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numTourStarts: -1 } },
    { $limit: 12 },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
