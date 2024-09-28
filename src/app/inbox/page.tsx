'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Inbox() {
  const [conversations, setConversations] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch the user's conversations
  const fetchConversations = async () => {
    if (status === 'authenticated' && session?.user?.id) {
      try {
        const res = await fetch('/api/conversations');
        const data = await res.json();
        setConversations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        setConversations([]);
      }
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversations();
    }
  }, [status, session]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Inbox</h1>
      {conversations.length === 0 ? (
        <p>No conversations yet. Start a new conversation!</p>
      ) : (
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation._id}>
              <a href={`/conversation/${conversation._id}`}>
                Conversation with {conversation.participants.filter(p => p !== session?.user?.id).join(', ')}
              </a>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => router.push('/conversation/new')}>New Conversation</button>
    </div>
  );
}
