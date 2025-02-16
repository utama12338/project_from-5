import { Request, Response } from 'express'
import { PrismaClient, SystemInfo, EnvironmentInfo, ConnectionInfo, SecurityInfo } from '@prisma/client'

import * as z from 'zod'
const prisma = new PrismaClient()

const systemSchema = z.object({
  //  userId: z.number(),
  id: z.number(),
  systemName: z.string(),
  developType: z.enum(['OUTSOURCE', 'IN HOUSE']),
  contractNo: z.string(),
  vendorContactNo: z.string(),
  businessUnit: z.string(),


  
  developUnit: z.string(),
  computerbackup: z.string(),
  environmentInfo: z.array(z.object({
    environment: z.string(),
    serverName: z.string(),
    ip: z.string(),
    serverType: z.string(),
    serverRole: z.string(),
    serverDuty: z.string(),
    database: z.string(),
    application: z.string(),
    operatingSystem: z.string(),
    servicePack: z.string(),
    build: z.string(),
    cpu: z.string(),
    ram: z.string(),
    disk: z.string(),
    dr: z.string(),
    znDomain: z.string(),
    windowsCluster: z.string(),
    productionUnit: z.array(z.string()),
  })),
  connectionInfo: z.array(z.object({
    ad: z.string(),
    adfs: z.string(),
    dns: z.string(),
    ntp: z.string(),
    tpam: z.string(),
    netka: z.string(),
    fim: z.string(),
    ftpServer: z.string(),
    ftpGoAnywhereMFTServer: z.string(),
    emailSmtp: z.string(),
    sms: z.string(),
    apiManagement: z.string(),
    dv: z.string(),
    snmp: z.string(),
  })),
  securityInfo: z.array(z.object({
    urlWebsite: z.string().url(),
    certificateExpireDate: z.string().datetime(),
    backupPolicy: z.string(),
    downtimeAllowed: z.string(),
    centralizeLog: z.string(),
    setupAgentPatch: z.string(),
    internetFacing: z.string(),
  })),
});
// Create system (เดิมคือ createforme)
const createfrome = async (req: Request, res: Response)  => {
  const systemInput = req.body;
  
  const validationResult = systemSchema.safeParse(systemInput);
  if (!validationResult.success) {
    res.status(400).json({
      errors: validationResult.error.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message
      }))
    });
    return;
  }

  try {
    const system = await prisma.systemInfo.create({
      data: {
        userId: systemInput.userId,
        systemName: systemInput.systemName,
        developType: systemInput.developType,
        contractNo: systemInput.contractNo,
        vendorContactNo: systemInput.vendorContactNo,
        businessUnit: systemInput.businessUnit,
        developUnit: systemInput.developUnit,
        computerbackup: systemInput.computerbackup,
        environmentInfo: {
          create: systemInput.environmentInfo,
        },
        connectionInfo: {
          create: systemInput.connectionInfo,
        },
        securityInfo: {
          create: systemInput.securityInfo,
        },
      },
      include: {
        environmentInfo: true,
        connectionInfo: true,
        securityInfo: true,
      }
    });

    res.status(201).json(system);
  } catch (error) {
    console.error('Error creating system:', error);
    res.status(500).json({ error: 'Failed to create system' });
  }
};
// Modified update function using Prisma's generated types
const updateforme = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

 

  try {
    // Validate update data
    const validationResult = systemSchema.safeParse(updateData);
    if (!validationResult.success) {
      res.status(400).json({
        errors: validationResult.error.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message
        }))
      });
      return ;
    }

    const now = new Date();

    // Update main system info with new timestamp
    const updatedSystem = await prisma.systemInfo.update({
      where: {
         id: parseInt(id) 
      },
      data: {
        systemName: updateData.systemName,
        developType: updateData.developType,
        contractNo: updateData.contractNo,
        vendorContactNo: updateData.vendorContactNo,
        businessUnit: updateData.businessUnit,
        developUnit: updateData.developUnit,
        computerbackup: updateData.computerbackup,
        updatedAt: now,
        environmentInfo: {
          deleteMany: {}, // First delete existing records
          create: updateData.environmentInfo.map((env: Partial<EnvironmentInfo>) => ({
            ...env,
            id: undefined, // Remove id for new creation
            systemInfoId: undefined, // Remove systemInfoId
            // createdAt: now,
            updatedAt: now
          }))
        },
        connectionInfo: {
          deleteMany: {},
          create: updateData.connectionInfo.map((conn: Partial<ConnectionInfo>) => ({
            ...conn,
            id: undefined,
            systemInfoId: undefined,
            // createdAt: now,
            updatedAt: now
          }))
        },
        securityInfo: {
          deleteMany: {},
          create: updateData.securityInfo.map((sec: Partial<SecurityInfo>) => ({
            ...sec,
            id: undefined,
            systemInfoId: undefined,
            // createdAt: now,
            updatedAt: now
          }))
        }
      },
      include: {
        environmentInfo: true,
        connectionInfo: true,
        securityInfo: true
      }
    });

    res.json(updatedSystem);
  } catch (error) {
    console.error('Error updating system:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล' });
  }
};
// Get all systems (เดิมคือ getforme)
const getforme = async (req: Request, res: Response) => {
  try {
    const systems = await prisma.systemInfo.findMany({
      include: {
        environmentInfo: true,
        connectionInfo: true,
        securityInfo: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(systems);
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
};
// Get system by ID
const getSystemById = async (req: Request, res: Response)=> {
  try {
    const { id } = req.params;
    const system = await prisma.systemInfo.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        environmentInfo: true,
        connectionInfo: true,
        securityInfo: true
      }
    });

    if (!system) {
      res.status(404).json({ error: 'ไม่พบข้อมูลระบบที่ต้องการ' });
      return ;
    }

    res.json(system);
  } catch (error) {
    console.error('Error fetching system:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
};
// Delete system
const deletefrome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.systemInfo.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.json({ message: 'ลบข้อมูลระบบเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error deleting system:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
};
// Check existing system
const checkExistingSystem = async (req: Request, res: Response) => {
  try {
    const { systemName } = req.query;
    
    const existingSystem = await prisma.systemInfo.findFirst({
      where: {
        systemName: systemName as string
      }
    });

    res.json(existingSystem);
  } catch (error) {
    console.error('Error checking system:', error);
    res.status(500).json({ error: 'Failed to check system' });
  }
};
const searchSystems = async (req: Request, res: Response) => {
  try {
    const { 
      systemName, 
      serverName, 
      environment, 
      ip, 
      developType, 
      businessUnit 
    } = req.query;

    // const systems = await prisma.systemInfo.findMany({
    //   where: {
    //     AND: [
    //       systemName ? {
    //         systemName: { contains: systemName as string, mode: 'insensitive' }
    //       } : {},
    //       developType ? { developType: developType as string } : {},
    //       businessUnit ? {
    //         businessUnit: { contains: businessUnit as string, mode: 'insensitive' }
    //       } : {},
    //       environment && serverName && ip ? {
    //         environmentInfo: {
    //           some: {
    //             AND: [
    //               environment ? { environment: environment as string } : {},
    //               serverName ? {
    //                 serverName: { contains: serverName as string, mode: 'insensitive' }
    //               } : {},
    //               ip ? { ip: { contains: ip as string } } : {},
    //             ]
    //           }
    //         }
    //       } : {}
    //     ]
    //   },
    //   include: {
    //     environmentInfo: true,
    //     connectionInfo: true,
    //     securityInfo: true,
    //   }
    // });

    // const systems = await prisma.systemInfo.findMany({
    //   where: {
    //     AND: [
    //       systemName ? { systemName: { equals: systemName as string } } : {},
    //       developType ? { developType: { equals: developType as string } } : {},
    //       businessUnit ? { businessUnit: { equals: businessUnit as string } } : {},
    //       environment && serverName && ip ? {
    //         environmentInfo: {
    //           some: {
    //             AND: [
    //               environment ? { environment: { equals: environment as string } } : {},
    //               serverName ? { serverName: { equals: serverName as string } } : {},
    //               ip ? { ip: { equals: ip as string } } : {},
    //             ]
    //           }
    //         }
    //       } : {}
    //     ]
    //   },
    //   include: {
    //     environmentInfo: true,
    //     connectionInfo: true,
    //     securityInfo: true,
    //   }
    // });
    
    const systems = await prisma.systemInfo.findMany({
      where: {
        AND: [
          // เงื่อนไขสำหรับ systemInfo
          systemName ? { systemName: { equals: systemName as string } } : undefined,
          developType ? { developType: { equals: developType as string } } : undefined,
          businessUnit ? { businessUnit: { equals: businessUnit as string } } : undefined,
          
          // เงื่อนไขสำหรับ environmentInfo ถ้ามีการระบุเงื่อนไขใด ๆ ใน environment, serverName หรือ ip
          (environment || serverName || ip) ? {
            environmentInfo: {
              some: {
                AND: [
                  environment ? { environment: { equals: environment as string } } : undefined,
                  serverName ? { serverName: { equals: serverName as string } } : undefined,
                  ip ? { ip: { equals: ip as string } } : undefined,
                ].filter(condition => condition !== undefined)
              }
            }
          } : undefined,
        ].filter(condition => condition !== undefined)
      },
      include: {
        environmentInfo: true,
        connectionInfo: true,
        securityInfo: true,
      }
    });
    
    res.json(systems);
  } catch (error) {
    console.error('Error searching systems:', error);
    res.status(500).json({ error: 'Failed to search systems' });
  }
};

// Export functions with same names but simplified functionality
export {
  createfrome,
  getforme,
  getSystemById,
  updateforme,
  deletefrome,
  checkExistingSystem,
  searchSystems
}

