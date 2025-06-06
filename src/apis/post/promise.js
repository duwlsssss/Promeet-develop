import axiosInstance from '../axiosInstance';

// 좋아요
export const postPlaceLike = async (promiseId, place, userId) => {
  const { data } = await axiosInstance.post(`/likes`, {
    promiseId,
    place,
    userId,
  });
  return data;
};
