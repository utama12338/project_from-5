"use strict";
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
exports.getDeveloperTypeOptions = exports.getDrDcOptions = exports.getYesNoOptions = exports.getDeveloperUnitOptions = exports.getProductionUnitOptions = exports.getServerDutyOptions = exports.getServerRoleOptions = exports.getServerTypeOptions = exports.getEnvironmentOptions = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getEnvironmentOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield prisma.environmentOption.findMany();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch environment options' });
    }
});
exports.getEnvironmentOptions = getEnvironmentOptions;
const getServerTypeOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield prisma.serverTypeOption.findMany();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch server type options' });
    }
});
exports.getServerTypeOptions = getServerTypeOptions;
const getServerRoleOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield prisma.serverRoleOption.findMany();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch server role options' });
    }
});
exports.getServerRoleOptions = getServerRoleOptions;
const getServerDutyOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield prisma.serverDutyOption.findMany();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch server duty options' });
    }
});
exports.getServerDutyOptions = getServerDutyOptions;
const getProductionUnitOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield prisma.productionUnitOption.findMany();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch production unit options' });
    }
});
exports.getProductionUnitOptions = getProductionUnitOptions;
const getDeveloperUnitOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield prisma.developerUnitOption.findMany();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch developer unit options' });
    }
});
exports.getDeveloperUnitOptions = getDeveloperUnitOptions;
const getYesNoOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield prisma.yesNoOption.findMany();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch yes/no options' });
    }
});
exports.getYesNoOptions = getYesNoOptions;
const getDrDcOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield prisma.drDcOption.findMany();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch DR/DC options' });
    }
});
exports.getDrDcOptions = getDrDcOptions;
const getDeveloperTypeOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield prisma.developerTypeOption.findMany();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch developer type options' });
    }
});
exports.getDeveloperTypeOptions = getDeveloperTypeOptions;
//# sourceMappingURL=optionselect.js.map