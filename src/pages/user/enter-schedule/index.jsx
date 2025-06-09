import { useState } from 'react';
import * as S from './style';
import DelScheduleModal from '@/components/modal/DelScheduleModal';
import AddScheduleModal from '@/components/modal/AddScheduleModal';
import EditScheduleModal from '@/components/modal/EditScheduleModal';
import FixedTimeTable from '@/components/timeTable/FixedTimeTable';
import addIcon from '@/assets/img/icon/add.svg';

const DEFAULT_START = { hour: 9, minute: 0 };
const DEFAULT_END = { hour: 18, minute: 0 };

const userId = 'abc123';

const EnterSchedulePage = () => {
  // 서버에 보낼 데이터 구조로 state 관리
  const [fixedScheduleData, setFixedScheduleData] = useState({
    userId,
    fixedSchedules: [],
  });
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);

  // 일정 수정
  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setEditOpen(true);
  };

  const handleUpdateSchedule = (updatedSchedule) => {
    setFixedScheduleData((prev) => ({
      ...prev,
      fixedSchedules: prev.fixedSchedules.map((s) =>
        s.scheduleId === updatedSchedule.scheduleId ? updatedSchedule : s,
      ),
    }));
    setEditOpen(false);
    setEditingSchedule(null);
  };

  // 삭제 버튼 클릭 시
  const handleAskDeleteSchedule = (schedule) => {
    setDeletingSchedule(schedule);
    setDelOpen(true);
  };

  // 실제 삭제
  const handleDeleteSchedule = (scheduleId) => {
    setFixedScheduleData((prev) => ({
      ...prev,
      fixedSchedules: prev.fixedSchedules.filter((s) => s.scheduleId !== scheduleId),
    }));
    setDelOpen(false);
    setDeletingSchedule(null);
    // 서버 연동 시: DELETE /api/schedule/:scheduleId 등으로 요청
  };

  // 일정 추가 (AddScheduleModal에서 여러 일정 한 번에 추가)
  const handleAddSchedules = (schedules) => {
    // scheduleId를 새로 만들지 않고, 그대로 사용!
    setFixedScheduleData((prev) => ({
      ...prev,
      fixedSchedules: [...prev.fixedSchedules, ...schedules],
    }));
    setOpen(false);
  };

  return (
    <S.Container>
      <S.TopBar>
        <S.FixedScheduleTitle>고정 일정</S.FixedScheduleTitle>
        <S.ButtonOptions>
          <S.AddScheduleButton onClick={() => setOpen(true)}>
            <img src={addIcon} alt="Add" />
          </S.AddScheduleButton>
        </S.ButtonOptions>
      </S.TopBar>
      <S.TableScrollWrapper>
        <FixedTimeTable
          schedules={fixedScheduleData.fixedSchedules}
          defaultStart={DEFAULT_START}
          defaultEnd={DEFAULT_END}
          onEdit={handleEditSchedule}
          onDelete={handleAskDeleteSchedule}
        />
      </S.TableScrollWrapper>
      <AddScheduleModal isOpen={open} onClose={() => setOpen(false)} onAdd={handleAddSchedules} />
      <EditScheduleModal
        isOpen={editOpen}
        schedule={editingSchedule}
        userId={userId}
        onClose={() => setEditOpen(false)}
        onUpdate={handleUpdateSchedule}
      />
      <DelScheduleModal
        isOpen={delOpen}
        schedule={deletingSchedule}
        userId={userId}
        onClose={() => setDelOpen(false)}
        onDelete={handleDeleteSchedule}
      />
      스케줄 입력 페이지
    </S.Container>
  );
};

export default EnterSchedulePage;
