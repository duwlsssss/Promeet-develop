import * as S from './style';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/promise/Header';
import { usePromiseDataFromServerInfo } from '@/hooks/stores/promise/usePromiseDataFromServerStore';
import { PROMISE_JOIN_HEADER_TEXT } from '@/constants/promise';
import { BUILD_ROUTES, ROUTES } from '@/constants/routes';
import copyToClipboard from '@/utils/copyToClipBoard';
import toast from '@/utils/toast';

const SummaryPage = () => {
  const { promiseDataFromServer } = usePromiseDataFromServerInfo();

  const navigate = useNavigate();
  const { promiseId } = useParams();

  // const time = promiseDataFromServer.fixedTime
  //   .map(({ date, startTime, endTime }) => {
  //     const [year, month, day] = date.split('-');
  //     return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${startTime} ~ ${endTime}`;
  //   })
  //   .join('\n');
  // const place = promiseDataFromServer.fixedPlace
  //   ? `${promiseDataFromServer.fixedPlace.name}\n${promiseDataFromServer.fixedPlace.address}`
  //   : '약속 생성자가 곧 확정할 거예요';

  const time = '2025년 05월 26일 10:00 ~ 10:00';
  const place = '상도 곱창\n서울시 동작구 232';
  const dummyPlace = {
    placeId: '1313432',
    type: 'restuarant', // or "cafe" or "studyCafe" or "activity"
    name: '상도 곱창',
    position: {
      La: '37.49808633653005',
      Ma: '127.02800140627488',
    },
    address: '서울시 동작구 232',
    phone: '02-123-1234', // 선택
    link: 'https://blabla.com', // 선택
  };

  const handleCopyClick = () => {
    // copyToClipboard(promiseDataFromServer.fixedPlace.address);
    copyToClipboard(dummyPlace.address);
    toast('주소가 복사됐어요');
  };

  const handlePlaceMapClick = () => {
    navigate(BUILD_ROUTES.PROMISE_MAP(promiseId));
  };

  return (
    <>
      <S.Container>
        <Header text={PROMISE_JOIN_HEADER_TEXT} navigateUrl={ROUTES.HOME} />
        <S.InfoConainer>
          <S.Name>{promiseDataFromServer.title}</S.Name>
          <S.Description>{promiseDataFromServer.description}</S.Description>
        </S.InfoConainer>
        <S.Line />
        <S.StatusContainer>
          <S.StatusWrapper>
            <S.TimeIcon />
            {time}
          </S.StatusWrapper>
          <S.StatusWrapper>
            <S.LocationIcon />
            {place}
            <S.CopyIcon onClick={handleCopyClick} />
            <S.MapIcon onClick={handlePlaceMapClick} />
          </S.StatusWrapper>
          <S.StatusWrapper>
            <S.PeopleIcon />
            <S.MemberList>
              {promiseDataFromServer.members.map((member) => (
                <S.MemberItem key={member.userId}>
                  <p>{member.name}</p>
                </S.MemberItem>
              ))}
            </S.MemberList>
          </S.StatusWrapper>
        </S.StatusContainer>
      </S.Container>
    </>
  );
};

export default SummaryPage;
