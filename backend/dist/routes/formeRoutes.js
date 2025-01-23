"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const formeController_1 = require("../controllers/formeController");
const router = express_1.default.Router();
const cors_1 = __importDefault(require("cors")); // นำเข้า cors
router.use((0, cors_1.default)()); //ใช้ cors สำหรับให้ prot อื่นเข้าถึง api ได้
router.post("/createforme", formeController_1.createfrome);
router.get("/getforme", formeController_1.getforme);
router.get("/getSystemById/:id", formeController_1.getSystemById);
router.delete('/deletefrome/:id', formeController_1.deletefrome);
router.put('/updateforme/:id', formeController_1.updateforme);
//  csv check
router.get('/api/system/check', formeController_1.checkExistingSystem);
router.get('/search', formeController_1.searchSystems);
exports.default = router;
//# sourceMappingURL=formeRoutes.js.map