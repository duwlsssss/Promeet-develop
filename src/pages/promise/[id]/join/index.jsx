import * as S from './style';
// import { useParams } from 'react-router-dom';
import SignInForm from '@/components/auth/SignInForm';
// import DeferredLoader from '@/components/ui/DeferredLoader';
// import useGetPromiseData from '@/hooks/queries/useGetPromiseData';

const JoinPage = () => {
  // const { promiseId } = useParams();
  // 약속 생성자 정보 가져와야 함
  // const { data: promiseData, isPending: isPromisePending } = useGetPromiseData(promiseId);

  // if (isPromisePending) {
  //   return <DeferredLoader />;
  // }

  // const { name, description } = promiseData;

  const creatorName = '임시 초대자 이름';
  const name = '임시 약속 이름';
  const description = '임시 약속 설명';

  return (
    <S.Container>
      <S.CreaterText>{`${creatorName}님이 약속을 공유했어요`}</S.CreaterText>
      <S.InfoContainer>
        <S.Name>{name}</S.Name>
        <S.Description>{description}</S.Description>
      </S.InfoContainer>
      <S.Line />
      <SignInForm />
    </S.Container>
  );
};
export default JoinPage;
