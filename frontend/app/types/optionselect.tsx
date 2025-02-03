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

export let ENVIRONMENT_OPTIONS = await getEnvironmentOptions().then(data => data.map(item => item.option));
export let SERVER_TYPE_OPTIONS = await getServerTypeOptions().then(data => data.map(item => item.option));
export let SERVER_ROLE_OPTIONS = await getServerRoleOptions().then(data => data.map(item => item.option));
export let SERVER_DUTY_OPTIONS = await getServerDutyOptions().then(data => data.map(item => item.option));
export let PRODUCTION_UNIT_OPTIONS = await getProductionUnitOptions().then(data => data.map(item => item.option));
export let DEVELOPER_UNIT = await getDeveloperUnitOptions().then(data => data.map(item => item.option));
export let YES_NO = await getYesNoOptions().then(data => data.map(item => item.option));
export let DR_DC = await getDrDcOptions().then(data => data.map(item => item.option));
export let DEVELOPER_TYPE = await getDeveloperTypeOptions().then(data => data.map(item => item.option));

export const ALL_OPTION = 'ทั้งหมด';