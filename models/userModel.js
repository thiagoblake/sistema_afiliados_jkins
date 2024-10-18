const db = require('../config/db');

const User = {
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },
  findByAffiliateCode: (affiliateCode, callback) => {
    db.query('SELECT * FROM users WHERE affiliate_code = ?', [affiliateCode], callback);
  },
  create: (user, callback) => {
    const { username, cnpj_cpf, email, password, affiliate_code } = user;
    db.query(
      'INSERT INTO users (username, email, password, cnpj_cpf, affiliate_code) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, cnpj_cpf, affiliate_code],
      callback
    );
  }
};

module.exports = User;
