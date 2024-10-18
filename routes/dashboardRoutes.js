const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

// Rota para registrar o clique
router.post('/registerClick', (req, res) => {
  const { ref } = req.query;

  // Encontrar o usuário pelo código de afiliado
  db.query('SELECT id, username FROM users WHERE affiliate_code = ?', [ref], (err, result) => {
    if (err || !result.length) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const userId = result[0].id;
    const username = result[0].username;

    // Registrar o clique no banco de dados
    db.query('INSERT INTO clicks (user_id, clicked_at) VALUES (?, NOW())', [userId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar o clique.' });
      }

      // Retornar o nome do usuário
      res.status(200).json({ message: 'Clique registrado com sucesso.', username });
    });
  });
});


// Rota para buscar os dados do dashboard
router.get('/', verifyToken, (req, res) => {
  const { startDate, endDate } = req.query;
  const userId = req.userId;

  // Consulta para obter o número de cliques do usuário com base nas datas
  let query = 'SELECT COUNT(*) AS totalClicks FROM clicks WHERE user_id = ?';
  const params = [userId];

  if (startDate && endDate) {
    query += ' AND clicked_at BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar dados.', error: err });
    }

    res.status(200).json({ totalClicks: result[0].totalClicks });
  });
});

module.exports = router;
