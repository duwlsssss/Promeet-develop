import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useErrorHandler from '../useHandleError';
import { useUserActions } from '../stores/auth/useUserStore';
import { BUILD_ROUTES, ROUTES } from '@/constants/routes';
import { postSignIn } from '@/apis/post/auth';
import { getUserData } from '@/apis/get/user';

const useSignIn = (setError) => {
  const handleError = useErrorHandler();
  const navigate = useNavigate();
  const { setUserId, setUserName, setFixedSchedules, setPromises, setUserType } = useUserActions();

  return useMutation({
    mutationFn: async ({ name, password, promiseId }) => postSignIn(name, password, promiseId),
    onSuccess: async ({ data }, { promiseId }) => {
      const userId = data.userId;
      setUserId(userId);

      // 데이터 프리로드
      const userData = await getUserData(userId);
      const { name, fixedSchedule, promises } = userData.data;

      setUserName(name);
      setFixedSchedules(fixedSchedule);
      setPromises({
        create: promises?.create ?? [],
        join: promises?.join ?? [],
      });

      // 참여 요청받은 약속이면
      if (promiseId && promises.join.includes(promiseId)) {
        setUserType('join');
        navigate(BUILD_ROUTES.PROMISE_LOCATION(promiseId));
      } else {
        navigate(ROUTES.HOME);
      }
    },
    onError: (error) => {
      if (error.code === 'INVALID_PASSWORD') {
        setError('password', { message: error.message });
        return;
      }

      // 기타 에러는 여기서 처리
      handleError(error);
    },
  });
};

export default useSignIn;
