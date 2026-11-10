import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import GamePlayer from '../components/GamePlayer';

export default function Play() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [embedUrl, setEmbedUrl] = useState('/games/obby.html');

  useEffect(() => {
    const url = searchParams.get('embed') || '/games/obby.html';
    setEmbedUrl(url);
  }, [searchParams]);

  return (
    <div className="player">
      <div className="player-header">
        <Link to={`/game/${id}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontWeight: 700 }}>
          ← Oyuna Geri Dön
        </Link>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tarayıcı Oyuncu</div>
      </div>
      <GamePlayer embedUrl={embedUrl} />
    </div>
  );
}