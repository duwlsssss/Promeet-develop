import * as S from './style';
import { usePromiseDataFromServerInfo } from '@/hooks/stores/promise/usePromiseDataFromServerStore';

const WaitingSubmit = () => {
  const { promiseDataFromServer } = usePromiseDataFromServerInfo();

  return (
    <S.Contianer>
      <S.WatingText>{`모든 참여자의 입력을\n기다리고 있어요`}</S.WatingText>
      <S.InfoConainer>
        <S.Name>{promiseDataFromServer.title}</S.Name>
        <S.Description>{promiseDataFromServer.description}</S.Description>
      </S.InfoConainer>
      <S.Line />
      <S.StatusContainer>
        <S.StatusWrapper>
          <S.TimeIcon /> <p>모든 참여자의 입력을 기다리고 있어요</p>
        </S.StatusWrapper>
        <S.StatusWrapper>
          <S.LocationIcon /> <p>모든 참여자의 입력을 기다리고 있어요</p>
        </S.StatusWrapper>
        <S.StatusWrapper>
          <S.PeopleIcon />
          <S.MemberList>
            {promiseDataFromServer.members.map((member) => (
              <S.MemberItem key={member.userId}>
                <p>{member.name}</p>
                {member.hasSubmittedData && '✅'}
              </S.MemberItem>
            ))}
          </S.MemberList>
        </S.StatusWrapper>
      </S.StatusContainer>
    </S.Contianer>
  );
};

export default WaitingSubmit;
