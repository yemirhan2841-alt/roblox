import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, Play, Eye, Share2 } from 'lucide-react';
import api from '../api';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGame();
  }, [id]);

  async function loadGame() {
    try {
      const [gRes, lRes] = await Promise.all([
        api.get(`/games/${id}`),
        api.get(`/games/${id}/like/status`),
      ]);
      setGame(gRes.data);
      setLiked(lRes.data.liked);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleLike() {
    try {
      const res = await api.post(`/games/${id}/like`);
      setLiked(res.data.liked);
    } catch (err) {
      navigate('/login');
    }
  }

  async function play() {
    try {
      const res = await api.post(`/games/${id}/play`);
      navigate(`/play/${id}?embed=${encodeURIComponent(res.data.embed_url)}`);
    } catch (err) {
      navigate('/login');
    }
  }

  if (loading) return <div className="page container"><div className="empty"><div className="spinner" style={{ margin: '0 auto' }}></div></div></div>;
  if (!game) return <div className="page container"><div className="empty">Oyun bulunamadı.</div></div>;

  return (
    <div className="page container">
      <Link to="/" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
        ← Geri
      </Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 30 }}>
        <div>
          <img src={game.thumbnail_url} alt={game.title} style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '16px 0 8px' }}>{game.title}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>{game.description}</p>
          <div className="player-meta" style={{ marginBottom: 16 }}>
            <span><Eye size={14} /> {game.plays?.toLocaleString?.() || game.plays} oynamış</span>
            <span>{game.category}</span>
            <span>Yazar: {game.creator_name || 'Bilinmiyor'}</span>
          </div>
        </div>
        <div className="sidebar">
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <button className="btn btn-block" onClick={play} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Play size={18} /> Oyna
            </button>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button className={`btn ${liked ? 'btn-accent' : 'btn-outline'}`} onClick={toggleLike} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ThumbsUp size={16} /> Beğen ({game.likes?.toLocaleString?.() || game.likes})
              </button>
              <button className="btn btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Share2 size={16} /> Paylaş
              </button>
            </div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>Özellikler</div>
            <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.8 }}>
              • Maksimum oyuncu: {game.max_players}<br />
              • Kategori: {game.category}<br />
              • Tarayıcıda oynanır
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}