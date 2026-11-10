import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState({ to_id: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    loadFriends();
    loadMessages();
  }, []);

  async function loadFriends() {
    try {
      const res = await api.get('/users/friends');
      setFriends(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadMessages() {
    try {
      const res = await api.get('/users/messages');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    try {
      await api.post('/users/messages', newMsg);
      setNewMsg({ to_id: '', text: '' });
      loadMessages();
    } catch (err) {
      alert('Mesaj gönderilemedi');
    }
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="page container">
      <h2 className="section-title">Profil</h2>
      <div className="profile-header">
        <img src={user.avatar_url} alt="avatar" className="avatar" />
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{user.username}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user.email}</div>
        </div>
      </div>
      <div className="profile-stats">
        <div>Robux <b>{user.robux?.toLocaleString?.() || user.robux}</b></div>
        <div>Arkadaş <b>{friends.length}</b></div>
      </div>

      <div style={{ marginTop: 30, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>Mesajlaşma</div>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
          <input
            value={newMsg.to_id}
            onChange={(e) => setNewMsg({ ...newMsg, to_id: e.target.value })}
            placeholder="Alıcı kullanıcı adı/ID"
            style={{ flex: 1 }}
          />
          <input
            value={newMsg.text}
            onChange={(e) => setNewMsg({ ...newMsg, text: e.target.value })}
            placeholder="Mesaj..."
            style={{ flex: 2 }}
          />
          <button className="btn btn-accent" type="submit">Gönder</button>
        </form>
        <div style={{ marginTop: 12, maxHeight: 200, overflowY: 'auto' }}>
          {messages.map((m) => (
            <div key={m.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{m.from_username}</span>: {m.text}
            </div>
          ))}
          {messages.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Henüz mesaj yok.</div>}
        </div>
      </div>

      <div style={{ marginTop: 20, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>Arkadaşlarınız</div>
        {friends.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Henüz arkadaş yok.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {friends.map((f) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <img src={f.avatar_url} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)' }} />
                <span style={{ fontSize: 14 }}>{f.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}