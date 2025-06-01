import * as S from './style';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/schemas/auth';
import useSignIn from '@/hooks/mutations/useSignIn';

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields },
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
    <S.SignInForm onSubmit={handleSubmit(onSubmit)}>
      {/* 커스텀 컴포넌트로 변경 필요 */}
      <input
        type="text"
        id="name"
        label="이름"
        {...register('name')}
        placeholder="이름을 입력해주세요"
      />
      {/* 커스텀 컴포넌트에 prop으로 넣어서 사용 필요 */}
      {touchedFields.name && errors.name && errors.name.message && <p>{errors.name.message}</p>}
      <input
        type="password"
        id="password"
        label="비밀번호"
        {...register('password')}
        placeholder="비밀번호를 입력해주세요(4자 이상)"
      />
      {touchedFields.password && errors.password && errors.name.message && (
        <p>{errors.password.message}</p>
      )}
      {/* 커스텀 컴포넌트로 변경 필요 */}
      <button disabled={isSubmitting || Object.keys(errors).length > 0 || isSignInPending}>
        {isSignInPending ? '로그인 중...' : '로그인하기'}
      </button>
    </S.SignInForm>
  );
};

export default SignInForm;
