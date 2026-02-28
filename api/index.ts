import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

// Corregido: Se añade '/backend' porque según tu árbol de carpetas, 
// 'src' está dentro de 'backend'
import authRoutes from './src/routes/authRoutes';
import userRoutes from './src/routes/userRoutes';
import adminRoutes from './src/routes/adminRoutes';
const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://smart-home-nine-gamma.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    // Permite cualquier subdominio de Vercel para evitar errores en Previews
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- RUTAS DE LA API ---
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// --- TEST DE SALUD ---
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ 
    status: "online",
    message: "Core Systems Operational - Path Fixed",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// --- LANZAMIENTO (Solo para local) ---
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server: http://localhost:${PORT}`);
  });
}

export default app;