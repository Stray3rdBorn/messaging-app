import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Rooms from './pages/Rooms';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/chat/:roomId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;