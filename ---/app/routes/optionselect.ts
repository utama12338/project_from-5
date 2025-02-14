import  Router  from 'express';
import cors from 'cors'; // นำเข้า cors
import {
    getEnvironmentOptions,
    getServerTypeOptions,
    getServerRoleOptions,
    getServerDutyOptions,
    getProductionUnitOptions,
    getDeveloperUnitOptions,
    getYesNoOptions,
    getDrDcOptions,
    getDeveloperTypeOptions
} from '../controllers/optionselect';
const optionRoutes = Router();
optionRoutes.use(cors()); //ใช้ cors สำหรับให้ prot อื่นเข้าถึง api ได้



optionRoutes.get('/environment', getEnvironmentOptions);
optionRoutes.get('/server-type', getServerTypeOptions);
optionRoutes.get('/server-role', getServerRoleOptions);
optionRoutes.get('/server-duty', getServerDutyOptions);
optionRoutes.get('/production-unit', getProductionUnitOptions);
optionRoutes.get('/developer-unit', getDeveloperUnitOptions);
optionRoutes.get('/yes-no', getYesNoOptions);
optionRoutes.get('/dr-dc', getDrDcOptions);
optionRoutes.get('/developer-type', getDeveloperTypeOptions);

export default optionRoutes;
