import axiosInstance from '../axiosInstance';

// 좋아요 취소
export const deleteLike = async (placeId) => {
  const { data } = await axiosInstance.delete(`/places/${placeId}/likes`);
  return data;
};
