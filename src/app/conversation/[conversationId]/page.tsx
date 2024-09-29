'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Conversation({ params }: { params: { conversationId: string } }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [filteredMessages, setFilteredMessages] = useState([]); // Filtered messages based on search
  const [scheduleDate, setScheduleDate] = useState(''); // Date-time for scheduling message
  const { data: session } = useSession();
  const router = useRouter();

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
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [params.conversationId]);

  // Search function: filters messages based on the search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = messages.filter((message) =>
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages); // Show all messages when search term is cleared
    }
  }, [searchTerm, messages]);

  const sendMessage = async () => {
    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('senderId', session?.user?.id || '');
    formData.append('conversationId', params.conversationId);
    if (file) {
      formData.append('file', file);
    }
    formData.append('scheduleDate', scheduleDate); // Append the scheduled date

    const res = await fetch(`/api/messages`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setNewMessage('');
      setFile(null);
      fetchMessages(); // Fetch messages again after sending
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div>
      <h1>Conversation</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search messages..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
      />

      {/* Display filtered messages */}
      <div>
        {filteredMessages.map((message, index) => (
          <div key={index} style={{ textAlign: message.senderId === session?.user?.id ? 'right' : 'left' }}>
            <p>{message.content}</p>
            {message.fileId && (
              <a href={`/api/files/${message.fileId}`} target="_blank" rel="noopener noreferrer">
                View File
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Schedule date picker */}
      <input
        type="datetime-local"
        value={scheduleDate}
        onChange={(e) => setScheduleDate(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
      />

      <div style={{ position: 'fixed', bottom: '0', width: '100%', display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: '1', padding: '10px' }}
        />
        <input type="file" onChange={handleFileChange} style={{ padding: '10px' }} />
        <button onClick={sendMessage} style={{ padding: '10px' }}>Send</button>
      </div>
    </div>
  );
}
