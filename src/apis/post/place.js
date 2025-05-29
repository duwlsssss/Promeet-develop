import axiosInstance from '../axiosInstance';

// 좋아요
export const postLike = async (placeId) => {
  const { data } = await axiosInstance.post(`/places/${placeId}/likes`);
  return data;
};
