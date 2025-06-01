import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useErrorHandler from '../useHandleError';
import { useUserActions } from '../stores/auth/useUserStore';
import { ROUTES } from '@/constants/routes';
import { postSignIn } from '@/apis/post/auth';
import { getUserData } from '@/apis/get/auth';

const useSignIn = (setError) => {
  const handleError = useErrorHandler();
  const navigate = useNavigate();
  const { setUserId, setUserName, setFixedSchedules, setPromises } = useUserActions();

  return useMutation({
    mutationFn: ({ name, password, promiseId }) => postSignIn(name, password, promiseId),
    onSuccess: async (data) => {
      const userId = data.data.userId;
      setUserId(userId);

      // 데이터 프리로드
      const userData = await getUserData(userId);
      const { name, fixedSchedule, promise } = userData.data;

      setUserName(name);
      setFixedSchedules(fixedSchedule);
      setPromises({
        create: promise?.create ?? [],
        join: promise?.join ?? [],
      });

      navigate(ROUTES.HOME);
    },
    onError: (error) => {
      if (error.code === 'MISSING_REQUIRED_FIELD') {
        setError('name', '.');
        setError('password', { message: error.message }); // 비번 필드 밑에만 에러 메시지 표시
        return;
      }

      if (error.code === 'INVALID_PASSWORD') {
        setError('password', { message: error.message });
        return;
      }

      // 기타 에러
      handleError(error);
    },
  });
};

export default useSignIn;
