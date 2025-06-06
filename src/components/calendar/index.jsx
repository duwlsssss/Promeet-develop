import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import * as S from './style';
import 'react-calendar/dist/Calendar.css';
import prevIcon from '../../assets/img/icon/left.svg';
import nextIcon from '../../assets/img/icon/right.svg';

export default function CalendarRange() {
  const [range, setRange] = useState([new Date(), new Date()]);
  const [dragging, setDragging] = useState(false);
  const [dragRange, setDragRange] = useState({ from: null, to: null });

  const today = new Date();

  const isPastDay = (date) => {
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const compare = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return compare < todayMidnight;
  };

  const handleMouseDown = (date) => {
    setDragging(true);
    setDragRange({ from: date, to: date });
  };

  const handleMouseEnter = (date) => {
    if (dragging && dragRange.from) {
      setDragRange((prev) => ({ ...prev, to: date }));
    }
  };

  const handleMouseUp = () => {
    if (dragRange.from && dragRange.to) {
      const [start, end] = [dragRange.from, dragRange.to].sort((a, b) => a - b);
      setRange([start, end]);
    }
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragRange]);

  return (
    <S.CalendarWrapper>
      <Calendar
        onChange={() => {}}
        value={range}
        tileDisabled={({ date }) => isPastDay(date)}
        tileClassName={({ date, view, activeStartDate }) => {
          if (view === 'month') {
            const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            const dragFrom =
              dragRange.from &&
              new Date(
                dragRange.from.getFullYear(),
                dragRange.from.getMonth(),
                dragRange.from.getDate(),
              );
            const dragTo =
              dragRange.to &&
              new Date(dragRange.to.getFullYear(), dragRange.to.getMonth(), dragRange.to.getDate());

            if (range[0] && range[1]) {
              const start = new Date(range[0].setHours(0, 0, 0, 0));
              const end = new Date(range[1].setHours(0, 0, 0, 0));
              if (start.getTime() === end.getTime() && dateOnly.getTime() === start.getTime()) {
                return 'single-day';
              }
            }
            if (dragFrom && dragTo) {
              const [start, end] = dragFrom < dragTo ? [dragFrom, dragTo] : [dragTo, dragFrom];

              if (dateOnly.getTime() === start.getTime()) return 'drag-start';
              if (dateOnly.getTime() === end.getTime()) return 'drag-end';
              if (dateOnly > start && dateOnly < end) return 'custom-drag-range';
            }
            if (isPastDay(dateOnly)) return 'past-day';
            if (date.getMonth() !== activeStartDate.getMonth()) return 'not-this-month';
            return 'future-day';
          }
          return null;
        }}
        tileContent={({ date }) => (
          <div
            onMouseDown={() => handleMouseDown(date)}
            onMouseEnter={() => handleMouseEnter(date)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 5,
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          />
        )}
        locale="en-US"
        formatMonthYear={(locale, date) =>
          `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`
        }
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 1)
        }
        next2Label={null}
        prev2Label={null}
        nextLabel={<img src={nextIcon} alt="Next" />}
        prevLabel={<img src={prevIcon} alt="Previous" />}
      />
    </S.CalendarWrapper>
  );
}
