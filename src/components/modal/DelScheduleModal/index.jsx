import * as S from './style';
import CommonModal from '@/components/modal/CommonModal';
import PropTypes from 'prop-types';

// userId를 prop으로 추가로 받도록 수정
async function deleteFixedSchedule(userId, scheduleId) {
  // 데이터 콘솔 출력
  console.log('[DelScheduleModal] deleteFixedSchedule 호출', {
    userId,
    scheduleId,
  });

  // 실제 서버 요청은 주석 처리
  /*
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_API_URL}/user/${userId}/fixed-schedules/${scheduleId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || '삭제에 실패했습니다.');
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || '네트워크 오류' };
  }
  */
  // 서버 없이 성공 처리
  return { success: true };
}

const DelScheduleModal = ({ isOpen, schedule, userId, onClose, onDelete }) => {
  if (!isOpen || !schedule) return null;

  const handleDeleteSchedule = async () => {
    const result = await deleteFixedSchedule(userId, schedule.scheduleId);
    if (result.success) {
      onDelete(schedule.scheduleId); // 부모에서 상태 갱신
    } else {
      alert(result.error || '삭제에 실패했습니다.');
    }
  };

  return (
    <CommonModal isOpen={isOpen} onClose={onClose}>
      <S.ModalContent>
        <S.Title>이 일정을 삭제하시겠습니까?</S.Title>
        <S.Info>
          <S.ScheduleName>{schedule.title}</S.ScheduleName>
          <br />
          {schedule.day} {schedule.startTime.hour}:{schedule.startTime.minute} ~{' '}
          {schedule.endTime.hour}:{schedule.endTime.minute}
        </S.Info>
        <S.ButtonRow>
          <S.CancelButton onClick={onClose}>취소</S.CancelButton>
          <S.DeleteButton onClick={handleDeleteSchedule}>삭제</S.DeleteButton>
        </S.ButtonRow>
      </S.ModalContent>
    </CommonModal>
  );
};

DelScheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  schedule: PropTypes.shape({
    scheduleId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
    startTime: PropTypes.shape({
      hour: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      minute: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    endTime: PropTypes.shape({
      hour: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      minute: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }),
  userId: PropTypes.string.isRequired, // 추가
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DelScheduleModal;
