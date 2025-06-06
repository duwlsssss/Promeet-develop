import * as S from './style';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DeferredLoader from '@/components/ui/DeferredLoader';
import Button from '@/components/ui/Button';
import Navbar from '@/layouts/Navbar';
import useGetUserData from '@/hooks/queries/useGetUserData';
// import useGetMultiplePromiseData from '@/hooks/queries/useGetMultiplePromiseData';
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
  const { userId, userName } = useUserInfo();
  // const { userId, userName, promises } = useUserInfo();

  const { isPending: isGetUserDataPending } = useGetUserData(userId);

  // const createIds = promises.create ?? []; // 생성한 약속 ids
  // const joinIds = promises.join ?? []; // 초대받은 약속 ids

  // const createQueries = useGetMultiplePromiseData(createIds, userId);
  // const joinQueries = useGetMultiplePromiseData(joinIds, userId);

  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const handleLogout = () => {
    logout({ userId });
  };

  // const isLoading =
  //   isGetUserDataPending ||
  //   createQueries.some((q) => q.isPending) ||
  //   joinQueries.some((q) => q.isPending);
  const isLoading = isGetUserDataPending;

  // // falsy값 제거해 정상적으로 받은 데이터만 필터링
  // const createdPromises = createQueries.map((q) => q.data).filter(Boolean);
  // const joinedPromises = joinQueries.map((q) => q.data).filter(Boolean);

  // const allPromises = [...createdPromises, ...joinedPromises]; // 생성 + 초대
  // const { todayPromises, futurePromises } = classifyPromises(allPromises);

  const _createdPromises = [
    {
      id: 'promise1',
      title: '친구들과 저녁약속',
      description: '오랜만에 모이는 회식자리!',
      fixedTime: [
        {
          id: 'ft1',
          date: '2025-06-08',
          day: 'Sunday',
          startTime: '18:00',
          endTime: '20:00',
        },
      ],
      fixedPlace: {
        placeId: 'p1',
        type: 'restaurant',
        name: '상도 곱창',
        position: { La: 37.49808, Ma: 127.028 },
        address: '서울 동작구 상도로 232',
        phone: '02-123-4567',
        link: 'https://place1.com',
      },
    },
    {
      id: 'promise2',
      title: '스터디 모임',
      description: '중간고사 대비 스터디',
      fixedTime: [
        {
          id: 'ft2',
          date: '2025-06-10',
          day: 'Tuesday',
          startTime: '10:00',
          endTime: '12:00',
        },
        {
          id: 'ft3',
          date: '2025-06-12',
          day: 'Thursday',
          startTime: '14:00',
          endTime: '16:00',
        },
      ],
      fixedPlace: {
        placeId: 'p2',
        type: 'studyCafe',
        name: '이디야 커피 상도점',
        position: { La: 37.499, Ma: 127.029 },
        address: '서울 동작구 상도로 100',
        phone: '02-234-5678',
        link: 'https://place2.com',
      },
    },
  ];
  const _joinedPromises = [
    {
      id: 'promise3',
      title: '운동 약속',
      description: 'PT 끝나고 다같이 저녁!',
      fixedTime: [
        {
          id: 'ft4',
          date: '2025-06-07',
          day: 'Saturday',
          startTime: '17:00',
          endTime: '18:00',
        },
      ],
      fixedPlace: {
        placeId: 'p3',
        type: 'activity',
        name: '휘트니스 센터',
        position: { La: 37.501, Ma: 127.032 },
        address: '서울 서초구 반포대로 50',
        phone: '02-345-6789',
        link: 'https://gym.com',
      },
    },
    {
      id: 'promise4',
      title: '가족 모임',
      description: '외할머니 생신 기념 모임',
      fixedTime: [
        {
          id: 'ft5',
          date: '2025-06-09',
          day: 'Monday',
          startTime: '12:00',
          endTime: '14:00',
        },
      ],
      fixedPlace: {
        placeId: 'p4',
        type: 'restaurant',
        name: '한정식 궁',
        position: { La: 37.502, Ma: 127.033 },
        address: '서울 강남구 논현로 120',
        phone: '02-456-7890',
        link: 'https://koreanfood.com',
      },
    },
  ];
  const _allPromises = [..._createdPromises, ..._joinedPromises];
  const { todayPromises: _todayPromises, futurePromises: _futurePromises } =
    classifyPromises(_allPromises);

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
            {_todayPromises.map((promise) => (
              <div key={promise.id} data={promise}>
                {promise.title}
              </div>
            ))}
            <h3>임시 다가오는 약속</h3>
            {_futurePromises.map((promise) => (
              <div key={promise.id} data={promise}>
                {promise.title}
                {promise.fixedTime[0].date}
                {promise.fixedTime[0].startTime}
              </div>
            ))}
            <h3>임시 내가 생성한 약속</h3>
            {_createdPromises.map((promise) => (
              <div key={promise.id} data={promise}>
                {promise.title}
              </div>
            ))}
            <h3>임시 초대받은 약속</h3>
            {_joinedPromises.map((promise) => (
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
