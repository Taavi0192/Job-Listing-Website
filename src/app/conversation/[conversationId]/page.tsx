'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Conversation({ params }: { params: { conversationId: string } }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  // Function to fetch messages from the server
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/conversations/${params.conversationId}/messages`);
      const data = await res.json();
      setMessages(data); // Update messages state with the fetched messages
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // Fetch messages on component mount and poll every 5 seconds
  useEffect(() => {
    fetchMessages(); // Initial fetch when component mounts

    const interval = setInterval(() => {
      fetchMessages(); // Polling every 1 seconds
    }, 1000); // Adjust interval time as needed

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [params.conversationId]);

  const sendMessage = async () => {
    const res = await fetch(`/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newMessage,
        senderId: session?.user?.id,
        conversationId: params.conversationId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages);
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Conversation</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.senderId === session?.user?.id ? 'right' : 'left' }}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div style={{ position: 'fixed', bottom: '0', width: '100%', display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: '1', padding: '10px' }}
        />
        <button onClick={sendMessage} style={{ padding: '10px' }}>Send</button>
      </div>
    </div>
  );
}
