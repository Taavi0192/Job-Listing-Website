'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Conversation({ params }: { params: { participantId: string } }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  const sendMessage = async () => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newMessage,
        senderId: session?.user?.id,
        recipientId: params.participantId,
        conversationId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages);
      setConversationId(data.conversationId); // Set the conversation ID once it's created
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
