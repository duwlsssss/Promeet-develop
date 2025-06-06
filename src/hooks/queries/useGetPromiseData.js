import { useQuery } from '@tanstack/react-query';
import { getPromiseData } from '@/apis/get/promise';
import { QUERY_KEY } from '@/constants/key';
import useErrorHandler from '../useHandleError';

const useGetPromiseData = (promiseId, userId) => {
  const handleError = useErrorHandler();

  return useQuery({
    queryKey: [QUERY_KEY.promise, promiseId],
    queryFn: async () => {
      try {
        const { data } = await getPromiseData(promiseId, userId);
        return data;
      } catch (error) {
        handleError(error);
      }
    },
    enabled: !!promiseId,
  });
};

export default useGetPromiseData;
