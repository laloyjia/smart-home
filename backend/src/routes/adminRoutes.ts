import { Router } from 'express';
import { 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  getAdminStats, 
  createUserByAdmin,
  getAuditLogs,
  // INFRAESTRUCTURA
  createHome,
  createRoom,
  getAllProperties,
  // DISPOSITIVOS
  createDevice,
  getAllDevices,
  toggleDeviceStatus
} from '../controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * @security JWT Authenticate & Admin Authorization
 * Todas las rutas dentro de este router requieren un token válido
 * y permisos de administrador de nivel sistema.
 */
router.use(authenticateToken, isAdmin);

// --- SECCIÓN 1: DASHBOARD & AUDITORÍA ---
// GET /api/admin/stats -> Estadísticas generales (conteo de nodos, usuarios, etc.)
router.get('/stats', getAdminStats); 

// GET /api/admin/logs -> Historial de seguridad y eventos del servidor
router.get('/logs', getAuditLogs); 


// --- SECCIÓN 2: GESTIÓN DE USUARIOS (CLIENTES) ---
// GET /api/admin/users -> Obtener base de datos de usuarios
router.get('/users', getAllUsers);

// POST /api/admin/users -> Registrar nuevo usuario manualmente
router.post('/users', createUserByAdmin);

// PUT /api/admin/users/:id -> Actualizar credenciales o roles
router.put('/users/:id', updateUser);

// DELETE /api/admin/users/:id -> Eliminación física de usuario y dependencias
router.delete('/users/:id', deleteUser);


// --- SECCIÓN 3: INFRAESTRUCTURA (PROPIEDADES Y HABITACIONES) ---
// GET /api/admin/properties -> Mapa completo de Casas > Habitaciones > Dispositivos
router.get('/properties', getAllProperties);

/** * POST /api/admin/properties 
 * IMPORTANTE: Cambiado de '/homes' a '/properties' para sincronizar con el frontend.
 * Vincula una nueva propiedad física a un ID de usuario.
 */
router.post('/properties', createHome);

// POST /api/admin/rooms -> Añadir estancia (Living, Cocina, etc.) a una casa
router.post('/rooms', createRoom);


// --- SECCIÓN 4: CONTROL DE NODOS (DEVICES) ---
// GET /api/admin/devices -> Lista plana de todos los dispositivos en el sistema
router.get('/devices', getAllDevices);

// POST /api/admin/devices -> Registrar e instalar un nuevo dispositivo en una habitación
router.post('/devices', createDevice);

// PATCH /api/admin/devices/:id/toggle -> Accionar interruptor ON/OFF de un dispositivo
router.patch('/devices/:id/toggle', toggleDeviceStatus);

export default router;