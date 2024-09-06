export type HttpResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export const extractFromHttpResponse = <T>(response: HttpResponse<T>) => {
  if (!response.success) {
    throw new Error(response.error.toString());
  }

  return response.data;
};
