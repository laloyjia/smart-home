import { Router } from 'express';
import { 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  getAdminStats, 
  createUserByAdmin,
  getAuditLogs 
} from '../controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { validateUser } from '../middleware/validate.js'; // Importamos el validador

const router = Router();
router.use(authenticateToken, isAdmin);

router.get('/stats', getAdminStats);
router.get('/logs', getAuditLogs);
router.get('/users', getAllUsers);

// Aplicamos validateUser antes de crear
router.post('/users', validateUser, createUserByAdmin);

// Aplicamos validateUser antes de actualizar (usamos .partial() si no envían todo)
router.put('/users/:id', validateUser, updateUser);

router.delete('/users/:id', deleteUser);

export default router;