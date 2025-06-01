import axiosInstance from '../axiosInstance';

// 좋아요 가져오기
export const getLike = async (placeId, userId) => {
  const { data } = await axiosInstance.get('/likes', {
    params: { placeId, userId },
  });
  return data;
};
