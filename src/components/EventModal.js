import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

const EventModal = ({ isOpen, onClose, date, events, addEvent, deleteEvent }) => {
  const [eventName, setEventName] = useState('');
  const [storedEvents, setStoredEvents] = useState(events); // Initialize with the initial events or an empty array

  useEffect(() => {
    // Load events from local storage when the component mounts
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    if (storedEvents.length > 0) {
      setStoredEvents(storedEvents);
    }
  }, []);

  const handleAddEvent = () => {
    // Update events in state and local storage
    const newEvent = { date, eventName };
    const updatedEvents = [...storedEvents, newEvent];
    setStoredEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    setEventName('');
  };

  const handleDeleteEvent = (event) => {
    // Update events in state and local storage
    const updatedEvents = storedEvents.filter((e) => e !== event);
    setStoredEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  return (
    <div className='modal' style={{ display: isOpen ? 'block' : 'none', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <div>
        <h3>{date ? date.toLocaleDateString() : ''}</h3>
        <div style={{ display: "flex" }}>
          <TextField
            id="outlined-basic"
            value={eventName}
            label="Event Name"
            variant="outlined"
            onChange={(e) => setEventName(e.target.value)}
            InputProps={{
              style: { color: 'white', borderColor: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
            className="custom-text-field" // Add a custom class name
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button style={{ margin: "0 0 0 2rem" }} size='large' variant="contained" onClick={handleAddEvent}>Add Event</Button>
            <Button style={{ margin: "0 0 0 2rem" }} size='large' onClick={onClose} variant="contained" color='error'>Close</Button>
          </div>
        </div>
      </div>
      <div>
        <h4>Events on this day:</h4>
        <ol type="1">
        {date &&
  storedEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    })
    .map((event, index) => (
      <li key={index}>
        <span style={{ marginRight: '1rem' }}>{index + 1}.</span>
        {event.eventName}
        <DeleteIcon style={{ color: "red", marginLeft: "1rem", cursor: "pointer" }} onClick={() => handleDeleteEvent(event)} />
      </li>
    ))}
        </ol>
      </div>
    </div>
  );
};

export default EventModal;
