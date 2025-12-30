// Test setup file
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
process.env.JWT_EXPIRES_IN = '1d';
process.env.DATABASE = 'mongodb://localhost:27017/natours-test';

// Increase test timeout for integration tests
jest.setTimeout(10000);

// Global test hooks
beforeAll(() => {
  // Setup code that runs once before all tests
  console.log('Starting test suite...');
});

afterAll(() => {
  // Cleanup code that runs once after all tests
  console.log('Test suite completed.');
});
