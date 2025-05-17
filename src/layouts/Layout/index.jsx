import { Outlet } from 'react-router-dom';
import * as S from './style';
import Navbar from '../../layouts/Navbar';

const Layout = () => {
  return (
    <S.MainContainer>
      <Outlet />
      <Navbar />
    </S.MainContainer>
  );
};

export default Layout;
