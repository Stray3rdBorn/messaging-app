import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io();

function Chat() {
  const { roomId } = useParams();
  const navigate = useNavigate();
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
    const res = await axios.get(`/api/messages/${roomId}`, {
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
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg2.png')" }}/>
      <div className="absolute inset-0 bg-white/20" />  
      <div className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-md md:max-w-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-xl font-bold text-orange-400">Campsite</h2>
          <button onClick={() => navigate('/rooms')} className="text-semibold text-orange-500 hover:underline">
            Back
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                msg.sender === userId
                  ? 'bg-orange-500 text-white ml-auto'
                  : 'bg-gray-300 text-gray-900'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 border-t p-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pass a note..."
            className="flex-1 border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button type="submit" className="bg-orange-500 text-white rounded px-4 py-2 hover:bg-orange-600 transition">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;