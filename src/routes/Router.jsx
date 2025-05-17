import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../layouts/Layout';
import HomePage from '../pages/HomePage';
import UserPage from '../pages/UserPage';
import NotFoundPage from '../pages/NotFoundPage';
import ErrorFallback from '../components/ui/ErrorFallback';
import { ROUTES } from '../constants/routes';

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
        path: ROUTES.USER,
        element: <UserPage />,
      },
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
