# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README.md with full API documentation
- API_DOCUMENTATION.md with detailed endpoint specifications
- .env.example file for environment configuration
- Health check endpoint at `/health`
- Jest testing framework with sample tests
- CONTRIBUTING.md with contribution guidelines
- CHANGELOG.md for tracking changes
- New npm scripts for better development workflow
- Test setup files and unit tests for utilities
- Integration tests for health check endpoint

### Fixed
- JWT error handling in errorController.js (error assignment issue)
- Typo in forgotPassword response ('mesage' → 'message')

### Removed
- Debug console.log statements from production code
- Commented out code blocks from multiple files
- Unnecessary code comments in models and controllers

### Changed
- Updated package.json scripts for better workflow
- Added Jest and Supertest as dev dependencies
- Improved .gitignore to exclude test coverage and temp files

## [1.0.0] - 2024-12-30

### Added
- Initial release
- Complete RESTful API for tour booking application
- User authentication and authorization with JWT
- Tour management with CRUD operations
- Review system with ratings
- Booking system with Stripe integration
- Email notifications using Nodemailer
- Image upload and processing with Multer and Sharp
- Geospatial queries for tour locations
- Advanced filtering, sorting, and pagination
- Security features (Helmet, Rate Limiting, XSS protection, NoSQL injection prevention)
- Error handling with global error middleware
- MongoDB integration with Mongoose
- Role-based access control (admin, lead-guide, guide, user)

### Security
- Password encryption with bcrypt
- JWT token-based authentication
- HTTP security headers with Helmet
- Rate limiting on API endpoints
- Data sanitization against NoSQL injection
- XSS attack prevention
- HTTP parameter pollution prevention

---

## Version History

### Version 1.0.0 (Initial Release)
The first stable release of the Natours API with all core features implemented and tested.

---

## How to Update This Changelog

When making changes to the project:

1. Add entries under the `[Unreleased]` section
2. Use the following categories:
   - **Added** - New features
   - **Changed** - Changes in existing functionality
   - **Deprecated** - Soon-to-be removed features
   - **Removed** - Removed features
   - **Fixed** - Bug fixes
   - **Security** - Security fixes or improvements

3. When releasing a new version:
   - Change `[Unreleased]` to `[Version Number] - Date`
   - Create a new `[Unreleased]` section above it
   - Update the version in package.json
