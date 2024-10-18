const User = require('../models/userModel');

const getForm = (req, res) => {
  const { ref } = req.query;

  User.findByAffiliateCode(ref, (err, result) => {
    if (!result.length) {
      return res.status(404).json({ message: 'Código de afiliado não encontrado.' });
    }

    const user = result[0];
    res.status(200).json({ message: `Olá, você foi indicado por: ${user.username}` });
  });
};

const submitForm = (req, res) => {
  const { name, email, ref } = req.body;

  // Lógica para enviar os dados para o ERP

  res.status(200).json({ message: 'Formulário enviado com sucesso!' });
};

module.exports = { getForm, submitForm };
