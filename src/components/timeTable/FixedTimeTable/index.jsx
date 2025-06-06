import { useState } from 'react';
import * as S from './style';
import TimeIcon from '../../../assets/img/icon/time.svg';
// import FixedScheduleModal from './FixedScheduleModal'; // 나중에 브랜치 병합 시 사용

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

const FixedTimeTable = () => {
  // [hour][day][quarter] 구조
  const [selected /* setSelected */] = useState(
    Array.from({ length: 24 }, () => Array.from({ length: 7 }, () => Array(4).fill(false))),
  );
  // const [modalOpen, setModalOpen] = useState(false);

  // 셀(quarter)에 일정이 있는지 확인
  const isQuarterActive = (hourIdx, dayIdx, quarterIdx) => {
    return selected[hourIdx][dayIdx][quarterIdx];
    // 또는 일정 데이터 기반으로 표시하려면 schedules에서 계산
  };

  return (
    <>
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
        {HOURS.map((hour, hourIdx) => (
          <S.Row key={hour}>
            <S.HeaderCell $noLeft>{hour}</S.HeaderCell>
            {DAYS.map((_, dayIdx) => (
              <S.Cell key={dayIdx}>
                {Array.from({ length: 4 }).map((_, quarterIdx) => (
                  <S.Quarter
                    key={quarterIdx}
                    selected={isQuarterActive(hourIdx, dayIdx, quarterIdx)}
                    // onMouseDown, onMouseEnter 등은 필요에 따라 추가
                  />
                ))}
              </S.Cell>
            ))}
          </S.Row>
        ))}
      </S.TableWrapper>
      {/* 
      <S.AddButton type="button" onClick={() => setModalOpen(true)}>
        + 일정 추가
      </S.AddButton>
      <FixedScheduleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddSchedule}
      />
      */}
    </>
  );
};

export default FixedTimeTable;
