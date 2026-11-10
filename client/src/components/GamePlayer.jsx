export default function GamePlayer({ embedUrl }) {
  return (
    <div className="game-frame">
      <iframe src={embedUrl} allowFullScreen title="Oyun Penceresi"></iframe>
    </div>
  );
}