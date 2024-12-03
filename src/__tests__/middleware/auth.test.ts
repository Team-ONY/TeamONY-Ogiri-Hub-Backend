import { Request, Response, NextFunction } from 'express';
import { validateApiKey } from '../../middleware/auth';
import env from '../../config/env';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('有効なAPIキーで認証が成功すること', () => {
    mockRequest.headers = { 'x-api-key': env.API_KEY };

    validateApiKey(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it('無効なAPIキーでエラーを返すこと', () => {
    mockRequest.headers = { 'x-api-key': 'invalid-key' };

    validateApiKey(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: '無効なAPIキーです' });
  });
});
