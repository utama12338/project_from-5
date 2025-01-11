"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
const cors_1 = __importDefault(require("cors")); // นำเข้า cors
router.use((0, cors_1.default)()); //ใช้ cors สำหรับให้ prot อื่นเข้าถึง api ได้
router.post("/createDraft", userController_1.createDraft);
router.post("/createpublish", userController_1.createpublish);
router.get("/getforme", userController_1.getforme);
router.get("/getSystemById/:id", userController_1.getSystemById);
router.delete('/softdeleteforme/:id', userController_1.softdeleteforme);
router.delete('/deleteforme/:id', userController_1.deleteforme);
router.put('/cancelSoftDelete/:id', userController_1.cancelSoftDelete);
router.put('/updateforme/:id', userController_1.updateforme);
// router.get("/:Userid",getuserbyid)
// router.post("/", createUser)
// router.put("/:Userid",updateuser)
// router.get("/",getuser)
// router.delete("/:Userid",deleteuser)
exports.default = router;
//# sourceMappingURL=userRoutes.js.map