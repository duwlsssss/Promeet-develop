import * as S from './style';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/promise/Header';
import Input from '@/components/ui/Input';
import SearchLocation from '@/components/promise/SearchLocation';
import { PROMISE_CREATE_HEADER_TEXT } from '@/constants/promise';
import { ROUTES } from '@/constants/routes';

const slideVariants = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { type: 'tween', duration: 0.3 },
};

const LocationPage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <S.Container>
      <Header text={PROMISE_CREATE_HEADER_TEXT} navigateUrl={ROUTES.PROMISE_CREATE_DATE} />
      <S.LocationWrapper>
        <Input
          label="내 출발 위치"
          placeholder="출발 위치를 입력해주세요"
          onClick={openSearch}
          style={{ cursor: 'pointer' }}
        />
        <S.FixedPlaceText onClick={openSearch}>이미 약속 위치를 정해놨어요</S.FixedPlaceText>

        <AnimatePresence>
          {isSearchOpen && (
            <S.Slide
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideVariants.transition}
            >
              <SearchLocation onBack={closeSearch} />
            </S.Slide>
          )}
        </AnimatePresence>
      </S.LocationWrapper>
    </S.Container>
  );
};
export default LocationPage;
