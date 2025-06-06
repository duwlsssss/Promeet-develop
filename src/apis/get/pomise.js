import axiosInstance from '../axiosInstance';

// 장소 좋아요 가져오기
export const getPlaceLike = async (promiseId, placeId, userId) => {
  const { data } = await axiosInstance.get(`/likes`, {
    params: { promiseId, placeId, userId },
  });
  return data;
};
