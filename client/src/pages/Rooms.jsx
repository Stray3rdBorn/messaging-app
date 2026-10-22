import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [joinId, setJoinId] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await axios.get("/api/rooms", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRooms(res.data);
  };

  const createRoom = async (e) => {
    e.preventDefault();
    await axios.post(
      "/api/rooms",
      { name: roomName },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setRoomName("");
    fetchRooms();
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    await axios.post(
      `/api/rooms/${joinId}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setJoinId("");
    fetchRooms();
  };

  const renameRoom = async (room) => {
    const name = window.prompt("New room name", room.name);
    if (!name || !name.trim()) return;
    await axios.put(
      `/api/rooms/${room._id}`,
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    fetchRooms();
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const deleteRoom = async (room) => {
    if (
      !window.confirm(
        `Delete "${room.name}"? All its messages will be removed.`,
      )
    )
      return;
    await axios.delete(`/api/rooms/${room._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRooms();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/20" />
      <div className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-sm md:max-w-md md:max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-400">Campground</h2>
          <button
            onClick={logout}
            className="text-m font-semibold text-red-500 hover:underline"
          >
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
          <button
            type="submit"
            className="bg-orange-500 text-white rounded px-4 py-2 hover:bg-orange-600 transition"
          >
            Create
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
          <button
            type="submit"
            className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700 transition"
          >
            Enter
          </button>
        </form>

        <ul className="bg-orange-100 rounded-lg shadow divide-y">
          {rooms.map((room) => (
            <li
              key={room._id}
              className="p-3 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span
                  onClick={() => navigate(`/chat/${room._id}`)}
                  className="cursor-pointer font-medium text-gray-800 hover:text-orange-500"
                >
                  {room.name}
                </span>
                <span
                  onClick={() => copyId(room._id)}
                  className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 flex items-center gap-1"
                  title="Click to copy"
                >
                  {room._id}
                  {copiedId === room._id ? (
                    <svg
                      className="w-3 h-3 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                {room.creator === userId && (
                  <>
                    <button
                      onClick={() => renameRoom(room)}
                      className="text-green-500 hover:text-green-700"
                      aria-label="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => deleteRoom(room)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Rooms;
