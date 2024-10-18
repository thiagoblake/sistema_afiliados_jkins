const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const leadController = require('./controllers/leadController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api', formRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.post('/api/lead', leadController.registrarLead);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

