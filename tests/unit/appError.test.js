import AppError from '../../utils/appError.js';

describe('AppError', () => {
  test('should create an error with message and status code', () => {
    const error = new AppError('Test error message', 404);
    
    expect(error.message).toBe('Test error message');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  test('should set status to "error" for 5xx status codes', () => {
    const error = new AppError('Server error', 500);
    
    expect(error.status).toBe('error');
    expect(error.statusCode).toBe(500);
  });

  test('should set status to "fail" for 4xx status codes', () => {
    const error = new AppError('Client error', 400);
    
    expect(error.status).toBe('fail');
    expect(error.statusCode).toBe(400);
  });

  test('should capture stack trace', () => {
    const error = new AppError('Test error', 404);
    
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });

  test('should be instance of Error', () => {
    const error = new AppError('Test error', 404);
    
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
  });
});
