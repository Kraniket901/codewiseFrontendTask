import React, { useEffect, useRef, useState } from 'react';
import EventModal from './EventModal';

const Calendar = () => {

  const [events, setEvents] = useState([]);
  const addEvent = (date, eventName) => {
    const newEvent = { date, eventName };
    setEvents([...events, newEvent]);
  };
  const [selectedDate, setSelectedDate] = useState(null);
  const handleOpenModal = (date) => {
    console.log('Opening modal for date:', date);
    setSelectedDate(date);
  };
  const handleCloseModal = () => {
    setSelectedDate(null);
  };
  const handleDeleteEvent = (eventToDelete) => {
    setEvents(events.filter((event) => event !== eventToDelete));
  };

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
              <td
                key={dayIndex}
                style={{ color: isToday ? 'blue' : 'black' }}
                onClick={() => handleOpenModal(new Date(year, month, day))}
              >
                {day !== null ? (
                  <>
                    {day}
                    {/* ... (existing code) */}
                  </>
                ) : (
                  ''
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>

      </table>
    );
  };

  const getCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    return currentMonth >= startMonth ? currentMonth - startMonth : 12 + currentMonth - startMonth;
  };

  const scrollRef = useRef(null);
  const [defaultMonth, setDefaultMonth] = useState(getCurrentMonth());

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <select onChange={(e) => setDefaultMonth(parseInt(e.target.value))} value={defaultMonth}>
      {Array.from({ length: endMonth - startMonth + 1 }, (_, index) => {
        const monthIndex = startMonth + index;
        const monthName = new Date(year, monthIndex, 1).toLocaleString('en-US', { month: 'long' });
        return <option key={index} value={index}>{`${monthName} ${year}`}</option>;
      })}
    </select>
    <div ref={scrollRef} style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {Array.from({ length: endMonth - startMonth + 1 }, (_, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h2>{`${new Date(year, startMonth + index, 1).toLocaleString('en-US', { month: 'long' })} ${year}`}</h2>
          {renderMonth(startMonth + index, year, handleOpenModal)}
        </div>
      ))}
      <EventModal
        isOpen={selectedDate !== null}
        onClose={handleCloseModal}
        date={selectedDate}
        events={events}
        addEvent={addEvent}
        deleteEvent={handleDeleteEvent}
      />
    </div>
  </div>
  );
};

export default Calendar;
