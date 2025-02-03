import { Request, Response } from 'express'
import { PrismaClient, SystemInfo, EnvironmentInfo, ConnectionInfo, SecurityInfo } from '@prisma/client'
import * as Joi from 'joi'

const prisma = new PrismaClient()

const systemSchema = Joi.object({
  // userId: Joi.number().optional(),
  id: Joi.number().optional(),
  systemName: Joi.string().required(),
  developType: Joi.string().valid('OUTSOURCE', 'IN HOUSE').required(),
  contractNo: Joi.string().required(),
  vendorContactNo: Joi.string().required(),
  businessUnit: Joi.string().required(),
  developUnit: Joi.string().required(),
  computerbackup: Joi.string().required(),
  environmentInfo: Joi.array().items(Joi.object({
    environment: Joi.string().optional(),
    serverName: Joi.string().optional(),
    ip: Joi.string().optional(),
    serverType: Joi.string().optional(),
    serverRole: Joi.string().optional(),
    serverDuty: Joi.string().optional(),
    database: Joi.string().optional(),
    application: Joi.string().optional(),
    operatingSystem: Joi.string().optional(),
    servicePack: Joi.string().optional(),
    build: Joi.string().optional(),
    cpu: Joi.string().optional(),
    ram: Joi.string().optional(),
    disk: Joi.string().optional(),
    dr: Joi.string().optional(),
    joinDomain: Joi.string().optional(),
    windowsCluster: Joi.string().optional(),
    productionUnit: Joi.array().items(Joi.string()).optional(),
  })).optional(),
  connectionInfo: Joi.array().items(Joi.object({
    ad: Joi.string().optional(),
    adfs: Joi.string().optional(),
    dns: Joi.string().optional(),
    ntp: Joi.string().optional(),
    tpam: Joi.string().optional(),
    netka: Joi.string().optional(),
    fim: Joi.string().optional(),
    ftpServer: Joi.string().optional(),
    ftpGoAnywhereMFTServer: Joi.string().optional(),
    emailSmtp: Joi.string().optional(),
    sms: Joi.string().optional(),
    apiManagement: Joi.string().optional(),
    dv: Joi.string().optional(),
    snmp: Joi.string().optional(),
  })).optional(),
  securityInfo: Joi.array().items(Joi.object({
    urlWebsite: Joi.string().optional(),
    certificateExpireDate: Joi.string().optional(),
    backupPolicy: Joi.string().optional(),
    downtimeAllowed: Joi.string().optional(),
    centralizeLog: Joi.string().optional(),
    setupAgentPatch: Joi.string().optional(),
    internetFacing: Joi.string().optional(),
  })).optional(),
});

// Create system (เดิมคือ createforme)
const createfrome = async (req: Request, res: Response) => {
  const systemInput = req.body;
  
  const { error } = systemSchema.validate(systemInput);
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
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
const getSystemById = async (req: Request, res: Response) => {
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
      return res.status(404).json({ error: 'ไม่พบข้อมูลระบบที่ต้องการ' });
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

// Modified update function using Prisma's generated types
const updateforme = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Separate validation schema for updates
  const updateSystemValidationSchema = Joi.object({
    id: Joi.number().required(),
    systemName: Joi.string().required(),
    developType: Joi.string().valid('OUTSOURCE', 'IN HOUSE').required(),
    contractNo: Joi.string().required(),
    vendorContactNo: Joi.string().required(),
    businessUnit: Joi.string().required(),
    developUnit: Joi.string().required(),
    computerbackup: Joi.string().required(),
    userId: Joi.number().allow(null),
    createdAt: Joi.date().iso(),
    updatedAt: Joi.date().iso(),

    environmentInfo: Joi.array().items(Joi.object({
      id: Joi.number().optional(),
      environment: Joi.string().required(),
      serverName: Joi.string().required(),
      ip: Joi.string().required(),
      serverType: Joi.string().required(),
      serverRole: Joi.string().required(),
      serverDuty: Joi.string().required(),
      database: Joi.string().allow(''),
      application: Joi.string().allow(''),
      operatingSystem: Joi.string().allow(''),
      servicePack: Joi.string().allow(''),
      build: Joi.string().allow(''),
      cpu: Joi.string().allow(''),
      ram: Joi.string().allow(''),
      disk: Joi.string().allow(''),
      dr: Joi.string().allow(''),
      joinDomain: Joi.string().valid('YES', 'NO').required(),
      windowsCluster: Joi.string().valid('YES', 'NO').required(),
      productionUnit: Joi.array().items(Joi.string()),
      systemInfoId: Joi.number(),
      createdAt: Joi.date().iso(),
      updatedAt: Joi.date().iso()
    })),

    connectionInfo: Joi.array().items(Joi.object({
      id: Joi.number().optional(),
      ad: Joi.string().valid('YES', 'NO').required(),
      adfs: Joi.string().valid('YES', 'NO').required(),
      dns: Joi.string().valid('YES', 'NO').required(),
      ntp: Joi.string().valid('YES', 'NO').required(),
      tpam: Joi.string().valid('YES', 'NO').required(),
      netka: Joi.string().valid('YES', 'NO').required(),
      fim: Joi.string().valid('YES', 'NO').required(),
      ftpServer: Joi.string().valid('YES', 'NO').required(),
      ftpGoAnywhereMFTServer: Joi.string().valid('YES', 'NO').required(),
      emailSmtp: Joi.string().valid('YES', 'NO').required(),
      sms: Joi.string().valid('YES', 'NO').required(),
      apiManagement: Joi.string().valid('YES', 'NO').required(),
      dv: Joi.string().valid('YES', 'NO').required(),
      snmp: Joi.string().valid('YES', 'NO').required(),
      systemInfoId: Joi.number(),
      createdAt: Joi.date().iso(),
      updatedAt: Joi.date().iso()
    })),

    securityInfo: Joi.array().items(Joi.object({
      id: Joi.number().optional(),
      urlWebsite: Joi.string().uri().allow(''),
      certificateExpireDate: Joi.string().allow(''),
      backupPolicy: Joi.string().allow(''),
      downtimeAllowed: Joi.string().allow(''),
      centralizeLog: Joi.string().valid('YES', 'NO').required(),
      setupAgentPatch: Joi.string().valid('YES', 'NO').required(),
      internetFacing: Joi.string().valid('YES', 'NO').required(),
      systemInfoId: Joi.number(),
      createdAt: Joi.date().iso(),
      updatedAt: Joi.date().iso()
    }))
  });

  try {
    // Validate update data
    const { error } = updateSystemValidationSchema.validate(updateData);
    if (error) {
      return res.status(400).json({ errors: error.details.map(detail => detail.message) });
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

