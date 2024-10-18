const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/', (req, res) => {
  const { ref } = req.query;

  // Encontrar o usuário pelo código de afiliado
  db.query('SELECT id FROM users WHERE affiliate_code = ?', [ref], (err, result) => {
    if (err || !result.length) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const userId = result[0].id;

    // Registrar o clique no banco de dados
    db.query('INSERT INTO clicks (user_id, clicked_at) VALUES (?, NOW())', [userId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar o clique.' });
      }

      // Redirecionar para o formulário com o código de afiliado
      res.redirect(`/form.html?ref=${ref}`);
    });
  });
});

module.exports = router;
