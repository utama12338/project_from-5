"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSystems = exports.checkExistingSystem = exports.deletefrome = exports.updateforme = exports.getSystemById = exports.getforme = exports.createfrome = void 0;
const client_1 = require("@prisma/client");
const Joi = __importStar(require("joi"));
const prisma = new client_1.PrismaClient();
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
const createfrome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const systemInput = req.body;
    const { error } = systemSchema.validate(systemInput);
    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }
    try {
        const system = yield prisma.systemInfo.create({
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
    }
    catch (error) {
        console.error('Error creating system:', error);
        res.status(500).json({ error: 'Failed to create system' });
    }
});
exports.createfrome = createfrome;
// Get all systems (เดิมคือ getforme)
const getforme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const systems = yield prisma.systemInfo.findMany({
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
    }
    catch (error) {
        console.error('Error fetching systems:', error);
        res.status(500).json({ error: 'Failed to fetch systems' });
    }
});
exports.getforme = getforme;
// Get system by ID
const getSystemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const system = yield prisma.systemInfo.findUnique({
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
    }
    catch (error) {
        console.error('Error fetching system:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});
exports.getSystemById = getSystemById;
// Delete system
const deletefrome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.systemInfo.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({ message: 'ลบข้อมูลระบบเรียบร้อยแล้ว' });
    }
    catch (error) {
        console.error('Error deleting system:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
});
exports.deletefrome = deletefrome;
// Modified update function using Prisma's generated types
const updateforme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedSystem = yield prisma.systemInfo.update({
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
                    create: updateData.environmentInfo.map((env) => (Object.assign(Object.assign({}, env), { id: undefined, systemInfoId: undefined, 
                        // createdAt: now,
                        updatedAt: now })))
                },
                connectionInfo: {
                    deleteMany: {},
                    create: updateData.connectionInfo.map((conn) => (Object.assign(Object.assign({}, conn), { id: undefined, systemInfoId: undefined, 
                        // createdAt: now,
                        updatedAt: now })))
                },
                securityInfo: {
                    deleteMany: {},
                    create: updateData.securityInfo.map((sec) => (Object.assign(Object.assign({}, sec), { id: undefined, systemInfoId: undefined, 
                        // createdAt: now,
                        updatedAt: now })))
                }
            },
            include: {
                environmentInfo: true,
                connectionInfo: true,
                securityInfo: true
            }
        });
        res.json(updatedSystem);
    }
    catch (error) {
        console.error('Error updating system:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล' });
    }
});
exports.updateforme = updateforme;
// Check existing system
const checkExistingSystem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { systemName } = req.query;
        const existingSystem = yield prisma.systemInfo.findFirst({
            where: {
                systemName: systemName
            }
        });
        res.json(existingSystem);
    }
    catch (error) {
        console.error('Error checking system:', error);
        res.status(500).json({ error: 'Failed to check system' });
    }
});
exports.checkExistingSystem = checkExistingSystem;
const searchSystems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { systemName, serverName, environment, ip, developType, businessUnit } = req.query;
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
        const systems = yield prisma.systemInfo.findMany({
            where: {
                AND: [
                    systemName ? { systemName: { equals: systemName } } : {},
                    developType ? { developType: { equals: developType } } : {},
                    businessUnit ? { businessUnit: { equals: businessUnit } } : {},
                    environment && serverName && ip ? {
                        environmentInfo: {
                            some: {
                                AND: [
                                    environment ? { environment: { equals: environment } } : {},
                                    serverName ? { serverName: { equals: serverName } } : {},
                                    ip ? { ip: { equals: ip } } : {},
                                ]
                            }
                        }
                    } : {}
                ]
            },
            include: {
                environmentInfo: true,
                connectionInfo: true,
                securityInfo: true,
            }
        });
        res.json(systems);
    }
    catch (error) {
        console.error('Error searching systems:', error);
        res.status(500).json({ error: 'Failed to search systems' });
    }
});
exports.searchSystems = searchSystems;
//# sourceMappingURL=formeController.js.map