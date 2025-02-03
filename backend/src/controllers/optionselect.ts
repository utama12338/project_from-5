import { Request, Response } from 'express'
import { PrismaClient, EnvironmentOption,
    ServerTypeOption,
    ServerRoleOption,
    ServerDutyOption,
    ProductionUnitOption,
    DeveloperUnitOption,
    YesNoOption,
    DrDcOption,
    DeveloperTypeOption
} from '@prisma/client'


const prisma = new PrismaClient()

export const getEnvironmentOptions = async (req: Request, res: Response) => {
    try {
        const options = await prisma.environmentOption.findMany();
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch environment options' });
    }
}

export const getServerTypeOptions = async (req: Request, res: Response) => {
    try {
        const options = await prisma.serverTypeOption.findMany();
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch server type options' });
    }
}

export const getServerRoleOptions = async (req: Request, res: Response) => {
    try {
        const options = await prisma.serverRoleOption.findMany();
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch server role options' });
    }
}

export const getServerDutyOptions = async (req: Request, res: Response) => {
    try {
        const options = await prisma.serverDutyOption.findMany();
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch server duty options' });
    }
}

export const getProductionUnitOptions = async (req: Request, res: Response) => {
    try {
        const options = await prisma.productionUnitOption.findMany();
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch production unit options' });
    }
}

export const getDeveloperUnitOptions = async (req: Request, res: Response) => {
    try {
        const options = await prisma.developerUnitOption.findMany();
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch developer unit options' });
    }
}

export const getYesNoOptions = async (req: Request, res: Response) => {
    try {
        const options = await prisma.yesNoOption.findMany();
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch yes/no options' });
    }
}

export const getDrDcOptions = async (req: Request, res: Response) => {
    try {
        const options = await prisma.drDcOption.findMany();
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch DR/DC options' });
    }
}

export const getDeveloperTypeOptions = async (req: Request, res: Response) => {
    try {
        const options = await prisma.developerTypeOption.findMany();
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch developer type options' });
    }
}

