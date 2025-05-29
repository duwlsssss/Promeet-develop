import axiosInstance from '../axiosInstance';

// 좋아요 가져오기
// JWT 같은 토큰으로 userId 알아낸다고 가정함
export const getLike = async (placeId) => {
  const { data } = await axiosInstance.get(`/places/${placeId}/likes`);
  return data;
};

// 응답 가정
// {
//   "isLiked": true,
//   "likesCount": 12
// }
