# 🌍 Natours API

![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A comprehensive tour booking RESTful API built with Node.js, Express, and MongoDB. This application provides a complete backend solution for managing tours, users, bookings, and reviews with advanced features like authentication, payment processing, and email notifications.

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Documentation](#-api-documentation)
- [API Features](#️-api-features)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Available Scripts](#-available-scripts)
- [Security Best Practices](#-security-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors](#-authors)
- [Support](#-support)

## 🚀 Quick Start

Get the API running in 3 minutes:

```bash
# 1. Clone and install
git clone https://github.com/yeabsira/natours-api.git
cd natours-api
npm install

# 2. Set up environment
cp .env.example config.env
# Edit config.env with your MongoDB URI and other credentials

# 3. Import sample data (optional)
npm run import:data

# 4. Start the server
npm run dev
```

The API will be running at `http://localhost:3000`

**Test it:** Open `http://localhost:3000/health` in your browser or:

```bash
curl http://localhost:3000/health
```

**First API call:**

```bash
# Get all tours
curl http://localhost:3000/api/v1/tours
```

> 💡 **Tip:** For detailed setup and configuration, see the [Getting Started](#-getting-started) section below.

## ✨ Features

- **🔐 Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (admin, lead-guide, guide, user)
  - Password reset functionality with email tokens
  - Secure password storage with bcrypt

- **🗺️ Tour Management**

  - CRUD operations for tours
  - Advanced filtering, sorting, and pagination
  - Geospatial queries (find tours within radius)
  - Tour statistics and monthly planning
  - Image upload and processing

- **👥 User Management**

  - User registration and profile management
  - Password management
  - User roles and permissions
  - Image upload for user photos

- **⭐ Review System**

  - Users can review tours they've booked
  - Average rating calculation
  - Prevent duplicate reviews

- **💳 Booking System**

  - Stripe payment integration
  - Booking management
  - Email confirmations

- **🔒 Security Features**

  - Rate limiting
  - HTTP parameter pollution protection
  - Data sanitization (NoSQL injection, XSS)
  - Security headers with Helmet
  - CORS enabled

- **📧 Email Notifications**
  - Welcome emails
  - Password reset emails
  - Booking confirmations
  - Pug templates for emails

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Stripe account (for payment processing)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yeabsira/natours-api.git
   cd natours-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   - Copy `.env.example` to `config.env`
   - Update the values with your configuration

   ```bash
   cp .env.example config.env
   ```

4. **Import sample data (optional)**

   ```bash
   node dev-data/data/import-dev-data.js --import
   ```

5. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:3000` (or your configured PORT)

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

#### Sign Up

```http
POST /users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

#### Login

```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Forgot Password

```http
POST /users/forgotPassword
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password

```http
PATCH /users/resetPassword/:token
Content-Type: application/json

{
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

#### Update Password (Authenticated)

```http
PATCH /users/updateMyPassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "passwordCurrent": "currentPassword",
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

### Tours

#### Get All Tours

```http
GET /tours

# With filtering, sorting, pagination
GET /tours?duration[gte]=5&difficulty=easy&sort=-ratingsAverage&limit=10&page=1
```

#### Get Tour by ID

```http
GET /tours/:id
```

#### Create Tour (Admin/Lead-Guide only)

```http
POST /tours
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Amazing Tour",
  "duration": 7,
  "maxGroupSize": 15,
  "difficulty": "medium",
  "ratingsAverage": 4.5,
  "price": 497,
  "summary": "Tour summary",
  "description": "Tour description",
  "imageCover": "tour-cover.jpg",
  "startDates": ["2024-06-01", "2024-07-01"]
}
```

#### Update Tour (Admin/Lead-Guide only)

```http
PATCH /tours/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 599
}
```

#### Delete Tour (Admin/Lead-Guide only)

```http
DELETE /tours/:id
Authorization: Bearer <token>
```

#### Get Tours Within Radius

```http
GET /tours/tours-within/:distance/center/:latlng/unit/:unit

# Example: Tours within 200 miles of Los Angeles
GET /tours/tours-within/200/center/34.0522,-118.2437/unit/mi
```

#### Get Tour Statistics

```http
GET /tours/tour-stats
```

#### Get Monthly Plan (Admin/Lead-Guide/Guide)

```http
GET /tours/monthly-plan/:year
```

### Users

#### Get All Users (Admin only)

```http
GET /users
Authorization: Bearer <token>
```

#### Get User by ID (Admin only)

```http
GET /users/:id
Authorization: Bearer <token>
```

#### Get Current User

```http
GET /users/me
Authorization: Bearer <token>
```

#### Update Current User

```http
PATCH /users/updateMe
Authorization: Bearer <token>
Content-Type: multipart/form-data

name=John Updated
photo=@/path/to/photo.jpg
```

#### Delete Current User (soft delete)

```http
DELETE /users/deleteMe
Authorization: Bearer <token>
```

### Reviews

#### Get All Reviews

```http
GET /reviews
```

#### Get Review by ID

```http
GET /reviews/:id
```

#### Create Review (User only, must have booked the tour)

```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "review": "Amazing experience!",
  "rating": 5,
  "tour": "<tour-id>",
  "user": "<user-id>"
}
```

#### Update Review (Own review only)

```http
PATCH /reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4
}
```

#### Delete Review (Admin/Own review)

```http
DELETE /reviews/:id
Authorization: Bearer <token>
```

#### Get Reviews for a Tour

```http
GET /tours/:tourId/reviews
```

#### Create Review for a Tour

```http
POST /tours/:tourId/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "review": "Great tour!",
  "rating": 5
}
```

### Bookings

#### Get All Bookings (Admin/Lead-Guide)

```http
GET /bookings
Authorization: Bearer <token>
```

#### Get Booking by ID

```http
GET /bookings/:id
Authorization: Bearer <token>
```

#### Create Checkout Session

```http
GET /bookings/checkout-session/:tourId
Authorization: Bearer <token>
```

#### Create Booking (Admin/Lead-Guide)

```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "tour": "<tour-id>",
  "user": "<user-id>",
  "price": 497
}
```

#### Update Booking (Admin/Lead-Guide)

```http
PATCH /bookings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "paid": true
}
```

#### Delete Booking (Admin/Lead-Guide)

```http
DELETE /bookings/:id
Authorization: Bearer <token>
```

## 🛠️ API Features

### Filtering

```http
# Get tours with duration >= 5 and difficulty = easy
GET /tours?duration[gte]=5&difficulty=easy

# Operators: gte, gt, lte, lt
```

### Sorting

```http
# Sort by price ascending
GET /tours?sort=price

# Sort by price descending
GET /tours?sort=-price

# Multiple sort fields
GET /tours?sort=-ratingsAverage,price
```

### Field Limiting

```http
# Only return specific fields
GET /tours?fields=name,duration,difficulty,price
```

### Pagination

```http
# Get page 2 with 10 results per page
GET /tours?page=2&limit=10
```

### Combining Features

```http
GET /tours?duration[gte]=5&difficulty=easy&sort=-ratingsAverage&fields=name,price&page=1&limit=5
```

## 🔑 Environment Variables

Create a `config.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000

# Database
DATABASE=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email (Mailtrap for development)
EMAIL_USERNAME=your-mailtrap-username
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=25

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 📁 Project Structure

```
natours-api/
├── controllers/        # Route controllers
├── models/            # Mongoose models
├── routes/            # API routes
├── utils/             # Utility functions
├── dev-data/          # Sample data and scripts
│   ├── data/          # JSON data files
│   ├── img/           # Sample images
│   └── templates/     # Email templates
├── public/            # Static files
├── app.js             # Express app configuration
├── server.js          # Server entry point
├── config.env         # Environment variables
└── package.json       # Dependencies
```

## 🧪 Testing

```bash
# Install test dependencies first
npm install

# Run tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## 📦 Available Scripts

```bash
npm start                # Start production server
npm run dev              # Start development server with nodemon
npm run start:prod       # Start production server with NODE_ENV=production
npm run debug            # Start server in debug mode
npm test                 # Run all tests
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:coverage    # Generate test coverage report
npm run import:data      # Import sample data to database
npm run delete:data      # Delete all data from database
```

## 🔒 Security Best Practices

- Always use HTTPS in production
- Keep dependencies up to date
- Use strong JWT secrets (min 32 characters)
- Rotate JWT secrets regularly
- Set appropriate rate limits
- Validate and sanitize all inputs
- Use environment variables for sensitive data
- Never commit `config.env` file

## 🔧 Troubleshooting

### Common Issues

#### **Problem: Cannot connect to MongoDB**

```
Error: MongoServerError: Authentication failed
```

**Solution:**

- Verify your MongoDB connection string in `config.env`
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check that your database username and password are correct

#### **Problem: JWT errors**

```
JsonWebTokenError: invalid signature
```

**Solution:**

- Ensure `JWT_SECRET` is set in `config.env`
- Check that the token hasn't expired
- Verify the token format is correct

#### **Problem: Stripe payment fails**

```
Error: No such API key
```

**Solution:**

- Replace placeholder Stripe keys with real keys from your Stripe dashboard
- Use test keys for development: `sk_test_...`
- Use live keys for production: `sk_live_...`

#### **Problem: Email not sending**

```
Error: Invalid login
```

**Solution:**

- Verify email credentials in `config.env`
- For development, use Mailtrap credentials
- For production, configure SendGrid or similar service

#### **Problem: Tests failing**

```
Cannot find module 'jest'
```

**Solution:**

```bash
npm install  # Install all dependencies including devDependencies
```

#### **Problem: Port already in use**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

- Change the PORT in `config.env`
- Or kill the process using port 3000:

  ```bash
  # On Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F

  # On Mac/Linux
  lsof -ti:3000 | xargs kill -9
  ```

### Need More Help?

- Check the [API Documentation](./API_DOCUMENTATION.md) for detailed endpoint information
- Review the [Contributing Guide](./CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub with details about your problem

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Yeabsira Shimelis** - _Full Stack Developer_ - Initial work and development

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- All contributors
