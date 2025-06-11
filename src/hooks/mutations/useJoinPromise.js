import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import queryClient from '@/lib/tanstack-query/queryClient';
import { patchJoinPromise } from '@/apis/patch/promise';
import { useUserInfo } from '@/hooks/stores/auth/useUserStore';
import useErrorHandler from '../useHandleError';
import { BUILD_ROUTES } from '@/constants/routes';
import { QUERY_KEY } from '@/constants/key';

const useJoinPromise = () => {
  const handleError = useErrorHandler();
  const navigate = useNavigate();

  const { userId } = useUserInfo();

  return useMutation({
    mutationFn: ({ promiseId, nearestStation, availableTimes }) =>
      patchJoinPromise(promiseId, userId, nearestStation, availableTimes),
    onSuccess: (_, { promiseId }) => {
      // 약속 상세 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.promise, promiseId] });
      // 유저 정보 캐시 무효화 (약속 목록 포함)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.user, userId] });
      // 결과 페이지로 이동
      navigate(BUILD_ROUTES.PROMISE_RESULT(promiseId));
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export default useJoinPromise;
