import catchAsync from '../../utils/catchAsync.js';

describe('catchAsync', () => {
  test('should catch async errors and pass to next', async () => {
    const error = new Error('Test error');
    const fn = catchAsync(async (req, res, next) => {
      throw error;
    });

    const req = {};
    const res = {};
    const next = jest.fn();

    await fn(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('should call the function without errors', async () => {
    const mockFunction = jest.fn().mockResolvedValue('success');
    const fn = catchAsync(mockFunction);

    const req = { body: { test: 'data' } };
    const res = { json: jest.fn() };
    const next = jest.fn();

    await fn(req, res, next);

    expect(mockFunction).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle promise rejections', async () => {
    const error = new Error('Promise rejection');
    const fn = catchAsync(async () => {
      return Promise.reject(error);
    });

    const next = jest.fn();

    await fn({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
