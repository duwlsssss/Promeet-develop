import * as S from './style';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DeferredLoader from '@/components/ui/DeferredLoader';
import Button from '@/components/ui/Button';
import Navbar from '@/layouts/Navbar';
import useGetUserData from '@/hooks/queries/useGetUserData';
import useGetMultiplePromiseData from '@/hooks/queries/useGetMultiplePromiseData';
import { useUserInfo } from '@/hooks/stores/auth/useUserStore';
import useLogout from '@/hooks/mutations/useLogout';
import { ROUTES } from '@/constants/routes';

// 오늘, 다가오는 약속 추출
const classifyPromises = (Promises) => {
  const today = dayjs().format('YYYY-MM-DD');
  const todayPromises = [];
  const futurePromises = [];

  Promises.forEach((promise) => {
    if (!promise?.fixedTime || !promise?.fixedPlace) return;

    let isToday = false;
    let isFuture = false;

    promise.fixedTime.forEach((slot) => {
      if (slot.date === today) isToday = true;
      else if (dayjs(slot.date).isAfter(today)) isFuture = true;
    });

    if (isToday) todayPromises.push(promise);
    else if (isFuture) futurePromises.push(promise);
  });

  // 가장 빠른 fixedTime 기준으로 정렬
  futurePromises.sort((a, b) => {
    const getEarliestTime = (p) =>
      p.fixedTime
        .filter((t) => dayjs(t.date).isAfter(today)) // 오늘 이후의 일정만
        .map((t) => dayjs(`${t.date} ${t.startTime}`)) // '2025-06-08 09:00' 형식 → dayjs 객체
        .sort((x, y) => x - y)[0]; // 시간순 정렬 후, 가장 빠른 시간 반환

    return getEarliestTime(a) - getEarliestTime(b);
  });

  return { todayPromises, futurePromises };
};

const HomePage = () => {
  const navigate = useNavigate();
  const { userId, userName, promises } = useUserInfo();

  const { isPending: isGetUserDataPending } = useGetUserData(userId);

  const createIds = promises.create ?? []; // 생성한 약속 ids
  const joinIds = promises.join ?? []; // 초대받은 약속 ids

  const createQueries = useGetMultiplePromiseData(createIds, userId);
  const joinQueries = useGetMultiplePromiseData(joinIds, userId);

  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const handleLogout = () => {
    logout({ userId });
  };

  const isLoading =
    isGetUserDataPending ||
    createQueries.some((q) => q.isPending) ||
    joinQueries.some((q) => q.isPending);

  // falsy값 제거해 정상적으로 받은 데이터만 필터링
  const createdPromises = createQueries.map((q) => q.data).filter(Boolean);
  const joinedPromises = joinQueries.map((q) => q.data).filter(Boolean);

  console.log('참여 요청받은 약속', joinIds, '생성한 약속', createIds);

  const allPromises = [...createdPromises, ...joinedPromises]; // 생성 + 초대
  const { todayPromises, futurePromises } = classifyPromises(allPromises);

  const handleCreatePromiseBtnClick = () => {
    if (!userId) navigate(ROUTES.SIGN_IN);
    else navigate(ROUTES.PROMISE_CREATE_INFO);
  };

  if (!userId)
    return (
      <S.EnterContainer>
        <S.LogoContainer>
          <S.Logo />
          <S.EnterText>쉽고 빠른 약속 정하기</S.EnterText>
        </S.LogoContainer>
        <Button color="point1" onClick={handleCreatePromiseBtnClick}>
          약속 잡으러가기
        </Button>
      </S.EnterContainer>
    );

  return (
    <>
      {isLoading ? (
        <DeferredLoader />
      ) : (
        <>
          <S.Container>
            <S.Header>{`${userName}님,\n오늘 일정 잊지 않으셨죠?`}</S.Header>
            <h3>임시 오늘 약속</h3>
            {/* 카드 컴포넌트로 변경해 사용해주세요 */}
            {todayPromises.map((promise) => (
              <div key={promise.id} data={promise}>
                {promise.title}
              </div>
            ))}
            <h3>임시 다가오는 약속</h3>
            {futurePromises.map((promise) => (
              <div key={promise.id} data={promise}>
                {promise.title}
              </div>
            ))}
            <h3>임시 내가 생성한 약속</h3>
            {createdPromises.map((promise) => (
              <div key={promise.id} data={promise}>
                {promise.title}
              </div>
            ))}
            <h3>임시 초대받은 약속</h3>
            {joinedPromises.map((promise) => (
              <div key={promise.id} data={promise}>
                {promise.title}
              </div>
            ))}

            <Button onClick={handleLogout}>
              {isLogoutPending ? '로그아웃 중...' : '로그아웃'}
            </Button>
          </S.Container>
          <Navbar />
        </>
      )}
    </>
  );
};

export default HomePage;
