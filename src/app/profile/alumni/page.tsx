// app/profile/alumni/page.tsx (part of alumni profile)
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AlumniProfile() {
  const { data: session } = useSession();
  const [successStory, setSuccessStory] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch current success story from the API (if any)
    const fetchSuccessStory = async () => {
      const res = await fetch('/api/alumni/success-story');
      const data = await res.json();
      setSuccessStory(data.successStory || '');
    };

    fetchSuccessStory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/alumni/success-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ successStory }),
    });

    if (res.ok) {
      alert('Success story updated!');
      setIsEditing(false); // Stop editing mode after success
    } else {
      alert('Error updating success story.');
    }
  };

  return (
    <div>
      <h1>Alumni Profile</h1>
      <h3>Success Story</h3>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={successStory}
            onChange={(e) => setSuccessStory(e.target.value)}
            placeholder="Share your success story..."
            required
            style={{ width: '100%', height: '100px' }}
          />
          <br />
          <button type="submit">Update Success Story</button>
          <button
            type="button"
            onClick={() => setIsEditing(false)} // Cancel editing
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>{successStory || 'No success story added yet.'}</p>
          <button onClick={() => setIsEditing(true)}>Edit Success Story</button>
        </div>
      )}
    </div>
  );
}
