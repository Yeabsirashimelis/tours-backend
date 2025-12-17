import User from '../models/userModel.js';
import AppError from './appError.js';
import catchAsync from './catchAsync.js';

// Middleware to validate that all guides have the correct role
export const validateGuides = catchAsync(async (req, res, next) => {
  if (!req.body.guides || req.body.guides.length === 0) {
    return next();
  }

  // Get all guide users
  const guides = await User.find({ _id: { $in: req.body.guides } });

  // Check if all users exist
  if (guides.length !== req.body.guides.length) {
    return next(new AppError('One or more guide IDs are invalid', 400));
  }

  // Check if all users have guide or lead-guide role
  const invalidGuides = guides.filter(
    (guide) => guide.role !== 'guide' && guide.role !== 'lead-guide'
  );

  if (invalidGuides.length > 0) {
    return next(
      new AppError(
        'All guides must have the role of "guide" or "lead-guide"',
        400
      )
    );
  }

  next();
});
