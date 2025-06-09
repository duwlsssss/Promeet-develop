import { useState, useRef, useEffect, useCallback } from 'react';
import * as S from './style';
import TimeIcon from '../../../assets/img/icon/time.svg';
import PropTypes from 'prop-types';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const DAY_KOR = ['일', '월', '화', '수', '목', '금', '토'];

// 시간 인덱스를 "HH:MM" 문자열로 변환
function getTimeFromIndex(hourIdx, quarterIdx) {
  const hour = String(hourIdx).padStart(2, '0');
  const minute = String(quarterIdx * 15).padStart(2, '0');
  return `${hour}:${minute}`;
}

const AbleTimeTable = ({ days, onChange, fixedSchedule = [] }) => {
  const [selected, setSelected] = useState(
    Array.from({ length: 24 }, () =>
      Array.from({ length: days.length }, () => Array(4).fill(false)),
    ),
  );
  const isDragging = useRef(false);
  const dragValue = useRef(true);

  const toggleQuarter = useCallback((hourIdx, dayIdx, quarterIdx) => {
    setSelected((prev) =>
      prev.map((row, h) =>
        row.map((cell, d) =>
          cell.map((val, q) =>
            h === hourIdx && d === dayIdx && q === quarterIdx ? dragValue.current : val,
          ),
        ),
      ),
    );
  }, []);

  // 마우스 이벤트 핸들러
  const handleQuarterMouseDown = (hourIdx, dayIdx, quarterIdx, e) => {
    e.preventDefault();
    isDragging.current = true;
    dragValue.current = !selected[hourIdx][dayIdx][quarterIdx];
    toggleQuarter(hourIdx, dayIdx, quarterIdx);
  };

  const handleQuarterMouseEnter = (hourIdx, dayIdx, quarterIdx) => {
    if (!isDragging.current) return;
    toggleQuarter(hourIdx, dayIdx, quarterIdx);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // 선택 상태 변경 시 상위로 전달
  useEffect(() => {
    if (onChange) onChange(selected);
  }, [selected, onChange, days.length]);

  // 고정 일정 셀 여부
  const isFixedCell = useCallback(
    (dayName, hourIdx, quarterIdx) => {
      const cellTime = getTimeFromIndex(hourIdx, quarterIdx);
      return fixedSchedule.some(
        (fs) => fs.day === dayName && fs.startTime <= cellTime && cellTime < fs.endTime,
      );
    },
    [fixedSchedule],
  );

  return (
    <S.TableWrapper onMouseLeave={handleMouseUp} onMouseUp={handleMouseUp}>
      <S.Row>
        <S.HeaderCell $noTop $noLeft>
          <img src={TimeIcon} alt="시간표" width={24} height={24} />
        </S.HeaderCell>
        {days.map((item) => {
          const dateObj = new Date(item.date);
          const dayKor = DAY_KOR[dateObj.getDay()];
          const dateStr = `${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(
            dateObj.getDate(),
          ).padStart(2, '0')}`;
          return (
            <S.HeaderCell key={item.date} $noTop>
              {dateStr} <br /> {dayKor}
            </S.HeaderCell>
          );
        })}
      </S.Row>

      {HOURS.map((hour, hourIdx) => (
        <S.Row key={hour}>
          <S.HeaderCell $noLeft>{hour}</S.HeaderCell>
          {days.map((item, dayIdx) => (
            <S.Cell key={dayIdx}>
              {Array.from({ length: 4 }).map((_, quarterIdx) => {
                const isFixed = isFixedCell(item.day, hourIdx, quarterIdx);
                return (
                  <S.Quarter
                    key={quarterIdx}
                    selected={selected[hourIdx][dayIdx][quarterIdx]}
                    $isFixed={isFixed}
                    onMouseDown={(e) => handleQuarterMouseDown(hourIdx, dayIdx, quarterIdx, e)}
                    onMouseEnter={() => handleQuarterMouseEnter(hourIdx, dayIdx, quarterIdx)}
                    onMouseMove={() => handleQuarterMouseEnter(hourIdx, dayIdx, quarterIdx)}
                  />
                );
              })}
            </S.Cell>
          ))}
        </S.Row>
      ))}
    </S.TableWrapper>
  );
};

AbleTimeTable.propTypes = {
  days: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  fixedSchedule: PropTypes.array,
};

export default AbleTimeTable;
