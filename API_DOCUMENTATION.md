# 📖 Natours API - Detailed Endpoints Documentation

## Table of Contents
- [Authentication](#authentication)
- [Tours](#tours)
- [Users](#users)
- [Reviews](#reviews)
- [Bookings](#bookings)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)

---

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Sign Up
Create a new user account.

**Endpoint:** `POST /api/v1/users/signup`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "role": "user"  // optional: user, guide, lead-guide, admin
}
```

**Response (201):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64f8a...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Login
Authenticate and receive a JWT token.

**Endpoint:** `POST /api/v1/users/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64f8a...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Forgot Password
Request a password reset token via email.

**Endpoint:** `POST /api/v1/users/forgotPassword`

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "token sent to email!"
}
```

### Reset Password
Reset password using the token received via email.

**Endpoint:** `PATCH /api/v1/users/resetPassword/:token`

**Parameters:**
- `token` (URL parameter): The reset token from email

**Body:**
```json
{
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64f8a...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Update Password (Authenticated)
Update password for logged-in user.

**Endpoint:** `PATCH /api/v1/users/updateMyPassword`

**Authentication:** Required

**Body:**
```json
{
  "passwordCurrent": "currentPassword",
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

---

## Tours

### Get All Tours
Retrieve all tours with filtering, sorting, and pagination.

**Endpoint:** `GET /api/v1/tours`

**Query Parameters:**
- Filtering: `?duration[gte]=5&difficulty=easy&price[lt]=1000`
- Sorting: `?sort=-ratingsAverage,price`
- Field limiting: `?fields=name,duration,difficulty,price`
- Pagination: `?page=2&limit=10`

**Example:**
```
GET /api/v1/tours?duration[gte]=5&difficulty=easy&sort=-ratingsAverage&fields=name,price&page=1&limit=5
```

**Response (200):**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "tours": [
      {
        "_id": "64f8a...",
        "name": "The Forest Hiker",
        "duration": 5,
        "maxGroupSize": 25,
        "difficulty": "easy",
        "ratingsAverage": 4.7,
        "ratingsQuantity": 37,
        "price": 397,
        "summary": "Breathtaking hike through the Canadian Banff National Park",
        "imageCover": "tour-1-cover.jpg",
        "startDates": ["2024-04-25T09:00:00.000Z", "2024-07-20T09:00:00.000Z"]
      }
      // ... more tours
    ]
  }
}
```

### Get Tour by ID
Retrieve a single tour with full details including reviews and guides.

**Endpoint:** `GET /api/v1/tours/:id`

**Parameters:**
- `id` (URL parameter): Tour ID

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "tour": {
      "_id": "64f8a...",
      "name": "The Forest Hiker",
      "duration": 5,
      "maxGroupSize": 25,
      "difficulty": "easy",
      "ratingsAverage": 4.7,
      "ratingsQuantity": 37,
      "price": 397,
      "summary": "Breathtaking hike through the Canadian Banff National Park",
      "description": "Full description here...",
      "imageCover": "tour-1-cover.jpg",
      "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"],
      "startDates": ["2024-04-25T09:00:00.000Z"],
      "guides": [
        {
          "_id": "5c8a21d02f8fb814b56fa189",
          "name": "Steve T. Scaife",
          "role": "lead-guide",
          "photo": "user-10.jpg"
        }
      ],
      "reviews": [
        {
          "_id": "5c8a34ed14eb5c17645c9108",
          "review": "Amazing tour!",
          "rating": 5,
          "user": {
            "_id": "5c8a1dfa2f8fb814b56fa181",
            "name": "Lourdes Browning",
            "photo": "user-1.jpg"
          }
        }
      ]
    }
  }
}
```

### Create Tour
Create a new tour (Admin/Lead-Guide only).

**Endpoint:** `POST /api/v1/tours`

**Authentication:** Required (admin/lead-guide)

**Body:**
```json
{
  "name": "Amazing Mountain Adventure",
  "duration": 7,
  "maxGroupSize": 15,
  "difficulty": "medium",
  "ratingsAverage": 4.5,
  "ratingsQuantity": 0,
  "price": 497,
  "priceDiscount": 100,
  "summary": "An amazing mountain climbing experience",
  "description": "Full description of the tour...",
  "imageCover": "tour-cover.jpg",
  "images": ["tour-1.jpg", "tour-2.jpg"],
  "startDates": ["2024-06-01T09:00:00.000Z", "2024-07-15T09:00:00.000Z"],
  "startLocation": {
    "type": "Point",
    "coordinates": [-118.113491, 34.111745],
    "address": "Main Street, Los Angeles, CA",
    "description": "Los Angeles, USA"
  },
  "locations": [
    {
      "type": "Point",
      "coordinates": [-118.113491, 34.111745],
      "address": "Location 1 address",
      "description": "Day 1: Starting point",
      "day": 1
    }
  ],
  "guides": ["guide-id-1", "guide-id-2"]
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "tour": { /* created tour object */ }
  }
}
```

### Update Tour
Update an existing tour (Admin/Lead-Guide only).

**Endpoint:** `PATCH /api/v1/tours/:id`

**Authentication:** Required (admin/lead-guide)

**Body:** (only fields to update)
```json
{
  "price": 599,
  "duration": 8
}
```

### Delete Tour
Delete a tour (Admin/Lead-Guide only).

**Endpoint:** `DELETE /api/v1/tours/:id`

**Authentication:** Required (admin/lead-guide)

**Response (204):** No content

### Get Top 5 Cheap Tours
Get the top 5 cheapest tours with best ratings.

**Endpoint:** `GET /api/v1/tours/top-5-cheap`

### Get Tour Statistics
Get aggregated tour statistics.

**Endpoint:** `GET /api/v1/tours/tour-stats`

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "stats": [
      {
        "_id": "easy",
        "numTours": 5,
        "numRatings": 177,
        "avgRating": 4.67,
        "avgPrice": 397,
        "minPrice": 397,
        "maxPrice": 397
      }
      // ... more statistics
    ]
  }
}
```

### Get Monthly Plan
Get tour start dates grouped by month (Admin/Lead-Guide/Guide).

**Endpoint:** `GET /api/v1/tours/monthly-plan/:year`

**Authentication:** Required (admin/lead-guide/guide)

**Parameters:**
- `year` (URL parameter): Year (e.g., 2024)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "plan": [
      {
        "month": 6,
        "numTourStarts": 3,
        "tours": ["The Forest Hiker", "The Sea Explorer", "The Snow Adventurer"]
      }
      // ... more months
    ]
  }
}
```

### Get Tours Within Radius
Find tours within a certain distance from a location.

**Endpoint:** `GET /api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit`

**Parameters:**
- `distance`: Distance in miles or kilometers
- `latlng`: Latitude and longitude (format: `lat,lng`)
- `unit`: `mi` for miles or `km` for kilometers

**Example:**
```
GET /api/v1/tours/tours-within/200/center/34.111745,-118.113491/unit/mi
```

**Response (200):**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "tours": [
      { /* tour objects within radius */ }
    ]
  }
}
```

### Get Distances to Tours
Calculate distances from a point to all tours.

**Endpoint:** `GET /api/v1/tours/distances/:latlng/unit/:unit`

**Parameters:**
- `latlng`: Latitude and longitude (format: `lat,lng`)
- `unit`: `mi` for miles or `km` for kilometers

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "distances": [
      {
        "name": "The Forest Hiker",
        "distance": 233.87
      }
      // ... more distances
    ]
  }
}
```

---

## Users

### Get All Users
Get all users (Admin only).

**Endpoint:** `GET /api/v1/users`

**Authentication:** Required (admin)

### Get User by ID
Get a specific user (Admin only).

**Endpoint:** `GET /api/v1/users/:id`

**Authentication:** Required (admin)

### Get Current User
Get the currently logged-in user's data.

**Endpoint:** `GET /api/v1/users/me`

**Authentication:** Required

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "64f8a...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "photo": "user-photo.jpg"
    }
  }
}
```

### Update Current User
Update current user's name and photo.

**Endpoint:** `PATCH /api/v1/users/updateMe`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Body:**
```
name: John Updated
email: newemail@example.com (cannot be changed)
photo: [file upload]
```

### Delete Current User
Deactivate current user (soft delete).

**Endpoint:** `DELETE /api/v1/users/deleteMe`

**Authentication:** Required

**Response (204):** No content

### Update User (Admin)
Update any user (Admin only).

**Endpoint:** `PATCH /api/v1/users/:id`

**Authentication:** Required (admin)

### Delete User (Admin)
Delete any user (Admin only).

**Endpoint:** `DELETE /api/v1/users/:id`

**Authentication:** Required (admin)

---

## Reviews

### Get All Reviews
Get all reviews or reviews for a specific tour.

**Endpoint:** `GET /api/v1/reviews`

**Endpoint (for specific tour):** `GET /api/v1/tours/:tourId/reviews`

**Response (200):**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "reviews": [
      {
        "_id": "5c8a34ed14eb5c17645c9108",
        "review": "Amazing tour! Highly recommended.",
        "rating": 5,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "tour": {
          "_id": "5c88fa8cf4afda39709c2955",
          "name": "The Forest Hiker"
        },
        "user": {
          "_id": "5c8a1dfa2f8fb814b56fa181",
          "name": "Lourdes Browning",
          "photo": "user-1.jpg"
        }
      }
      // ... more reviews
    ]
  }
}
```

### Get Review by ID
Get a specific review.

**Endpoint:** `GET /api/v1/reviews/:id`

### Create Review
Create a review (must have booked the tour).

**Endpoint:** `POST /api/v1/reviews`

**Endpoint (for specific tour):** `POST /api/v1/tours/:tourId/reviews`

**Authentication:** Required (user)

**Body:**
```json
{
  "review": "This was an incredible experience!",
  "rating": 5,
  "tour": "tour-id",  // not needed if using nested route
  "user": "user-id"   // automatically set from token
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "review": { /* created review object */ }
  }
}
```

### Update Review
Update own review.

**Endpoint:** `PATCH /api/v1/reviews/:id`

**Authentication:** Required (review owner/admin)

**Body:**
```json
{
  "review": "Updated review text",
  "rating": 4
}
```

### Delete Review
Delete own review (or any review as admin).

**Endpoint:** `DELETE /api/v1/reviews/:id`

**Authentication:** Required (review owner/admin)

**Response (204):** No content

---

## Bookings

### Get All Bookings
Get all bookings (Admin/Lead-Guide).

**Endpoint:** `GET /api/v1/bookings`

**Authentication:** Required (admin/lead-guide)

### Get Booking by ID
Get a specific booking.

**Endpoint:** `GET /api/v1/bookings/:id`

**Authentication:** Required

### Create Checkout Session
Create a Stripe checkout session for booking a tour.

**Endpoint:** `GET /api/v1/bookings/checkout-session/:tourId`

**Authentication:** Required

**Response (200):**
```json
{
  "status": "success",
  "session": {
    "id": "cs_test_...",
    "url": "https://checkout.stripe.com/pay/cs_test_..."
  }
}
```

### Create Booking
Manually create a booking (Admin/Lead-Guide).

**Endpoint:** `POST /api/v1/bookings`

**Authentication:** Required (admin/lead-guide)

**Body:**
```json
{
  "tour": "tour-id",
  "user": "user-id",
  "price": 497
}
```

### Update Booking
Update a booking (Admin/Lead-Guide).

**Endpoint:** `PATCH /api/v1/bookings/:id`

**Authentication:** Required (admin/lead-guide)

### Delete Booking
Delete a booking (Admin/Lead-Guide).

**Endpoint:** `DELETE /api/v1/bookings/:id`

**Authentication:** Required (admin/lead-guide)

---

## Response Formats

### Success Response
```json
{
  "status": "success",
  "data": {
    "resource": { /* resource data */ }
  }
}
```

### Success Response with Results Count
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "resources": [ /* array of resources */ ]
  }
}
```

---

## Error Handling

### Error Response Format
```json
{
  "status": "fail",  // or "error" for server errors
  "message": "Error message describing what went wrong"
}
```

### Development Error Response
```json
{
  "status": "error",
  "error": { /* full error object */ },
  "message": "Error message",
  "stack": "Error stack trace"
}
```

### Common Error Status Codes

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Common Error Messages

**Authentication Errors:**
```json
{
  "status": "fail",
  "message": "You are not logged in! Please log in to get access."
}
```

```json
{
  "status": "fail",
  "message": "You do not have permission to perform this action"
}
```

**Validation Errors:**
```json
{
  "status": "fail",
  "message": "Invalid input data. Path `name` is required."
}
```

**Duplicate Key Error:**
```json
{
  "status": "fail",
  "message": "Duplicate field value: 'email'. Please use another value!"
}
```

---

## Rate Limiting

- **General API**: 100 requests per hour per IP
- **Authentication routes**: Additional rate limiting may apply

When rate limit is exceeded:
```json
{
  "status": "fail",
  "message": "Too many requests from this IP, please try again in an hour!"
}
```

---

## Additional Notes

1. **Timestamps**: All dates are returned in ISO 8601 format
2. **Pagination**: Default limit is 100 results per page
3. **File Uploads**: Max file size is 5MB for images
4. **Image Processing**: Uploaded images are automatically resized and optimized
5. **Nested Routes**: Use nested routes for better resource relationships (e.g., `/tours/:tourId/reviews`)

---

For more information, see the main [README.md](./README.md) file.
