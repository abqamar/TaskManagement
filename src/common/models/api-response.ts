
export interface ApiResponse<T> {
  Data: T | null;
  MessageCodes: {
    StatusCode: number;
    StatusDescription: string;
  };
}

export function successResponse<T>(
  data: T,
  message = "Success"
): ApiResponse<T> {
  return {
    Data: data,
    MessageCodes: {
      StatusCode: 1,
      StatusDescription: message
    }
  };
}

export function errorResponse(
  message: string,
  statusCode = 0
): ApiResponse<null> {
  return {
    Data: null,
    MessageCodes: {
      StatusCode: statusCode,
      StatusDescription: message
    }
  };
}
