import { Suspense, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import './styles/fonts.css';
// 비동기 통신
import { QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import queryClient from './lib/tanstack-query/queryClient';
// import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'; // 디버깅용
// 에러 처리
import { ErrorBoundary } from 'react-error-boundary';
// 라우팅
import Router from './routes/Router.jsx';
// 컴포넌트
import DeferredLoader from './components/ui/DeferredLoader';
import ErrorFallback from './components/ui/ErrorFallback';
import Toast from './components/ui/Toast';
import { useMapActions } from '@/hooks/stores/promise/map/useMapStore';

// 카카오맵 스크립트 로드 함수
const loadKakaoMapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps && typeof window.kakao.maps.load === 'function') {
      resolve(window.kakao);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false&libraries=services,clusterer,drawing`;
    script.async = true;
    script.onload = () => resolve(window.kakao);
    script.onerror = () => reject(new Error('[카카오맵 스크립트 로드 실패]'));
    document.head.appendChild(script);
  });
};

function App() {
  // const [isOpen, setIsOpen] = useState(false); // ReactQueryDevtoolsPanel 열고닫기
  const { setIsKakaoLoaded } = useMapActions();
  const [isKakaoReady, setIsKakaoReady] = useState(false);

  useEffect(() => {
    loadKakaoMapScript()
      .then((kakao) => {
        kakao.maps.load(() => {
          setIsKakaoLoaded(true);
          setIsKakaoReady(true);
        });
      })
      .catch((err) => {
        console.error(err);
        // TODO: 에러 처리 (예: 토스트 메시지)
      });
  }, [setIsKakaoLoaded]);

  if (!isKakaoReady) {
    return <DeferredLoader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
              <Suspense fallback={<DeferredLoader />}>
                <Router />
                <Toast />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        {/* <button
          onClick={() => setIsOpen(!isOpen)}
        >{`${isOpen ? 'Close' : 'Open'} the devtools panel`}</button>
        {isOpen && (
          <ReactQueryDevtoolsPanel style={{ height: '200px' }} onClose={() => setIsOpen(false)} />
        )} */}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
