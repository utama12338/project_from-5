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
router.post("/createforme", formeController_1.createforme);
router.post("/createDraft", formeController_1.createDraft);
router.post("/createpublish/:id", formeController_1.createpublish);
router.get("/getforme", formeController_1.getforme);
router.get("/getformedraft", formeController_1.getformedraft);
router.get("/getSystemById/:id", formeController_1.getSystemById);
router.get("/getformedraft_Count", formeController_1.getformedraft_Count);
router.get("/getformesoftdelete_Count", formeController_1.getformesoftdelete_Count);
//  csv check
router.get('/api/system/check', formeController_1.checkExistingSystem);
router.delete('/softdeleteforme/:id', formeController_1.softdeleteforme);
router.delete('/deleteforme/:id', formeController_1.deleteforme);
router.put('/cancelSoftDelete/:id', formeController_1.cancelSoftDelete);
router.put('/updateforme/:id', formeController_1.updateforme);
router.put('/updateforme_draft/:id', formeController_1.updateforme_draft);
exports.default = router;
//# sourceMappingURL=formeRoutes.js.map