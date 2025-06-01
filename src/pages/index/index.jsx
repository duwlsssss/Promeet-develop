import * as S from './style';
import { useNavigate } from 'react-router-dom';
import DeferredLoader from '@/components/ui/DeferredLoader';
import useGetUserData from '@/hooks/queries/useGetUserData';
import { useUserInfo } from '@/hooks/stores/auth/useUserStore';
import useLogout from '@/hooks/mutations/useLogout';
import Navbar from '@/layouts/Navbar';
import { ROUTES } from '@/constants/routes';

const HomePage = () => {
  const navigate = useNavigate();
  const { userId, userName } = useUserInfo();
  const { isPending: isGetUserDataPending } = useGetUserData(userId);

  const handleCreatePromiseBtnClick = () => {
    if (!userId) navigate(ROUTES.SIGN_IN);
    else navigate(ROUTES.PROMISE_CREATE_INFO);
  };

  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const handleLogout = () => {
    logout({ userId });
  };

  if (!userId)
    return (
      <S.EnterContainer>
        <S.LogoContainer>
          <S.Logo />
          <S.EnterText>쉽고 빠른 약속 정하기</S.EnterText>
        </S.LogoContainer>
        <button onClick={handleCreatePromiseBtnClick}>약속 잡으러가기</button>
      </S.EnterContainer>
    );

  return (
    <>
      {isGetUserDataPending ? (
        <DeferredLoader />
      ) : (
        <>
          <S.Container>
            <S.Header>{`${userName}님,\n오늘 일정 잊지 않으셨죠?`}</S.Header>
            <button onClick={handleLogout}>
              {isLogoutPending ? '로그아웃 중...' : '로그아웃'}
            </button>
          </S.Container>
          <Navbar />
        </>
      )}
    </>
  );
};

export default HomePage;
