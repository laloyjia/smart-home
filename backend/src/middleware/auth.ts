import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_fallback';

// Interfaz mejorada con el campo name
export interface AuthRequest extends Request {
  user?: { 
    userId: number; 
    role: string; 
    name?: string; // Añadimos name para los logs
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    return;
  }

  try {
    // Decodificamos incluyendo el posible nombre del usuario
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string; name?: string };
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
};