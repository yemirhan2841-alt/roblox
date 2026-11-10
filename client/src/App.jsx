import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Play from './pages/Play';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (e) {}
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/play/:id" element={<Play />} />
        <Route path="/login" element={<Login onLoginSuccess={setUser} />} />
        <Route path="/register" element={<Register onRegisterSuccess={setUser} />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}