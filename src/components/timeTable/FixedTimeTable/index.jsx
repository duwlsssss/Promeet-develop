import * as S from './style';
import TimeIcon from '../../../assets/img/icon/time.svg';
import EditIcon from '../../../assets/img/icon/edit.svg';
import DelIcon from '../../../assets/img/icon/delete.svg';
import PropTypes from 'prop-types';
import { useState } from 'react';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function timeToMinutes({ hour, minute }) {
  return Number(hour) * 60 + Number(minute);
}

function getEndMins(time) {
  return time.hour === '00' && time.minute === '00' ? 1440 : timeToMinutes(time);
}

const FixedTimeTable = ({ schedules, defaultStart, defaultEnd, onEdit, onDelete }) => {
  // 선택된 scheduleId를 state로 관리
  const [selectedId, setSelectedId] = useState(null);

  const defaultMin = timeToMinutes(defaultStart);
  const defaultMax = timeToMinutes(defaultEnd);

  let minTime = defaultMin;
  let maxTime = defaultMax;

  if (schedules.length > 0) {
    const allStart = schedules.map((s) => timeToMinutes(s.startTime));
    const allEnd = schedules.map((s) => getEndMins(s.endTime)); // <-- 여기!
    const minSchedule = Math.min(...allStart);
    const maxSchedule = Math.max(...allEnd);

    // 만약 일정이 기본 범위를 벗어나면 확장
    if (minSchedule < defaultMin || maxSchedule > defaultMax) {
      minTime = Math.min(minSchedule, defaultMin);
      maxTime = Math.max(maxSchedule, defaultMax);
    }
  }

  // 시간 라벨 생성
  const hours = [];
  for (let t = minTime; t < maxTime; t += 60) {
    hours.push(String(Math.floor(t / 60)).padStart(2, '0'));
  }

  // 셀에 일정 표시
  const getScheduleForCell = (day, hour, quarter) => {
    const minute = quarter * 15;
    const cellTime = timeToMinutes({ hour, minute: String(minute).padStart(2, '0') });
    return schedules.find(
      (s) =>
        s.day.startsWith(day) &&
        cellTime >= timeToMinutes(s.startTime) &&
        cellTime < getEndMins(s.endTime),
    );
  };

  const isScheduleStartCell = (schedule, hour, quarter) => {
    if (!schedule) return false;
    const start = schedule.startTime;
    return Number(hour) === Number(start.hour) && quarter * 15 === Number(start.minute);
  };

  const isScheduleEndCell = (schedule, hour, quarter) => {
    if (!schedule) return false;
    const end = schedule.endTime;
    const endHour = end.hour === '00' && end.minute === '00' ? 24 : Number(end.hour);
    const endMinute = end.hour === '00' && end.minute === '00' ? 0 : Number(end.minute);

    // 마지막 셀(예: 12:45~13:00)에서만 true
    return (
      (Number(hour) === endHour - (endMinute === 0 ? 1 : 0) &&
        quarter * 15 + 15 === (endMinute === 0 ? 60 : endMinute)) ||
      // 24:00(00:00)일 때 마지막 셀(23:45~24:00)
      (end.hour === '00' && end.minute === '00' && Number(hour) === 23 && quarter === 3)
    );
  };

  return (
    <S.TableWrapper>
      <S.Row>
        <S.HeaderCell $noTop $noLeft>
          <img src={TimeIcon} alt="시간표 아이콘" width={24} height={24} />
        </S.HeaderCell>
        {DAYS.map((day) => (
          <S.HeaderCell key={day} $noTop>
            {day}
          </S.HeaderCell>
        ))}
      </S.Row>
      {hours.map((hour) => (
        <S.Row key={hour}>
          <S.HeaderCell $noLeft>{hour}</S.HeaderCell>
          {DAYS.map((day) => (
            <S.Cell key={day}>
              {Array.from({ length: 4 }).map((_, quarter) => {
                const schedule = getScheduleForCell(day, hour, quarter);
                const showTitle = isScheduleStartCell(schedule, hour, quarter);
                const isStart = isScheduleStartCell(schedule, hour, quarter);
                const isEnd = isScheduleEndCell(schedule, hour, quarter);
                // 일정이 있는 셀만 클릭 이벤트 부여
                return (
                  <S.Quarter
                    key={quarter}
                    selected={!!schedule}
                    isStart={isStart}
                    isEnd={isEnd}
                    onClick={() => {
                      if (schedule) {
                        setSelectedId(
                          selectedId === schedule.scheduleId ? null : schedule.scheduleId,
                        );
                      }
                    }}
                    style={{ cursor: schedule ? 'pointer' : 'default' }}
                  >
                    {showTitle ? (
                      <>
                        {schedule.title}
                        {/* 선택된 일정의 범위에서만 버튼 노출 */}
                        {!!schedule && selectedId === schedule.scheduleId && (
                          <S.ButtonGroup
                            style={{ opacity: selectedId === schedule.scheduleId ? 1 : 0 }}
                          >
                            <S.EditButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(schedule);
                              }}
                            >
                              <img src={EditIcon} alt="수정" width={12} height={12} />
                            </S.EditButton>
                            <S.DeleteButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(schedule); // schedule 객체 전체 전달
                              }}
                            >
                              <img src={DelIcon} alt="삭제" width={10} height={10} />
                            </S.DeleteButton>
                          </S.ButtonGroup>
                        )}
                      </>
                    ) : (
                      ''
                    )}
                  </S.Quarter>
                );
              })}
            </S.Cell>
          ))}
        </S.Row>
      ))}
    </S.TableWrapper>
  );
};

FixedTimeTable.propTypes = {
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
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
  ).isRequired,
  defaultStart: PropTypes.shape({
    hour: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    minute: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  defaultEnd: PropTypes.shape({
    hour: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    minute: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FixedTimeTable;
