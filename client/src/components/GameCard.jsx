import { Link, useNavigate } from 'react-router-dom';
import { Play, ThumbsUp, Eye } from 'lucide-react';

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/game/${game.id}`);

  return (
    <div className="card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="card-thumb">
        <img src={game.thumbnail_url} alt={game.title} loading="lazy" />
        <div className="card-play">
          <Play size={18} /> Oyna
        </div>
      </div>
      <div className="card-body">
        <div className="card-title">{game.title}</div>
        <div className="card-meta">
          <span>{game.category}</span>
          <Eye size={12} /> {game.plays?.toLocaleString?.() || game.plays}
        </div>
      </div>
      <div className="card-footer">
        <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); navigate(`/game/${game.id}`); }}>
          <ThumbsUp size={14} /> {game.likes?.toLocaleString?.() || game.likes}
        </button>
      </div>
    </div>
  );
}