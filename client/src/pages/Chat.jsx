import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchHistory();
    socket.emit('joinRoom', roomId);

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    const res = await axios.get(`http://localhost:5000/api/messages/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(res.data);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('sendMessage', { roomId, text, senderId: userId });
    setText('');
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid gray' }}>
        {messages.map((msg) => (
          <p key={msg._id}>
            <strong>{msg.sender === userId ? 'You' : msg.sender}:</strong> {msg.text}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage}>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;