"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // นำเข้า cors
const router = express_1.default.Router();
router.use((0, cors_1.default)()); //ใช้ cors สำหรับให้ prot อื่นเข้าถึง api ได้
exports.default = router;
//# sourceMappingURL=option.js.map