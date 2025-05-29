import { useMutation } from '@tanstack/react-query';
import { postLike } from '@/apis/post/place';
import { deleteLike } from '@/apis/delete/place';
import useHandleError from '../useHandleError';
import queryClient from '@/lib/tanstack-query/queryClient';
import { QUERY_KEY } from '@/constants/key';

const useToggleLikePlace = () => {
  const handleError = useHandleError();
  // 내 정보
  // const { myInfo } = useUserStore();
  // const myUserId = myInfo?.id;
  const myUserId = '0000'; // 임시 유저 정보

  return useMutation({
    mutationFn: ({ placeId, isLiked }) => (isLiked ? deleteLike(placeId) : postLike(placeId)),
    onMutate: async ({ placeId, isLiked }) => {
      // 1. 장소에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청)
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.places, placeId],
      });

      // 2. 현재 장소 관련 데이터를 캐시에서 가져오기
      const prevData = queryClient.getQueryData([QUERY_KEY.places, placeId]);

      if (!prevData || !myUserId) return { prevData };

      // 3. 좋아요 정보 저장
      queryClient.setQueryData([QUERY_KEY.places, placeId], (old) => {
        if (!old) return old;

        // 취소면 나를 좋아요 목록에서 제거, 누르는 거면 내 id 추가
        const updatedLikes = isLiked
          ? old.data.likes.filter((userId) => userId !== myUserId)
          : [...old.data.likes, myUserId];

        return {
          ...old,
          data: {
            ...old.data,
            likes: updatedLikes,
          },
        };
      });

      return { prevData };
    },

    // 요청 실패시 롤백
    onError: (error, { placeId }, context) => {
      if (context?.prevData) {
        queryClient.setQueryData([QUERY_KEY.places, placeId], context.prevData);
      }
      handleError(error);
    },

    // 서버의 실제 최신 데이터를 다시 가져옴
    onSettled: async (_, __, { placeId }) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.places, placeId],
        exact: true,
      });
    },
  });
};

export default useToggleLikePlace;
