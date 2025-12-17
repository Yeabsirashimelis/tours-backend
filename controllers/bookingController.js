import Stripe from 'stripe';
import Tour from '../models/tourModel.js';
import Booking from '../models/bookingModel.js';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';
import Email from '../utils/email.js';

// Initialize Stripe only if the secret key is provided
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 0) Check if Stripe is configured
  if (!stripe) {
    return next(
      new AppError(
        'Stripe is not configured. Please add STRIPE_SECRET_KEY to config.env',
        500
      )
    );
  }

  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // 2) Check if user has already booked this tour
  const existingBooking = await Booking.findOne({
    user: req.user.id,
    tour: req.params.tourId,
  });

  if (existingBooking) {
    return next(new AppError('You have already booked this tour!', 400));
  }

  // 3) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/api/v1/bookings/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100, // Stripe expects amount in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  // 4) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

export const createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

export const webhookCheckout = catchAsync(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await createBookingFromSession(session);
  }

  res.status(200).json({ received: true });
});

const createBookingFromSession = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100; // Convert from cents

  await Booking.create({ tour, user, price });
};

export const handleCheckoutSuccess = catchAsync(async (req, res, next) => {
  const { session_id } = req.query;

  if (!session_id) {
    return next(new AppError('No session ID provided', 400));
  }

  // Retrieve the session from Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status === 'paid') {
    // Create booking
    const tour = await Tour.findById(session.client_reference_id);
    const user = await User.findById(req.user.id);
    const price = session.amount_total / 100;

    const booking = await Booking.create({ tour: tour._id, user: user._id, price });

    // Send booking confirmation email
    await new Email(user, '').sendBookingConfirmation({
      tour,
      price,
      createdAt: booking.createdAt,
    });

    res.status(200).json({
      status: 'success',
      message: 'Booking completed successfully!',
    });
  } else {
    return next(new AppError('Payment was not successful', 400));
  }
});

export const getAllBookings = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Booking.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookings = await features.query;

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

export const getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

export const getMyBookings = catchAsync(async (req, res, next) => {
  // Find all bookings for the current user
  const bookings = await Booking.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

// Check if user has booked a specific tour
export const checkIfUserBookedTour = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({
    user: req.user.id,
    tour: req.params.tourId,
  });

  res.status(200).json({
    status: 'success',
    data: {
      booked: !!booking,
      booking: booking || null,
    },
  });
});

export const createBooking = catchAsync(async (req, res, next) => {
  const newBooking = await Booking.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      booking: newBooking,
    },
  });
});

export const updateBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

export const deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
