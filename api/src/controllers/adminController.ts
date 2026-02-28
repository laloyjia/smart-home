import { Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../lib/logger.js';

// 1. Estadísticas Globales (Usuarios, Dispositivos, Logs y Casas)
export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const [userCount, logCount, deviceCount, homeCount] = await Promise.all([
      prisma.user.count(),
      prisma.auditLog.count(),
      prisma.device.count(),
      prisma.home.count()
    ]);
    
    res.json({
      totalUsers: userCount,
      totalDevices: deviceCount, 
      totalLogs: logCount,
      totalHomes: homeCount,
      serverStatus: 'Online',
      uptime: Math.floor(process.uptime())
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al sincronizar estadísticas' });
  }
};

// 2. Gestión de Usuarios: Crear
export const createUserByAdmin = async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;
  const admin = req.user!;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, password: hashedPassword, role: role || 'USER' }
      });

      await logActivity(admin.userId, admin.name || 'Admin', 'CREATE_USER', newUser.id, `Registró al usuario: ${email}`);
      return newUser;
    });

    res.status(201).json({ message: 'Usuario creado exitosamente', user: result });
  } catch (error: any) {
    const message = error.code === 'P2002' ? 'El correo ya está registrado' : 'Error al crear el usuario';
    res.status(400).json({ error: message });
  }
};

// 3. Gestión de Usuarios: Obtener todos
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true, 
        createdAt: true,
        _count: { select: { homes: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Fallo al recuperar lista de usuarios' });
  }
};

// 4. Gestión de Usuarios: Actualizar
export const updateUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  const admin = req.user!;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { 
        name: name?.trim(), 
        email: email?.toLowerCase().trim(), 
        role 
      }
    });

    await logActivity(admin.userId, admin.name || 'Admin', 'UPDATE_USER', Number(id), `Modificó perfil de ${email}`);

    res.json({ message: 'Datos actualizados', updatedUser });
  } catch (error) {
    res.status(400).json({ error: 'Usuario no encontrado o datos inválidos' });
  }
};

// 5. Gestión de Usuarios: Eliminar (Cascada manual)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const admin = req.user!;
  const targetId = Number(id);

  try {
    const targetUser = await prisma.user.findUnique({ where: { id: targetId } });
    if (!targetUser) return res.status(404).json({ error: 'El usuario ya no existe' });

    await prisma.$transaction([
      prisma.home.deleteMany({ where: { userId: targetId } }),
      prisma.auditLog.deleteMany({ where: { adminId: targetId } }),
      prisma.user.delete({ where: { id: targetId } })
    ]);

    await logActivity(admin.userId, admin.name || 'Admin', 'DELETE_USER', targetId, `Eliminó permanentemente a ${targetUser.email}`);

    res.json({ message: 'Usuario y todos sus datos asociados eliminados' });
  } catch (error) {
    res.status(400).json({ error: 'Error de integridad al eliminar' });
  }
};

// 6. Auditoría: Obtener Logs
export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo cargar el historial' });
  }
};

// 7. Infraestructura: Crear Casa
export const createHome = async (req: AuthRequest, res: Response) => {
  const { userId, name, address } = req.body;
  const admin = req.user!;

  try {
    const newHome = await prisma.home.create({
      data: { name, address, userId: Number(userId) }
    });

    await logActivity(admin.userId, admin.name || 'Admin', 'CREATE_HOME', newHome.id, `Creó propiedad "${name}" para usuario ID: ${userId}`);
    res.status(201).json(newHome);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la propiedad' });
  }
};

// 8. Infraestructura: Crear Estancia (Habitación)
export const createRoom = async (req: AuthRequest, res: Response) => {
  const { homeId, name, type } = req.body;
  const admin = req.user!;

  try {
    const newRoom = await prisma.room.create({
      data: { name, type: type || 'OTHER', homeId: Number(homeId) }
    });

    await logActivity(admin.userId, admin.name || 'Admin', 'CREATE_ROOM', newRoom.id, `Añadió estancia "${name}" a casa ID: ${homeId}`);
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la estancia' });
  }
};

// 9. Infraestructura: Obtener Mapa de Propiedades (CORREGIDO CON INCLUDE ANIDADO)
export const getAllProperties = async (req: AuthRequest, res: Response) => {
  try {
    const homes = await prisma.home.findMany({
      include: {
        user: { select: { name: true, email: true } },
        rooms: {
          include: { 
            devices: true, // <--- ESTO TRAE LOS DISPOSITIVOS DE CADA HABITACIÓN
            _count: { select: { devices: true } } 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(homes);
  } catch (error) {
    console.error("Error en getAllProperties:", error);
    res.status(500).json({ error: 'Error al obtener mapa de propiedades' });
  }
};

// 10. Dispositivos: Crear/Vincular a Estancia
export const createDevice = async (req: AuthRequest, res: Response) => {
  const { roomId, name, type } = req.body;
  const admin = req.user!;

  try {
    const newDevice = await prisma.device.create({
      data: {
        name,
        type: type || 'LIGHT',
        roomId: Number(roomId),
        status: false
      }
    });

    await logActivity(admin.userId, admin.name || 'Admin', 'CREATE_DEVICE', newDevice.id, `Instaló "${name}" en estancia ID: ${roomId}`);
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar el dispositivo' });
  }
};

// 11. Dispositivos: Listado Global con Ubicación
export const getAllDevices = async (req: AuthRequest, res: Response) => {
  try {
    const devices = await prisma.device.findMany({
      include: {
        room: {
          include: {
            home: {
              include: { user: { select: { name: true } } }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar dispositivos' });
  }
};

// 12. Dispositivos: Control ON/OFF (Toggle)
export const toggleDeviceStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const admin = req.user!;

  try {
    const device = await prisma.device.findUnique({ where: { id: Number(id) } });
    if (!device) return res.status(404).json({ error: 'Dispositivo no hallado' });

    const updated = await prisma.device.update({
      where: { id: Number(id) },
      data: { status: !device.status }
    });

    await logActivity(admin.userId, admin.name || 'Admin', 'TOGGLE_DEVICE', updated.id, `Cambió ${updated.name} a ${updated.status ? 'ON' : 'OFF'}`);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Error al conmutar estado' });
  }
};