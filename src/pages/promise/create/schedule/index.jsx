import * as S from './style';
import AbleTimeTable from '@/components/timeTable/AbleTimeTable';
import {
  usePromiseDataInfo,
  usePromiseDataActions,
} from '@/hooks/stores/promise/usePromiseDataStore';
import { useRef } from 'react';

// 시간 인덱스를 "HH:MM" 문자열로 변환
function getTimeFromIndex(hourIdx, quarterIdx) {
  const hour = String(hourIdx).padStart(2, '0');
  const minute = String(quarterIdx * 15).padStart(2, '0');
  return `${hour}:${minute}`;
}

// 선택된 시간표에서 연속된 구간 추출
function extractTimeRanges(selectedDayArr) {
  const ranges = [];
  let rangeStart = null;
  for (let h = 0; h < 24; h++) {
    for (let q = 0; q < 4; q++) {
      if (selectedDayArr[h][q]) {
        if (rangeStart === null) rangeStart = { hour: h, quarter: q };
      } else {
        if (rangeStart !== null) {
          ranges.push({
            start: getTimeFromIndex(rangeStart.hour, rangeStart.quarter),
            end: getTimeFromIndex(h, q),
          });
          rangeStart = null;
        }
      }
    }
  }
  if (rangeStart !== null) {
    ranges.push({
      start: getTimeFromIndex(rangeStart.hour, rangeStart.quarter),
      end: '24:00',
    });
  }
  return ranges;
}

// 테스트용 고정 일정 데이터
const fixedSchedule = [
  { id: 'schedule1', day: 'Monday', startTime: '10:00', endTime: '12:00' },
  { id: 'schedule2', day: 'Wednesday', startTime: '14:00', endTime: '16:00' },
];

const SchedulePage = () => {
  const { availableTimes } = usePromiseDataInfo();
  const { setAvailableTimes } = usePromiseDataActions();
  const prevAvailableTimesRef = useRef(null);
  const selectedRef = useRef(null);

  const handleTimeTableChange = (selected) => {
    selectedRef.current = selected;
    const newAvailableTimes = availableTimes.map((item, dayIdx) => {
      const dayArr = Array.from({ length: 24 }, (_, h) =>
        Array.from({ length: 4 }, (_, q) => selected[h][dayIdx][q]),
      );
      const ranges = extractTimeRanges(dayArr);
      return {
        ...item,
        timeRanges: ranges.map((r) => ({
          startTime: r.start,
          endTime: r.end,
        })),
      };
    });

    // 상태 변경이 있을 때만 저장
    const prev = prevAvailableTimesRef.current;
    const isSame = prev && JSON.stringify(prev) === JSON.stringify(newAvailableTimes);

    if (!isSame) {
      prevAvailableTimesRef.current = newAvailableTimes;
      setAvailableTimes(newAvailableTimes);
    }
  };

  // 약속 생성 버튼 클릭 시 실행
  const handleCreatePromise = () => {
    // 날짜별로 여러 구간을 각각 객체로 변환
    const newAvailableTimes = [];
    availableTimes.forEach((item, idx) => {
      if (!item.timeRanges || item.timeRanges.length === 0) return;
      item.timeRanges.forEach((range, rIdx) => {
        newAvailableTimes.push({
          id: `schedule${idx + 1}_${rIdx + 1}`,
          date: item.date,
          day: item.day,
          startTime: range.startTime,
          endTime: range.endTime,
        });
      });
    });
    console.log('최종 API 요청용 availableTimes:', newAvailableTimes);
    // setAvailableTimes(newAvailableTimes);
  };

  return (
    <S.Container>
      <S.TableScrollWrapper>
        <S.TableInnerWrapper>
          <AbleTimeTable
            days={availableTimes}
            onChange={handleTimeTableChange}
            fixedSchedule={fixedSchedule}
          />
        </S.TableInnerWrapper>
      </S.TableScrollWrapper>
      <S.CreatePromiseButton onClick={handleCreatePromise}>약속 생성</S.CreatePromiseButton>
    </S.Container>
  );
};

export default SchedulePage;
