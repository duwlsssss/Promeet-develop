import { useErrorBoundary } from 'react-error-boundary';
import { AxiosError } from 'axios';
import ApiError from '@/apis/apiError';

// api 에러 발생시 에러 바운더리로 사용자에게 표시
const useErrorHandler = () => {
  const { showBoundary } = useErrorBoundary();

  const handleError = (error) => {
    if (error instanceof AxiosError) {
      const { response, request, message } = error;
      const errorData = {
        status: response?.status,
        statusText: response?.statusText,
        data: response?.data,
        url: request?.responseURL,
        method: request?.method,
      };

      showBoundary(
        new ApiError(
          response?.data?.errorCode ?? 'API_ERROR',
          response?.data?.message ?? message ?? 'API 요청 중 오류가 발생했습니다.',
          errorData,
          error,
        ),
      );
    } else if (error instanceof Error) {
      showBoundary(
        new ApiError(
          'UNKNOWN_ERROR',
          error.message || '알 수 없는 에러가 발생했습니다.',
          { stack: error.stack },
          error,
        ),
      );
    } else {
      showBoundary(
        new ApiError(
          'UNKNOWN_ERROR',
          '알 수 없는 에러가 발생했습니다.',
          { error: String(error) },
          error,
        ),
      );
    }
  };

  return handleError;
};

export default useErrorHandler;
