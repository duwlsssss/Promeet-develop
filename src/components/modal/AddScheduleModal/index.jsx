import PropTypes from 'prop-types';
import { useState } from 'react';
import DaySelectModal from '@/components/modal/DaySelectModal';
import TimeSelectModal from '@/components/modal/TimeSelectModal';
import selectIcon from '@/assets/img/icon/dropdown.svg';
import deleteIcon from '@/assets/img/icon/delete.svg';
import * as S from './style';

const defaultSchedule = () => ({
  day: '월요일',
  startTime: { hour: '09', minute: '00' },
  endTime: { hour: '18', minute: '00' },
});

function timeToMinutes({ hour, minute }) {
  return Number(hour) * 60 + Number(minute);
}
function addMinutes(time, mins) {
  let total = timeToMinutes(time) + mins;
  if (total < 0) total += 24 * 60;
  total = total % (24 * 60);
  return {
    hour: String(Math.floor(total / 60)).padStart(2, '0'),
    minute: String(total % 60).padStart(2, '0'),
  };
}

// 00:00(24:00) 처리 보조
function getEndMins(time) {
  return time.hour === '00' && time.minute === '00' ? 1440 : timeToMinutes(time);
}

const AddScheduleModal = ({ isOpen, onClose }) => {
  const [schedules, setSchedules] = useState([defaultSchedule()]);
  const [activeIdx, setActiveIdx] = useState(null);
  const [modalType, setModalType] = useState(null);

  const openModal = (idx, type) => {
    setActiveIdx(idx);
    setModalType(type);
  };
  const closeModal = () => {
    setActiveIdx(null);
    setModalType(null);
  };

  // 요일 선택
  const handleDaySelect = (day) => {
    setSchedules((prev) => prev.map((item, idx) => (idx === activeIdx ? { ...item, day } : item)));
    closeModal();
  };

  // 종료 시간 선택
  const handleEndTimeSelect = (time) => {
    setSchedules((prev) =>
      prev.map((item, idx) => {
        if (idx !== activeIdx) return item;
        const endMins = getEndMins(time);
        const startMins = timeToMinutes(item.startTime);

        if (endMins <= startMins) {
          // 01:00 이전이면 시작 00:00
          if (endMins < 60) {
            return { ...item, endTime: time, startTime: { hour: '00', minute: '00' } };
          }
          // 그 외 1시간 전
          return { ...item, endTime: time, startTime: addMinutes(time, -60) };
        }
        return { ...item, endTime: time };
      }),
    );
    closeModal();
  };

  // 시작 시간 선택
  const handleStartTimeSelect = (time) => {
    setSchedules((prev) =>
      prev.map((item, idx) => {
        if (idx !== activeIdx) return item;
        const startMins = timeToMinutes(time);
        const isEndTimeMidnight = item.endTime.hour === '00' && item.endTime.minute === '00';
        let endMins = isEndTimeMidnight ? 1440 : timeToMinutes(item.endTime);

        if (startMins >= endMins) {
          // 시작이 23:00 이후면 끝 00:00(24:00)
          if (startMins >= 1380) {
            return { ...item, startTime: time, endTime: { hour: '00', minute: '00' } };
          }
          // 끝이 24:00이면 그대로
          if (isEndTimeMidnight) {
            return { ...item, startTime: time, endTime: { hour: '00', minute: '00' } };
          }
          // 그 외 1시간 뒤
          return { ...item, startTime: time, endTime: addMinutes(time, 60) };
        }
        return { ...item, startTime: time };
      }),
    );
    closeModal();
  };

  const handleAddSchedule = () => {
    setSchedules((prev) => [...prev, defaultSchedule()]);
  };

  const handleDeleteSchedule = (idx) => {
    setSchedules((prev) => prev.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  return (
    <>
      <S.Overlay>
        <S.Slide>
          <S.CloseButton onClick={onClose} aria-label="close">
            ×
          </S.CloseButton>
          <div>
            <h2>일정명</h2>
            <S.Divider />
            {schedules.map((item, idx) => (
              <S.TableSetting key={idx} style={{ marginBottom: 24 }}>
                <S.DayTimeSelect>
                  <S.DaySelectButton onClick={() => openModal(idx, 'day')}>
                    {item.day}
                    <img src={selectIcon} alt="Select Day" />
                  </S.DaySelectButton>
                  <S.TimeRow>
                    <S.TimeButton onClick={() => openModal(idx, 'start')}>
                      {item.startTime.hour}:{item.startTime.minute}
                      <img src={selectIcon} alt="Select Time" />
                    </S.TimeButton>
                  </S.TimeRow>
                  <S.TimeRow>
                    <S.TimeButton onClick={() => openModal(idx, 'end')}>
                      {item.endTime.hour === '00' && item.endTime.minute === '00'
                        ? '24:00'
                        : `${item.endTime.hour}:${item.endTime.minute}`}
                      <img src={selectIcon} alt="Select Time" />
                    </S.TimeButton>
                  </S.TimeRow>
                </S.DayTimeSelect>
                <S.DeleteButton type="button" onClick={() => handleDeleteSchedule(idx)}>
                  <img src={deleteIcon} alt="Delete Schedule" />
                </S.DeleteButton>
              </S.TableSetting>
            ))}
            <S.AddButton type="button" onClick={handleAddSchedule}>
              시간 추가
            </S.AddButton>
          </div>
        </S.Slide>
      </S.Overlay>
      <DaySelectModal
        isOpen={modalType === 'day'}
        onClose={closeModal}
        onSelect={handleDaySelect}
      />
      <TimeSelectModal
        isOpen={modalType === 'start'}
        onClose={closeModal}
        onSelect={handleStartTimeSelect}
        initialHour={activeIdx !== null ? schedules[activeIdx].startTime.hour : '09'}
        initialMinute={activeIdx !== null ? schedules[activeIdx].startTime.minute : '00'}
      />
      <TimeSelectModal
        isOpen={modalType === 'end'}
        onClose={closeModal}
        onSelect={handleEndTimeSelect}
        initialHour={activeIdx !== null ? schedules[activeIdx].endTime.hour : '18'}
        initialMinute={activeIdx !== null ? schedules[activeIdx].endTime.minute : '00'}
        isEnd
      />
    </>
  );
};

AddScheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default AddScheduleModal;
