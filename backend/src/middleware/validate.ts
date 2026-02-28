import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Definimos qué datos son válidos para un usuario
export const userSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("El formato del correo es inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(['ADMIN', 'USER']).default('USER'),
});

// El middleware que intercepta la petición
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    userSchema.parse(req.body); // Intenta validar
    next(); // Si está bien, pasa al controlador
  } catch (error: any) {
    // Si hay error, devuelve qué falló específicamente
    return res.status(400).json({ 
      error: "Datos inválidos", 
      details: error.errors.map((e: any) => e.message) 
    });
  }
};