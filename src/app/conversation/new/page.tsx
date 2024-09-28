'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NewConversation() {
  const [users, setUsers] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const startConversation = async () => {
    try {
      // Check if a conversation already exists with this participant
      const res = await fetch(`/api/conversations/check?participantId=${selectedParticipant}`);
      const data = await res.json();

      if (data.conversationId) {
        // If a conversation exists, redirect to it
        router.push(`/conversation/${data.conversationId}`);
      } else {
        // Otherwise, create a new conversation
        router.push(`/conversation/new/${selectedParticipant}`);
      }
    } catch (error) {
      console.error('Failed to check conversation:', error);
    }
  };

  return (
    <div>
      <h1>Start a New Conversation</h1>
      <label>Select a participant:</label>
      <select
        value={selectedParticipant}
        onChange={(e) => setSelectedParticipant(e.target.value)}
      >
        <option value="" disabled>Select a participant</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
      <button onClick={startConversation}>Start Conversation</button>
    </div>
  );
}
