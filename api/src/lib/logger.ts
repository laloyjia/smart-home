import prisma from './prisma.js';

export const logActivity = async (
  adminId: number, 
  adminName: string, 
  action: string, 
  targetId?: number, 
  details?: string
) => {
  try {
    await prisma.auditLog.create({
      data: {
        adminId,
        adminName,
        action,
        targetId,
        details
      }
    });
  } catch (error) {
    console.error("❌ Error guardando log:", error);
  }
};