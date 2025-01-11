import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import * as Joi from 'joi' // เช็ค ค่าที่ส่งเข้ามายัง api
const prisma = new PrismaClient()  // สร้าง instance ของ PrismaClient




const createforme = async (req: Request, res: Response) => {
  const systemInput = req.body;
  console.log('Request body:', systemInput);

  // Validation schema
    const schema = Joi.object({
      userId: Joi.number().optional(),
      systemName: Joi.string().required(),
      developType: Joi.string().valid('OUTSOURCE', 'IN HOUSE').required(),
      contractNo: Joi.string().required(),
      vendorContactNo: Joi.string().required(),
      businessUnit: Joi.string().required(),
      developUnit: Joi.string().required(),
      draftStatus: Joi.string().valid('DRAFT', 'PUBLISH'),
      environmentInfo: Joi.array().items(Joi.object({
        environment: Joi.string().required(),
        serverName: Joi.string().required(),
        ip: Joi.string().required(),
        serverType: Joi.string().required(),
        serverRole: Joi.string().required(),
        serverDuty: Joi.string().required(),
        database: Joi.string().required(),
        application: Joi.string().required(),
        operatingSystem: Joi.string().required(),
        servicePack: Joi.string().required(),
        build: Joi.string().required(),
        cpu: Joi.string().required(),
        ram: Joi.string().required(),
        disk: Joi.string().required(),
        dr: Joi.string().required(),
        joinDomain: Joi.string().required(),
        windowsCluster: Joi.string().required(),
        productionUnit: Joi.string().required(),
      })).required(),
      connectionInfo: Joi.array().items(Joi.object({
        ad: Joi.string().required(),
        adfs: Joi.string().required(),
        dns: Joi.string().required(),
        ntp: Joi.string().required(),
        tpam: Joi.string().required(),
        netka: Joi.string().required(),
        fim: Joi.string().required(),
        ftpServer: Joi.string().required(),
        ftpGoAnywhereMFTServer: Joi.string().required(),
        emailSmtp: Joi.string().required(),
        sms: Joi.string().required(),
        apiManagement: Joi.string().required(),
        dv: Joi.string().required(),
        snmp: Joi.string().required(),
      })).required(),
      securityInfo: Joi.array().items(Joi.object({
        urlWebsite: Joi.string().required(),
        certificateExpireDate: Joi.string().required(),
        backupPolicy: Joi.string().required(),
        downtimeAllowed: Joi.string().required(),
        centralizeLog: Joi.string().required(),
        setupAgentPatch: Joi.string().required(),
        internetFacing: Joi.string().required(),
      })).required(),
    });


    




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
        draftStatus: systemInput.draftStatus,
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
    });

      res.status(201).json(system);
      } catch (err) {
        console.error('Error creating system:', err);
      
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้างข้อมูลระบบ' });
     }
};



const createpublish = async (req: Request, res: Response) => { // ฟังก์ชันสำหรับสร้างข้อมูลระบบ
  const { id } = req.params;
  const systemInput = req.body; // ใช้ประเภทข้อมูลพื้นฐาน

  console.log(req.body);
  
  // validation schema
  const schema = Joi.object({
    userId: Joi.number().optional(),
    systemName: Joi.string(),
    developType: Joi.string().valid('OUTSOURCE', 'IN HOUSE').required(),
    contractNo: Joi.string().required(),
    vendorContactNo: Joi.string().required(),
    businessUnit: Joi.string().required(),
    developUnit: Joi.string().required(),
    // draftStatus: Joi.string().valid('DRAFT', 'PUBLISH').required(), // เพิ่ม validation สำหรับ status
    environmentInfo: Joi.array().items(Joi.object({
      environment: Joi.string().required(),
      serverName: Joi.string().required(),
      ip: Joi.string().required(),
      serverType: Joi.string().required(),
      serverRole: Joi.string().required(),
      serverDuty: Joi.string().required(),
      database: Joi.string().required(),
      application: Joi.string().required(),
      operatingSystem: Joi.string().required(),
      servicePack: Joi.string().required(),
      build: Joi.string().required(),
      cpu: Joi.string().required(),
      ram: Joi.string().required(),
      disk: Joi.string().required(),
      dr: Joi.string().required(),
      joinDomain: Joi.string().required(),
      windowsCluster: Joi.string().required(),
      productionUnit: Joi.string().required(),
    })).required(),
    connectionInfo: Joi.array().items(Joi.object({
      ad: Joi.string().required(),
      adfs: Joi.string().required(),
      dns: Joi.string().required(),
      ntp: Joi.string().required(),
      tpam: Joi.string().required(),
      netka: Joi.string().required(),
      fim: Joi.string().required(),
      ftpServer: Joi.string().required(),
      ftpGoAnywhereMFTServer: Joi.string().required(),
      emailSmtp: Joi.string().required(),
      sms: Joi.string().required(),
      apiManagement: Joi.string().required(),
      dv: Joi.string().required(),
      snmp: Joi.string().required(),
    })).required(),
    securityInfo: Joi.array().items(Joi.object({
      urlWebsite: Joi.string().required(),
      certificateExpireDate: Joi.string().required(),
      backupPolicy: Joi.string().required(),
      downtimeAllowed: Joi.string().required(),
      centralizeLog: Joi.string().required(),
      setupAgentPatch: Joi.string().required(),
      internetFacing: Joi.string().required(),
    })).required(),
  });

  const { error } = schema.validate(systemInput);
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }

  try {
    // Find the existing draft system
    const existingSystem = await prisma.systemInfo.findUnique({
      where: {
          id: parseInt(id),
          draftStatus: "DRAFT",
          isDeleted: false, // Only find records that were not soft deleted
      },
    });
      if (!existingSystem) {
        return res.status(404).json({ message: 'ไม่พบ Form Draft หรือ draft นั้นถูก Publish ไปแล้ว' });
    }

   // Create a new system based on the draft
  const system = await prisma.systemInfo.create({
    data: {
  
        draftStatus: "PUBLISH",
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
  });

  
  
      //update status of draft to publish
      const restoredSystem = await prisma.systemInfo.update({
          where: {
              id: parseInt(id)
          },
          data: {
              draftStatus: "PUBLISH"
         }
       });




    res.status(201).json(system);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้างข้อมูลระบบ' });
  }
};


const createDraft = async (req: Request, res: Response) => { // ฟังชั่นcreate draft
  const systemInput = req.body;
  const schema = Joi.object({
    userId: Joi.number().optional(),
    systemName: Joi.string().optional().empty(""),
    developType: Joi.string().optional().empty(""),
    contractNo: Joi.string().optional().empty(""),
    vendorContactNo: Joi.string().optional().empty(""),
    businessUnit: Joi.string().optional().empty(""),
    developUnit: Joi.string().optional().empty(""),
    draftStatus: Joi.forbidden(), // ไม่อนุญาตให้ผู้ใช้ส่งค่า
    environmentInfo: Joi.array().items(Joi.object({
      environment: Joi.string().optional().empty(""),
      serverName: Joi.string().optional().empty(""),
      ip: Joi.string().optional().empty(""),
      serverType: Joi.string().optional().empty(""),
      serverRole: Joi.string().optional().empty(""),
      serverDuty: Joi.string().optional().empty(""),
      database: Joi.string().optional().empty(""),
      application: Joi.string().optional().empty(""),
      operatingSystem: Joi.string().optional().empty(""),
      servicePack: Joi.string().optional().empty(""),
      build: Joi.string().optional().empty(""),
      cpu: Joi.string().optional().empty(""),
      ram: Joi.string().optional().empty(""),
      disk: Joi.string().optional().empty(""),
      dr: Joi.string().optional().empty(""),
      joinDomain: Joi.string().optional().empty(""),
      windowsCluster: Joi.string().optional().empty(""),
      productionUnit: Joi.string().optional().empty(""),
    })).optional(),
    connectionInfo: Joi.array().items(Joi.object({
      ad: Joi.string().optional().empty(""),
      adfs: Joi.string().optional().empty(""),
      dns: Joi.string().optional().empty(""),
      ntp: Joi.string().optional().empty(""),
      tpam: Joi.string().optional().empty(""),
      netka: Joi.string().optional().empty(""),
      fim: Joi.string().optional().empty(""),
      ftpServer: Joi.string().optional().empty(""),
      ftpGoAnywhereMFTServer: Joi.string().optional().empty(""),
      emailSmtp: Joi.string().optional().empty(""),
      sms: Joi.string().optional().empty(""),
      apiManagement: Joi.string().optional().empty(""),
      dv: Joi.string().optional().empty(""),
      snmp: Joi.string().optional().empty(""),
    })).optional(),
    securityInfo: Joi.array().items(Joi.object({
      urlWebsite: Joi.string().optional().empty(""),
      certificateExpireDate: Joi.string().optional().empty(""),
      backupPolicy: Joi.string().optional().empty(""),
      downtimeAllowed: Joi.string().optional().empty(""),
      centralizeLog: Joi.string().optional().empty(""),
      setupAgentPatch: Joi.string().optional().empty(""),
      internetFacing: Joi.string().optional().empty(""),
    })).optional(),
  });
  

  const { error } = schema.validate(systemInput);
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }


      

  const system = await prisma.systemInfo.create({
    data: {userId: systemInput.userId,
      systemName: systemInput.systemName,
      developType: systemInput.developType,
      contractNo: systemInput.contractNo,
      vendorContactNo: systemInput.vendorContactNo,
      businessUnit: systemInput.businessUnit,
      developUnit: systemInput.developUnit,
      draftStatus: systemInput.draftStatus,
      environmentInfo: {
        create: systemInput.environmentInfo,
      },
      connectionInfo: {
        create: systemInput.connectionInfo,
      },
      securityInfo: {
        create: systemInput.securityInfo,
      },}
  });
  res.status(201).json(system);
};


const getforme = async (req: Request, res: Response) => {// ดึงข้อมูลออกมาทุกอย่าง 
  try {
    const systems = await prisma.systemInfo.findMany({
      include: {
        // ดึงข้อมูลจากตารางที่เกี่ยวข้องทั้งหมด
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
      where: {
        // เพิ่มเงื่อนไขสำหรับ soft delete
        isDeleted: false,
        draftStatus: 'PUBLISH'
      },
      orderBy: {
        // เรียงตามวันที่สร้างล่าสุด
        createdAt: 'desc'
      }
    });

    // จัดรูปแบบข้อมูลให้ตรงกับ formData structure
    const formattedSystems = systems.map(system => ({
      id: system.id,
      systemName: system.systemName,
      developType: system.developType,
      contractNo: system.contractNo,
      vendorContactNo: system.vendorContactNo,
      businessUnit: system.businessUnit,
      developUnit: system.developUnit,
      draftStatus: system.draftStatus,
      environmentInfo: system.environmentInfo.map(env => ({
        environment: env.environment,
        serverName: env.serverName,
        ip: env.ip,
        serverType: env.serverType,
        serverRole: env.serverRole,
        serverDuty: env.serverDuty,
        database: env.database,
        application: env.application,
        operatingSystem: env.operatingSystem,
        servicePack: env.servicePack,
        build: env.build,
        cpu: env.cpu,
        ram: env.ram,
        disk: env.disk,
        dr: env.dr,
        joinDomain: env.joinDomain,
        windowsCluster: env.windowsCluster,
        productionUnit: env.productionUnit
      })),
      connectionInfo: system.connectionInfo.map(conn => ({
        ad: conn.ad,
        adfs: conn.adfs,
        dns: conn.dns,
        ntp: conn.ntp,
        tpam: conn.tpam,
        netka: conn.netka,
        fim: conn.fim,
        ftpServer: conn.ftpServer,
        ftpGoAnywhereMFTServer: conn.ftpGoAnywhereMFTServer,
        emailSmtp: conn.emailSmtp,
        sms: conn.sms,
        apiManagement: conn.apiManagement,
        dv: conn.dv,
        snmp: conn.snmp
      })),
      securityInfo: system.securityInfo.map(security => ({
        urlWebsite: security.urlWebsite,
        certificateExpireDate: security.certificateExpireDate,
        backupPolicy: security.backupPolicy,
        downtimeAllowed: security.downtimeAllowed,
        centralizeLog: security.centralizeLog,
        setupAgentPatch: security.setupAgentPatch,
        internetFacing: security.internetFacing
      })),
      user: system.user,
      createdAt: system.createdAt,
      updatedAt: system.updatedAt
    }));

    res.json(formattedSystems);
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
};

const getformedraft = async (req: Request, res: Response) => {// ดึงข้อมูลออกมาทุกอย่าง 
  try {
    const systems = await prisma.systemInfo.findMany({
      include: {
        // ดึงข้อมูลจากตารางที่เกี่ยวข้องทั้งหมด
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
      where: {
        // เพิ่มเงื่อนไขสำหรับ soft delete
        isDeleted:false,
        draftStatus: 'DRAFT'
      },
      orderBy: {
        // เรียงตามวันที่สร้างล่าสุด
        createdAt: 'desc'
      }
    });

    // จัดรูปแบบข้อมูลให้ตรงกับ formData structure
    const formattedSystems = systems.map(system => ({
      id: system.id,
      systemName: system.systemName,
      developType: system.developType,
      contractNo: system.contractNo,
      vendorContactNo: system.vendorContactNo,
      businessUnit: system.businessUnit,
      developUnit: system.developUnit,
      draftStatus: system.draftStatus,
      environmentInfo: system.environmentInfo.map(env => ({
        environment: env.environment,
        serverName: env.serverName,
        ip: env.ip,
        serverType: env.serverType,
        serverRole: env.serverRole,
        serverDuty: env.serverDuty,
        database: env.database,
        application: env.application,
        operatingSystem: env.operatingSystem,
        servicePack: env.servicePack,
        build: env.build,
        cpu: env.cpu,
        ram: env.ram,
        disk: env.disk,
        dr: env.dr,
        joinDomain: env.joinDomain,
        windowsCluster: env.windowsCluster,
        productionUnit: env.productionUnit
      })),
      connectionInfo: system.connectionInfo.map(conn => ({
        ad: conn.ad,
        adfs: conn.adfs,
        dns: conn.dns,
        ntp: conn.ntp,
        tpam: conn.tpam,
        netka: conn.netka,
        fim: conn.fim,
        ftpServer: conn.ftpServer,
        ftpGoAnywhereMFTServer: conn.ftpGoAnywhereMFTServer,
        emailSmtp: conn.emailSmtp,
        sms: conn.sms,
        apiManagement: conn.apiManagement,
        dv: conn.dv,
        snmp: conn.snmp
      })),
      securityInfo: system.securityInfo.map(security => ({
        urlWebsite: security.urlWebsite,
        certificateExpireDate: security.certificateExpireDate,
        backupPolicy: security.backupPolicy,
        downtimeAllowed: security.downtimeAllowed,
        centralizeLog: security.centralizeLog,
        setupAgentPatch: security.setupAgentPatch,
        internetFacing: security.internetFacing
      })),
      user: system.user,
      createdAt: system.createdAt,
      updatedAt: system.updatedAt
    }));

    res.json(formattedSystems);
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
};


const getformedraft_Count = async (req: Request, res: Response) => {// ดึงข้อมูลออกมาทุกอย่าง 
  try {
    const systems = await prisma.systemInfo.findMany({
      include: {
        // ดึงข้อมูลจากตารางที่เกี่ยวข้องทั้งหมด
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
      where: {
        // เพิ่มเงื่อนไขสำหรับ soft delete
        isDeleted: false,
        draftStatus: 'DRAFT'
      },
      orderBy: {
        // เรียงตามวันที่สร้างล่าสุด
        createdAt: 'desc'
      }
    });
    const draftCount = systems.filter(
      (system) => system.draftStatus === 'DRAFT' 
    ).length;

    

    res.json({ count: draftCount });
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
};

const getformesoftdelete_Count = async (req: Request, res: Response) => {// ดึงข้อมูลออกมาทุกอย่าง 
  try {
    const systems = await prisma.systemInfo.findMany({
      include: {
        // ดึงข้อมูลจากตารางที่เกี่ยวข้องทั้งหมด
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
      where: {
        // เพิ่มเงื่อนไขสำหรับ soft delete
        isDeleted: true
      },
      orderBy: {
        // เรียงตามวันที่สร้างล่าสุด
        createdAt: 'desc'
      }
    });
    const trashCount = systems.filter(
      (system) => system.draftStatus === 'DRAFT' || system.draftStatus === 'PUBLISH'
    ).length;
    

    res.json({ count: trashCount });
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
};

const getSystemById = async (req: Request, res: Response) => { // ดึงข้อมูลออกมาทุกอย่าง ตาม id
  try {
    const { id } = req.params; // รับ id จาก URL parameter
    const system = await prisma.systemInfo.findUnique({
      where: {
        id: parseInt(id),
        // isDeleted: false,
        // draftStatus: 'PUBLISH',
      },
      select: {
        id: false, // ซ่อน id ของระบบ
        systemName: true,
        developType: true,
        contractNo: true,
        vendorContactNo: true,
        businessUnit: true,
        developUnit: true,
        // draftStatus: true,
        // isDeleted: true,
        // deletedAt: true,
        // createdAt: true,
        // updatedAt: true,
        environmentInfo: {
          select: {
            id: false, // ซ่อน id ของ environment
            environment: true,
            serverName: true,
            ip: true,
            serverType: true,
            serverRole: true,
            serverDuty: true,
            database: true,
            application: true,
            operatingSystem: true,
            servicePack: true,
            build: true,
            cpu: true,
            ram: true,
            disk: true,
            dr: true,
            joinDomain: true,
            windowsCluster: true,
            productionUnit: true,
            // createdAt: true,
            // updatedAt: true,
          },
        },
        connectionInfo: {
          select: {
            id: false, // ซ่อน id ของ connection
            ad: true,
            adfs: true,
            dns: true,
            ntp: true,
            tpam: true,
            netka: true,
            fim: true,
            ftpServer: true,
            ftpGoAnywhereMFTServer: true,
            emailSmtp: true,
            sms: true,
            apiManagement: true,
            dv: true,
            snmp: true,
            // createdAt: true,
            // updatedAt: true,
          },
        },
        securityInfo: {
          select: {
            id: false, // ซ่อน id ของ security
            urlWebsite: true,
            certificateExpireDate: true,
            backupPolicy: true,
            downtimeAllowed: true,
            centralizeLog: true,
            setupAgentPatch: true,
            internetFacing: true,
            // createdAt: true,
            // updatedAt: true,
          },
        },
      },
    });
    // const system = await prisma.systemInfo.findUnique({
    //   where: {
    //     id: parseInt(id),
    //     isDeleted: false, // ตรวจสอบว่าไม่ได้ถูกลบ (soft delete)
    //     draftStatus: 'PUBLISH'
    //   },
    //   include: {
    //     environmentInfo: true,
    //     connectionInfo: true,
    //     securityInfo: true,
    //     user: {
    //       select: {
    //         id: true,
    //         email: true,
    //         username: true
    //       }
    //     }
    //   }
    // });

    if (!system) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลระบบที่ต้องการ' });
    }

    res.json(system);
  } catch (error) {
    console.error('Error fetching system:', error);
    res.status(500).json({ 
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const softdeleteforme = async (req: Request, res: Response) => { // ลบตามไอดี
  try {
    const { id } = req.params;
    
    // ตรวจสอบว่ามีข้อมูลที่จะลบหรือไม่
    const existingSystem = await prisma.systemInfo.findUnique({
      where: {
        id: parseInt(id),
        isDeleted: false
      }
    });

    if (!existingSystem) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลระบบที่ต้องทิ้งลงถังขยะ' });
    }

    // ทำ soft delete โดยอัพเดท isDeleted เป็น true
    const deletedSystem = await prisma.systemInfo.update({
      where: {
        id: parseInt(id)
      },
            data: {
        isDeleted: true,
        deletedAt: new Date(new Date().setDate(new Date().getDate() + 7))
      }
    });

    res.json({ 
      message: 'ย้ายลงถังขยะเรียบร้อย',
      deletedSystem 
    });

  } catch (error) {
    console.error('Error deleting system:', error);
    res.status(500).json({ 
      error: 'ย้ายลงถังขยะเรียบร้อย',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const cancelSoftDelete = async (req: Request, res: Response) => { // cancel softdeleteforme
  try {
      const { id } = req.params;

      // Check if the record exists and is currently soft-deleted
      const existingSystem = await prisma.systemInfo.findUnique({
          where: {
              id: parseInt(id),
              isDeleted: true // Only find records that were soft-deleted
          }
      });

      if (!existingSystem) {
          return res.status(404).json({ error: 'ไม่พบข้อมูลระบบที่ถูกทิ้งลงถังขยะ' });
      }

      // Remove isDeleted flag and deletedAt timestamp to revert soft delete
      const restoredSystem = await prisma.systemInfo.update({
          where: {
              id: parseInt(id)
          },
          data: {

              deletedAt: null
            },
      });
      
        // Remove null values for better query
       const cleanUpRestoredSystem = await prisma.systemInfo.update({
          where: {
              id: parseInt(id)
          },
          data: {
           isDeleted: false,
         },
      });

      res.json({
          message: 'กู้คืนข้อมูลจากถังขยะสำเร็จ',
          restoredSystem: cleanUpRestoredSystem // Respond with updated record
      });

  } catch (error) {
      console.error('Error restoring system:', error);
      res.status(500).json({
          error: 'เกิดข้อผิดพลาดในการกู้คืนข้อมูล',
           details: error instanceof Error ? error.message : 'Unknown error'
      });
  }
};

const deleteforme = async (req: Request, res: Response) => {
 
    try {
      const { id } = req.params;
      
      // ตรวจสอบว่ามีข้อมูลที่จะลบหรือไม่
      const existingSystem = await prisma.systemInfo.findUnique({
        where: {
          id: parseInt(id),
          isDeleted: true
        }
      });

      if (!existingSystem) {
        return res.status(404).json({ error: 'ไม่พบข้อมูลระบบที่ต้องการลบ' });
      }

      // ทำ delete เลย
      const deletedSystem = await prisma.systemInfo.deleteMany({
        where: {
          id: parseInt(id)
        },
      });

      res.json({ 
        message: 'ลบข้อมูลระบบเรียบร้อยแล้ว',
        deletedSystem 
      });

    } catch (error) {
      console.error('Error deleting system:', error);
      res.status(500).json({ 
        error: 'เกิดข้อผิดพลาดในการลบข้อมูล',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

const updateforme = async (req: Request, res: Response) => {
  const systemInput = req.body;
  const schema = Joi.object({
    userId: Joi.number(),
    systemName: Joi.string(),
    developType: Joi.string().valid('OUTSOURCE', 'IN HOUSE').required(),
    contractNo: Joi.string().required(),
    vendorContactNo: Joi.string().required(),
    businessUnit: Joi.string().required(),
    developUnit: Joi.string().required(),
    // draftStatus: Joi.string().valid('DRAFT', 'PUBLISH').required(), // เพิ่ม validation สำหรับ status
    environmentInfo: Joi.array().items(Joi.object({
      environment: Joi.string().required(),
      serverName: Joi.string().required(),
      ip: Joi.string().required(),
      serverType: Joi.string().required(),
      serverRole: Joi.string().required(),
      serverDuty: Joi.string().required(),
      database: Joi.string().required(),
      application: Joi.string().required(),
      operatingSystem: Joi.string().required(),
      servicePack: Joi.string().required(),
      build: Joi.string().required(),
      cpu: Joi.string().required(),
      ram: Joi.string().required(),
      disk: Joi.string().required(),
      dr: Joi.string().required(),
      joinDomain: Joi.string().required(),
      windowsCluster: Joi.string().required(),
      productionUnit: Joi.string().required(),
    })).required(),
    connectionInfo: Joi.array().items(Joi.object({
      ad: Joi.string().required(),
      adfs: Joi.string().required(),
      dns: Joi.string().required(),
      ntp: Joi.string().required(),
      tpam: Joi.string().required(),
      netka: Joi.string().required(),
      fim: Joi.string().required(),
      ftpServer: Joi.string().required(),
      ftpGoAnywhereMFTServer: Joi.string().required(),
      emailSmtp: Joi.string().required(),
      sms: Joi.string().required(),
      apiManagement: Joi.string().required(),
      dv: Joi.string().required(),
      snmp: Joi.string().required(),
    })).required(),
    securityInfo: Joi.array().items(Joi.object({
      urlWebsite: Joi.string().required(),
      certificateExpireDate: Joi.string().required(),
      backupPolicy: Joi.string().required(),
      downtimeAllowed: Joi.string().required(),
      centralizeLog: Joi.string().required(),
      setupAgentPatch: Joi.string().required(),
      internetFacing: Joi.string().required(),
    })).required(),
  });

  const { error } = schema.validate(systemInput);
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }

  try {
    const { id } = req.params;
    const updateData = req.body;

    // ตรวจสอบว่ามีข้อมูลที่จะแก้ไขหรือไม่
    const existingSystem = await prisma.systemInfo.findUnique({
      where: {
        id: parseInt(id),
        isDeleted: false
      }
    });

    // if (!existingSystem) {
    //   return res.status(404).json({ error: 'สามารถมารถอัพเดทได้ เพิ่มข้อมูลไม่ครบ' });
    // }

    // อัพเดทข้อมูล
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
        environmentInfo: {
          deleteMany: {},
          create: updateData.environmentInfo
        },
        connectionInfo: {
          deleteMany: {},
          create: updateData.connectionInfo
        },
        securityInfo: {
          deleteMany: {},
          create: updateData.securityInfo
        }
      },
      include: {
        environmentInfo: true,
        connectionInfo: true,
        securityInfo: true
      }
    });

    res.json({ 
      message: 'อัพเดทข้อมูลเรียบร้อยแล้ว',
      updatedSystem 
    });

  } catch (error) {
    console.error('Error updating system:', error);
    res.status(500).json({ 
      error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const updateforme_draft = async (req: Request, res: Response) => {
  const systemInput = req.body;
  const schema = Joi.object({
    userId: Joi.number().allow("").optional(),
    systemName: Joi.string().allow("").optional(),
    developType: Joi.string().allow("").optional(),
    contractNo: Joi.string().allow("").optional(),
    vendorContactNo: Joi.string().allow("").optional(),
    businessUnit: Joi.string().allow("").optional(),
    developUnit: Joi.string().allow("").optional(),
    // draftStatus: Joi.string().allow("").optional().valid('DRAFT', 'PUBLISH'), // เพิ่ม validation สำหรับ status
    environmentInfo: Joi.array().items(Joi.object({
      environment: Joi.string().allow("").optional(),
      serverName: Joi.string().allow("").optional(),
      ip: Joi.string().allow("").optional(),
      serverType: Joi.string().allow("").optional(),
      serverRole: Joi.string().allow("").optional(),
      serverDuty: Joi.string().allow("").optional(),
      database: Joi.string().allow("").optional(),
      application: Joi.string().allow("").optional(),
      operatingSystem: Joi.string().allow("").optional(),
      servicePack: Joi.string().allow("").optional(),
      build: Joi.string().allow("").optional(),
      cpu: Joi.string().allow("").optional(),
      ram: Joi.string().allow("").optional(),
      disk: Joi.string().allow("").optional(),
      dr: Joi.string().allow("").optional(),
      joinDomain: Joi.string().allow("").optional(),
      windowsCluster: Joi.string().allow("").optional(),
      productionUnit: Joi.string().allow("").optional(),
    })),
    connectionInfo: Joi.array().items(Joi.object({
      ad: Joi.string().allow("").optional(),
      adfs: Joi.string().allow("").optional(),
      dns: Joi.string().allow("").optional(),
      ntp: Joi.string().allow("").optional(),
      tpam: Joi.string().allow("").optional(),
      netka: Joi.string().allow("").optional(),
      fim: Joi.string().allow("").optional(),
      ftpServer: Joi.string().allow("").optional(),
      ftpGoAnywhereMFTServer: Joi.string().allow("").optional(),
      emailSmtp: Joi.string().allow("").optional(),
      sms: Joi.string().allow("").optional(),
      apiManagement: Joi.string().allow("").optional(),
      dv: Joi.string().allow("").optional(),
      snmp: Joi.string().allow("").optional(),
    })),
    securityInfo: Joi.array().items(Joi.object({
      urlWebsite: Joi.string().allow("").optional(),
      certificateExpireDate: Joi.string().allow("").optional(),
      backupPolicy: Joi.string().allow("").optional(),
      downtimeAllowed: Joi.string().allow("").optional(),
      centralizeLog: Joi.string().allow("").optional(),
      setupAgentPatch: Joi.string().allow("").optional(),
      internetFacing: Joi.string().allow("").optional(),
    })),
  });

  const { error } = schema.validate(systemInput);
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }

  try {
    const { id } = req.params;
    const updateData = req.body;

    // ตรวจสอบว่ามีข้อมูลที่จะแก้ไขหรือไม่
    const existingSystem = await prisma.systemInfo.findUnique({
      where: {
        id: parseInt(id),
        isDeleted: false
      }
    });

    if (!existingSystem) {
      return res.status(404).json({ error: 'สามารถมารถอัพเดทได้ เพิ่มข้อมูลไม่ครบ' });
    }

    // อัพเดทข้อมูล
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
        environmentInfo: {
          deleteMany: {},
          create: updateData.environmentInfo
        },
        connectionInfo: {
          deleteMany: {},
          create: updateData.connectionInfo
        },
        securityInfo: {
          deleteMany: {},
          create: updateData.securityInfo
        }
      },
      include: {
        environmentInfo: true,
        connectionInfo: true,
        securityInfo: true
      }
    });

    res.json({ 
      message: 'อัพเดทข้อมูลเรียบร้อยแล้ว',
      updatedSystem 
    });

  } catch (error) {
    console.error('Error updating system:', error);
    res.status(500).json({ 
      error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};





export { createforme,updateforme_draft,getformedraft,getformesoftdelete_Count,getformedraft_Count,cancelSoftDelete,updateforme, deleteforme, createpublish, getforme, getSystemById, createDraft, softdeleteforme }

