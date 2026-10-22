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
    const res = await axios.get('/api/rooms', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRooms(res.data);
  };

  const createRoom = async (e) => {
    e.preventDefault();
    await axios.post(
      '/api/rooms',
      { name: roomName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRoomName('');
    fetchRooms();
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    await axios.post(
      `/api/rooms/${joinId}/join`,
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
     <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg.jpg')" }}/>
      <div className="absolute inset-0 bg-white/20" />  
      <div className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-sm md:max-w-md md:max-w-xl">
        <div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-orange-400">Campground</h2>
  <button onClick={logout} className="text-m font-semibold text-red-500 hover:underline">
    Logout
  </button>
</div>

        <form onSubmit={createRoom} className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Name your new campsite..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="flex-1 border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button type="submit" className="bg-orange-500 text-white rounded px-4 py-2 hover:bg-orange-600 transition">
            Light It
          </button>
        </form>

        <form onSubmit={joinRoom} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter a campsite code..."
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            className="flex-1 border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button type="submit" className="bg-gray-600 text-white rounded px-4 py-2 hover:bg-gray-700 transition">
            Hop In
          </button>
        </form>

        <ul className="bg-white rounded-lg shadow divide-y">
          {rooms.map((room) => (
            <li key={room._id} className="p-3 flex justify-between items-center">
              <span
                onClick={() => navigate(`/chat/${room._id}`)}
                className="cursor-pointer font-medium text-gray-800 hover:text-orange-500"
              >
                {room.name}
              </span>
              <span className="text-[10px] text-gray-500">Code: {room._id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Rooms;