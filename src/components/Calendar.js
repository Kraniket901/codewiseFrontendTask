import React, { useEffect, useRef, useState } from 'react';

const Calendar = () => {
  const startMonth = 5; // June is 5 in JavaScript Date object (0-indexed)
  const endMonth = 5 + 12;   // June is 5 in JavaScript Date object (0-indexed)
  const year = 2023;

  const renderMonth = (month, year) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    const weeksArray = [];
    let week = [];

    for (let i = 0; i < firstDay; i++) {
      week.push({ day: null, isToday: false });
    }

    daysArray.forEach((day, index) => {
      if ((index + firstDay) % 7 === 0 && index !== 0) {
        weeksArray.push([...week]);
        week = [];
      }

      const isToday = year === currentYear && month === currentMonth && day === today;

      week.push({ day, isToday });
    });

    weeksArray.push([...week]);

    return (
      <table key={`${year}-${month}`}>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {weeksArray.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map(({ day, isToday }, dayIndex) => (
                <td key={dayIndex} style={{ color: isToday ? 'blue' : 'black' }}>
                  {day !== null ? day : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const scrollRef = useRef(null);
  const [defaultMonth, setDefaultMonth] = useState(getCurrentMonth());

  function getCurrentMonth() {
    const currentDate = new Date();
    return currentDate.getMonth() - startMonth;
  }

  const handleScrollToMonth = (monthIndex) => {
    if (scrollRef.current) {
      const targetElement = scrollRef.current.children[monthIndex];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    handleScrollToMonth(defaultMonth);
  }, [defaultMonth]);

  return (
    <div style={{ width: '100%', display: "flex", flexDirection: "column", alignItems: "center" }}>
      <select onChange={(e) => handleScrollToMonth(parseInt(e.target.value))} value={defaultMonth}>
        {Array.from({ length: endMonth - startMonth + 1 }, (_, index) => {
          const monthIndex = startMonth + index;
          const monthName = new Date(year, monthIndex, 1).toLocaleString('en-US', { month: 'long' });
          return <option key={index} value={index}>{`${monthName} ${year}`}</option>;
        })}
      </select>
      <div ref={scrollRef} style={{ overflowY: 'auto', width: '100%', display: "flex", flexDirection: "column", alignItems: "center" }}>
        {Array.from({ length: endMonth - startMonth + 1 }, (_, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h2>{`${new Date(year, startMonth + index, 1).toLocaleString('en-US', { month: 'long' })} ${year}`}</h2>
            {renderMonth(startMonth + index, year)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
