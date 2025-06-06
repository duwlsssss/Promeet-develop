import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ROUTES } from '../constants/routes';
import { useUserInfo, useUserActions } from '@/hooks/stores/auth/useUserStore';

// 페이지 보호
export const ProtectedPageWrapper = ({ children }) => {
  const { userId } = useUserInfo();
  const navigate = useNavigate();

  if (!userId) {
    navigate(ROUTES.SIGN_IN);
    return null;
  }

  return children;
};

ProtectedPageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

// 약속 생성자만 접근 가능
export const CreateOnlyWrapper = ({ children }) => {
  // const { promises } = useUserInfo();
  // const navigate = useNavigate();
  // const { promiseId } = useParams();
  const { setUserType } = useUserActions();

  // 유저가 생성한 약속이 아니면 홈으로 리다이렉트
  // if (!promises.create.includes(promiseId)) {
  //   navigate(ROUTES.HOME);
  //   return null;
  // }

  // 유저 타입 정의
  setUserType('create');

  return children;
};

CreateOnlyWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

// 참여 요청 받은 사람만 접근 가능
export const JoinOnlyWrapper = ({ children }) => {
  const { promises } = useUserInfo();
  const navigate = useNavigate();
  const { promiseId } = useParams();
  const { setUserType } = useUserActions();

  if (!promises.join.includes(promiseId)) {
    navigate(ROUTES.HOME);
    return null;
  }

  setUserType('join');
  return children;
};

JoinOnlyWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

// 약속에 포함된 사람이면 접근 가능
export const PromiseMemberWrapper = ({ children }) => {
  const { promises } = useUserInfo();
  const navigate = useNavigate();
  const { promiseId } = useParams();
  const { setUserType } = useUserActions();

  if (!promises.create.includes(promiseId) && !promises.join.includes(promiseId)) {
    navigate(ROUTES.HOME);
    return null;
  }

  setUserType('member');
  return children;
};

PromiseMemberWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
