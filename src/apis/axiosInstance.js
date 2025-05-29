import axios from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import useLocalStorage from '@/hooks/useLocalStorage';
import { ROUTES } from '@/constants/routes';

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지함
let refreshPromise = null;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const { getItem: getAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const token = getAccessToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 에러가 발생하면 refresh 토큰을 사용하여 토큰을 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // 이미 refresh 시도 했으면
      if (originalRequest.url === '리프레시 경로') {
        const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
        const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
        removeAccessToken();
        removeRefreshToken();
        window.location.href = ROUTES.SIGN_IN;
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // refreshPromise 없으면 refresh token으로 access token 갱신
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
          const refreshToken = getRefreshToken();

          const { data } = await axiosInstance.post('리프레시 경로', {
            refresh: refreshToken,
          });

          const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
          const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);

          return data.data.accessToken;
        })()
          .catch((err) => {
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken,
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken,
            );
            removeAccessToken();
            removeRefreshToken();
            window.location.href = ROUTES.HOME;
            return Promise.reject(err);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // refreshPromise 있으면
      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
