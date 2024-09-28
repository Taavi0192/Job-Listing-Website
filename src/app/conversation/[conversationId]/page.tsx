'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Conversation({ params }: { params: { conversationId: string } }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
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
    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('senderId', session?.user?.id || '');
    formData.append('conversationId', params.conversationId);
    if (file) {
      formData.append('file', file); // Append the selected file
    }

    const res = await fetch(`/api/messages`, {
      method: 'POST',
      body: formData, // Send the form data, including the file
    });

    if (res.ok) {
      setNewMessage(''); // Clear the input field after sending the message
      setFile(null); // Clear the file input
      fetchMessages(); // Fetch messages again after sending
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div>
      <h1>Conversation</h1>
      <div>
        {messages.map((message, index) => (
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
      <div style={{ position: 'fixed', bottom: '0', width: '100%', display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: '1', padding: '10px' }}
        />
        <input type="file" onChange={handleFileChange} style={{ padding: '10px' }} /> {/* File input */}
        <button onClick={sendMessage} style={{ padding: '10px' }}>Send</button>
      </div>
    </div>
  );
}
