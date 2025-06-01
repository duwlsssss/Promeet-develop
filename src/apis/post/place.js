import axiosInstance from '../axiosInstance';

// 좋아요
export const postLike = async (userId, placeInfo) => {
  const { data } = await axiosInstance.post(`/likes`, {
    userId,
    placeInfo,
  });
  return data;
};
