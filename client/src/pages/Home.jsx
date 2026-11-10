import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import api from '../api';

export default function Home() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedCategory, search]);

  async function loadData() {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;
      const [gamesRes, catsRes] = await Promise.all([
        api.get('/games', { params }),
        api.get('/games/categories'),
      ]);
      setGames(gamesRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page container">
      <nav className="navbar" style={{ position: 'static', marginBottom: 20 }}>
        <div className="inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>            <div className="logo-dot"></div>
            <span style={{ fontWeight: 800, fontSize: 18 }}>Oyunlar</span>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(search); }} className="nav-links" style={{ gap: 8, flex: 1, maxWidth: 500 }}>
            <input
              className="btn btn-outline"
              style={{ flex: 1, textAlign: 'left', justifyContent: 'flex-start', padding: '8px 12px', fontWeight: 'normal' }}
              placeholder="Oyun ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
      </nav>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          className={`btn ${!selectedCategory ? 'btn-accent' : 'btn-outline'}`}
          onClick={() => setSelectedCategory('')}
        >
          Hepsi
        </button>
        {categories.map((c) => (
          <button
            key={c.category}
            className={`btn ${selectedCategory === c.category ? 'btn-accent' : 'btn-outline'}`}
            onClick={() => setSelectedCategory(c.category)}
          >
            {c.category} ({c.count})
          </button>
        ))}
      </div>

      <h2 className="section-title">Popüler Oyunlar</h2>
      {loading ? (
        <div className="empty"><div className="spinner" style={{ margin: '0 auto' }}></div></div>
      ) : games.length === 0 ? (
        <div className="empty">Oyun bulunamadı.</div>
      ) : (
        <div className="grid">
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}