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
} from '../services/apioption';

export const ALL_OPTION = 'ทั้งหมด';

// ฟังก์ชันโหลดข้อมูลแบบ async
export const loadOptions = async () => {
  const [
    environmentOptions,
    serverTypeOptions,
    serverRoleOptions,
    serverDutyOptions,
    productionUnitOptions,
    developerUnitOptions,
    yesNoOptions,
    drDcOptions,
    developerTypeOptions
  ] = await Promise.all([
    getEnvironmentOptions(),
    getServerTypeOptions(),
    getServerRoleOptions(),
    getServerDutyOptions(),
    getProductionUnitOptions(),
    getDeveloperUnitOptions(),
    getYesNoOptions(),
    getDrDcOptions(),
    getDeveloperTypeOptions()
  ]);

  return {
    ENVIRONMENT_OPTIONS: environmentOptions.map(item => item.option),
    SERVER_TYPE_OPTIONS: serverTypeOptions.map(item => item.option),
    SERVER_ROLE_OPTIONS: serverRoleOptions.map(item => item.option),
    SERVER_DUTY_OPTIONS: serverDutyOptions.map(item => item.option),
    PRODUCTION_UNIT_OPTIONS: productionUnitOptions.map(item => item.option),
    DEVELOPER_UNIT: developerUnitOptions.map(item => item.option),
    YES_NO: yesNoOptions.map(item => item.option),
    DR_DC: drDcOptions.map(item => item.option),
    DEVELOPER_TYPE: developerTypeOptions.map(item => item.option),
  };
};

// Export individual option arrays
export const ENVIRONMENT_OPTIONS: string[] = [];
export const SERVER_TYPE_OPTIONS: string[] = [];
export const SERVER_ROLE_OPTIONS: string[] = [];
export const SERVER_DUTY_OPTIONS: string[] = [];
export const PRODUCTION_UNIT_OPTIONS: string[] = [];
export const DEVELOPER_UNIT: string[] = [];
export const YES_NO: string[] = [];
export const DR_DC: string[] = [];
export const DEVELOPER_TYPE: string[] = [];

// Initialize options
loadOptions().then(options => {
  Object.assign(ENVIRONMENT_OPTIONS, options.ENVIRONMENT_OPTIONS);
  Object.assign(SERVER_TYPE_OPTIONS, options.SERVER_TYPE_OPTIONS);
  Object.assign(SERVER_ROLE_OPTIONS, options.SERVER_ROLE_OPTIONS);
  Object.assign(SERVER_DUTY_OPTIONS, options.SERVER_DUTY_OPTIONS);
  Object.assign(PRODUCTION_UNIT_OPTIONS, options.PRODUCTION_UNIT_OPTIONS);
  Object.assign(DEVELOPER_UNIT, options.DEVELOPER_UNIT);
  Object.assign(YES_NO, options.YES_NO);
  Object.assign(DR_DC, options.DR_DC);
  Object.assign(DEVELOPER_TYPE, options.DEVELOPER_TYPE);
});
