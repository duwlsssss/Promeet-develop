import * as S from './style';
import CalendarRange from '@/components/calendar';
import { usePromiseDataActions } from '@/hooks/stores/promise/usePromiseDataStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DatePage = () => {
  const navigate = useNavigate();
  const { setAvailableTimes } = usePromiseDataActions();
  const [selectedRange, setSelectedRange] = useState(null);

  const handleDateRangeChange = (range) => {
    setSelectedRange(range);
    console.log('selectedRange:', range);
  };

  const handleSaveDates = () => {
    if (!selectedRange || !selectedRange[0] || !selectedRange[1]) return;
    const dates = [];
    let d = new Date(
      selectedRange[0].getFullYear(),
      selectedRange[0].getMonth(),
      selectedRange[0].getDate(),
    );
    const end = new Date(
      selectedRange[1].getFullYear(),
      selectedRange[1].getMonth(),
      selectedRange[1].getDate(),
    );
    while (d <= end) {
      const dateStr = d.toLocaleDateString('en-CA');
      dates.push({
        dateObj: new Date(d),
        dateStr,
        day: d.toLocaleDateString('en-US', { weekday: 'long' }),
      });
      d.setDate(d.getDate() + 1);
    }
    setAvailableTimes(
      dates.map((item, idx) => ({
        id: `schedule${idx + 1}`,
        date: item.dateStr,
        day: item.day,
        timeRanges: [],
      })),
    );
    navigate('/promise/create/location');
  };

  return (
    <S.Container>
      <CalendarRange onChange={handleDateRangeChange} value={selectedRange} />
      <button
        onClick={handleSaveDates}
        disabled={
          !selectedRange ||
          (Array.isArray(selectedRange) &&
            (!selectedRange[0] || (selectedRange.length > 1 && !selectedRange[1])))
        }
      >
        다 음
      </button>
    </S.Container>
  );
};

export default DatePage;
