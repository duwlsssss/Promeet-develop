import axiosInstance from '../axiosInstance';

// 약속 확정 (최종 장소 선택해서)
export const patchFinalizePromise = async (promiseId, userId, place) => {
  const { data } = await axiosInstance.patch(`/promises/${promiseId}/finalize`, {
    userId,
    place,
  });
  return data;
};
