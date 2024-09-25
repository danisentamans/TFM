const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const { auth } = require('./middleware/auth');
const cors = require('cors');
const path = require('path');
const paypalRoutes = require('./routes/paypalRoutes');

dotenv.config();

const app = express();

// Configuramos CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Middlewares
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', auth, userRoutes); 
app.use('/api/orders', auth, orderRoutes); 
app.use('/api/news', newsRoutes);

app.use('/api/paypal', paypalRoutes);

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
