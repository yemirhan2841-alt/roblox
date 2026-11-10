import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Search, Gamepad2, Users, Settings } from 'lucide-react';
import api from '../api';

export default function Navbar({ user, setUser, onLogin }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="navbar">
      <div className="container inner">
        <Link to="/" className="logo" onClick={() => navigate('/')}>
          <div className="logo-dot"></div>
          ROBLOX<span style={{ color: '#ff0055' }}>.PLATFORM</span>
        </Link>

        <div className="nav-links">
          <Link to="/" onClick={() => navigate('/')}>
            <Gamepad2 size={16} /> Keşfet
          </Link>
          <Link to="/search" onClick={() => navigate('/search')}>
            <Search size={16} /> Ara
          </Link>
          <Link to="/profile" onClick={() => navigate('/profile')}>
            <Users size={16} /> Arkadaşlar
          </Link>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <button className="btn btn-outline" onClick={handleLogout}>
                <LogOut size={16} /> Çıkış
              </button>
            </>
          ) : (
            <button className="btn btn-accent" onClick={onLogin}>
              Giriş Yap
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}