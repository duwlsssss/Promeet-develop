import axiosInstance from '../axiosInstance';

// 좋아요 취소
export const deleteLike = async (userId, placeId) => {
  const { data } = await axiosInstance.delete(`/likes`, {
    userId,
    placeId,
  });
  return data;
};
