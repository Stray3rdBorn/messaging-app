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

  return (
    <div>
      <h2>Rooms</h2>

      <form onSubmit={createRoom}>
        <input type="text" placeholder="New room name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <button type="submit">Create Room</button>
      </form>

      <form onSubmit={joinRoom}>
        <input type="text" placeholder="Room ID to join" value={joinId} onChange={(e) => setJoinId(e.target.value)} />
        <button type="submit">Join Room</button>
      </form>

      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            <span onClick={() => navigate(`/chat/${room._id}`)} style={{ cursor: 'pointer' }}>
              {room.name}
            </span>
            {' '}— ID: {room._id}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rooms;