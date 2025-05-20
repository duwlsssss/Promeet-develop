import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ErrorFallback from '../components/ui/ErrorFallback';
import { ROUTES } from '../constants/routes';
//페이지
import SignInPage from '../pages/sign-in';

import HomePage from '../pages/index';

import InfoPage from '../pages/promise/create/info';
import DatePage from '../pages/promise/create/date';
import LocationPage from '../pages/promise/create/location';
import SchedulePage from '../pages/promise/create/schedule';
import FinalizePage from '../pages/promise/create/finalize';

import JoinPage from '../pages/promise/[id]/join';
import JoinLocationPage from '../pages/promise/[id]/location';
import JoinSchedulePage from '../pages/promise/[id]/schedule';
import ResultPage from '../pages/promise/[id]/result';

import SummaryPage from '../pages/promise/[id]/summary';

import UserPage from '../pages/user/index';
import EnterSchedulePage from '../pages/user/enter-schedule';

import NotFoundPage from '../pages/not-found';

// 페이지 보호
const ProtectedPage = ({ children }) => {
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedPage>
        <Layout />
      </ProtectedPage>
    ),
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.SIGN_IN,
        element: <SignInPage />,
      },
      // 약속 생성 관련
      {
        path: ROUTES.PROMISE_CREATE_INFO,
        element: <InfoPage />,
      },
      {
        path: ROUTES.PROMISE_CREATE_DATE,
        element: <DatePage />,
      },
      {
        path: ROUTES.PROMISE_CREATE_LOCATION,
        element: <LocationPage />,
      },
      {
        path: ROUTES.PROMISE_CREATE_SCHEDULE,
        element: <SchedulePage />,
      },
      {
        path: ROUTES.PROMISE_CREATE_FINALIZE,
        element: <FinalizePage />,
      },
      // 약속 참여 관련 (공유 링크)
      {
        path: ROUTES.PROMISE_JOIN,
        element: <JoinPage />,
      },
      {
        path: ROUTES.PROMISE_LOCATION,
        element: <JoinLocationPage />,
      },
      {
        path: ROUTES.PROMISE_SCHEDULE,
        element: <JoinSchedulePage />,
      },
      {
        path: ROUTES.PROMISE_RESULT,
        element: <ResultPage />,
      },
      // 공통
      {
        path: ROUTES.PROMISE_SUMMARY,
        element: <SummaryPage />,
      },
      // 유저
      {
        path: ROUTES.USER,
        element: <UserPage />,
      },
      {
        path: ROUTES.ENTER_SCHEDULE,
        element: <EnterSchedulePage />,
      },
      // 404
      {
        path: '*',
        element: <NotFoundPage />, // 404는 라우트로 처리
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
