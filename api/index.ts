import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes';
import userRoutes from './src/routes/userRoutes';
import adminRoutes from './src/routes/adminRoutes';

const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(cors({
  origin: "https://smart-home-nine-gamma.vercel.app", // Tu URL de producción
  credentials: true
}));
app.use(express.json());

// --- RUTAS DE LA API ---
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// --- TEST DE SALUD DEL SISTEMA ---
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ 
    status: "online",
    message: "Core Systems Operational",
    timestamp: new Date().toISOString()
  });
});

// --- LANZAMIENTO (Solo para local) ---
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server: http://localhost:${PORT}`);
  });
}

// --- EXPORTACIÓN PARA VERCEL ---
export default app;