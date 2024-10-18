require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const generateAffiliateCode = require('../utils/generateCode');

const register = (req, res) => {
  const { username, email, password, cnpj_cpf,  } = req.body;

  User.findByEmail(email, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao verificar o email do usuário.', error: err });
    }

    if (result && result.length) {
      return res.status(400).json({ message: 'Usuário já registrado.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const affiliateCode = generateAffiliateCode();

    User.create({ username, email, password: hashedPassword, cnpj_cpf, affiliate_code: affiliateCode }, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar o usuário.', error: err });
      }

      res.status(201).json({ message: 'Usuário registrado com sucesso!', affiliateCode });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao verificar o usuário.', error: err });
    }

    if (!result || !result.length) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = result[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Senha inválida!' });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: 86400 });

    res.status(200).json({ message: 'Login bem-sucedido!', token, affiliateCode: user.affiliate_code });
  });
};

module.exports = { register, login };
