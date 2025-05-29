import { useQueries } from '@tanstack/react-query';
import { getLike } from '@/apis/get/place';
import { QUERY_KEY } from '@/constants/key';
import useHandleError from '../useHandleError';

// 장소 id들로 좋아요 여부 가져오기
const useGetLikePlaces = (placeIds) => {
  const handleError = useHandleError();

  return useQueries({
    queries: placeIds.map((id) => ({
      queryKey: [QUERY_KEY.places, id],
      queryFn: () => getLike(id),
      enabled: !!id,
      onError: handleError,
    })),
  });
};

export default useGetLikePlaces;
