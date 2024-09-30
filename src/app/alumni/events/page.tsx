// app/alumni/events/page.tsx
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AlumniEventScheduler() {
  const { data: session } = useSession();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('online'); // Default is online
  const [eventLink, setEventLink] = useState(''); // Only required for online events
  const [eventLocation, setEventLocation] = useState(''); // For in-person events

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      eventName,
      eventDate,
      eventType,
      eventLink: eventType === 'online' ? eventLink : '',
      eventLocation: eventType === 'in-person' ? eventLocation : '',
      alumniId: session?.user?.id,
    };

    const res = await fetch('/api/alumni/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (res.ok) {
      alert('Event scheduled successfully!');
    } else {
      alert('Error scheduling event.');
    }
  };

  return (
    <div>
      <h1>Schedule a Workshop or Networking Event</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Event Name:
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Event Date and Time:
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Event Type:
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="online">Online</option>
            <option value="in-person">In Person</option>
          </select>
        </label>
        <br />
        {eventType === 'online' && (
          <>
            <label>
              Online Event Link:
              <input
                type="url"
                value={eventLink}
                onChange={(e) => setEventLink(e.target.value)}
                required
              />
            </label>
            <br />
          </>
        )}
        {eventType === 'in-person' && (
          <>
            <label>
              Event Location:
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                required
              />
            </label>
            <br />
          </>
        )}
        <button type="submit">Schedule Event</button>
      </form>
    </div>
  );
}
