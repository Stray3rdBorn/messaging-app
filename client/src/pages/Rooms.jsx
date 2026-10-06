import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [joinId, setJoinId] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await axios.get('http://localhost:5000/api/rooms', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRooms(res.data);
  };

  const createRoom = async (e) => {
    e.preventDefault();
    await axios.post(
      'http://localhost:5000/api/rooms',
      { name: roomName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRoomName('');
    fetchRooms();
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    await axios.post(
      `http://localhost:5000/api/rooms/${joinId}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setJoinId('');
    fetchRooms();
  };

  const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  navigate('/login');
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-semibold text-gray-800">ROOMS</h2>
  <button onClick={logout} className="text-sm font-semibold text-red-500 hover:underline">
    Logout
  </button>
</div>

        <form onSubmit={createRoom} className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="New room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition">
            Create
          </button>
        </form>

        <form onSubmit={joinRoom} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Room ID to join"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="bg-gray-700 text-white rounded px-4 py-2 hover:bg-gray-800 transition">
            Join
          </button>
        </form>

        <ul className="bg-white rounded-lg shadow divide-y">
          {rooms.map((room) => (
            <li key={room._id} className="p-3 flex justify-between items-center">
              <span
                onClick={() => navigate(`/chat/${room._id}`)}
                className="cursor-pointer font-medium text-gray-800 hover:text-blue-500"
              >
                {room.name}
              </span>
              <span className="text-xs text-gray-400">{room._id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Rooms;