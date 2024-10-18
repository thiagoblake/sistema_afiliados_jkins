const express = require('express');
const { getForm, submitForm } = require('../controllers/formController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/form', getForm);
router.post('/form', submitForm);

module.exports = router;
