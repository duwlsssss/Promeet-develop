import * as S from './style';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/schemas/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useSignIn from '@/hooks/mutations/useSignIn';

const SignInForm = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    // watch, // 디버깅용
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      password: '',
    },
  });

  const { mutate: signIn, isPending: isSignInPending } = useSignIn(setError);

  // 폼 제출 핸들러
  const onSubmit = (formData) => {
    signIn(formData);
  };

  // // 디버깅용
  // console.log('현재 signIn form', {
  //   errors,
  //   data: watch(),
  // });

  return (
    <>
      <S.Title>로그인</S.Title>
      <S.SignInForm onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          id="name"
          name="name"
          height="90px"
          useForm
          control={control}
          placeholder="이름을 입력해주세요"
        />
        <Input
          type="password"
          id="password"
          name="password"
          height="90px"
          useForm
          control={control}
          placeholder="비밀번호를 입력해주세요"
        />
        <Button
          color="main"
          disabled={isSubmitting || Object.keys(errors).length > 0 || isSignInPending}
        >
          {isSignInPending ? '로그인 중...' : '로그인하기'}
        </Button>
      </S.SignInForm>
    </>
  );
};

export default SignInForm;
