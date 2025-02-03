"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cors_1 = __importDefault(require("cors")); // นำเข้า cors
const optionselect_1 = require("../controllers/optionselect");
const optionRoutes = (0, express_1.Router)();
optionRoutes.use((0, cors_1.default)()); //ใช้ cors สำหรับให้ prot อื่นเข้าถึง api ได้
optionRoutes.get('/environment', optionselect_1.getEnvironmentOptions);
optionRoutes.get('/server-type', optionselect_1.getServerTypeOptions);
optionRoutes.get('/server-role', optionselect_1.getServerRoleOptions);
optionRoutes.get('/server-duty', optionselect_1.getServerDutyOptions);
optionRoutes.get('/production-unit', optionselect_1.getProductionUnitOptions);
optionRoutes.get('/developer-unit', optionselect_1.getDeveloperUnitOptions);
optionRoutes.get('/yes-no', optionselect_1.getYesNoOptions);
optionRoutes.get('/dr-dc', optionselect_1.getDrDcOptions);
optionRoutes.get('/developer-type', optionselect_1.getDeveloperTypeOptions);
exports.default = optionRoutes;
//# sourceMappingURL=optionselect.js.map