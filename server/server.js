require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const gamesRoutes = require('./routes/games');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/users', usersRoutes);

app.use('/games', express.static(path.join(__dirname, '../client/public/games')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', games: 3000 }));

app.listen(PORT, () => {
  console.log(`Platform sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});