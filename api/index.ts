import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(cors()); // Permite la comunicación con el Frontend (Vite)
app.use(express.json()); // Permite recibir JSON en los cuerpos de las peticiones

// --- RUTAS DE LA API ---
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// --- TEST DE SALUD DEL SISTEMA ---
app.get('/test', (req, res) => {
  res.json({ 
    status: "online",
    message: "Core Systems Operational",
    timestamp: new Date().toISOString()
  });
});

// --- LANZAMIENTO ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════╗
  ║  ⚡ SMARTPRO BACKEND - OPERATIONAL             ║
  ║  🚀 URL: http://localhost:${PORT}               ║
  ╚════════════════════════════════════════════════╝
  `);
});