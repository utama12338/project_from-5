import {
  ENVIRONMENT_OPTIONS,
  SERVER_TYPE_OPTIONS,
  SERVER_ROLE_OPTIONS,
  SERVER_DUTY_OPTIONS,
  PRODUCTION_UNIT_OPTIONS,
  DEVELOPER_UNIT,
  YES_NO,
  DR_DC,
  DEVELOPER_TYPE
} from '../types/optionselect';


export const SYSTEM_LABELS = {
  systemName: "ชื่อระบบ systemname",
  developType: "ประเภทการพัฒนา",
  contractNo: "เลขที่สัญญา Contract number", 
  vendorContactNo: "การติดต่อ vendor",
  businessUnit: "หน่วยธุรกิจ business unit",
  developUnit: "หน่วยพัฒนา Development unit",
  computerBackup: "คอมพิวเตอร์สำรอง Computer Backup"
};

export const ENVIRONMENT_LABELS = {
  environment: "Environment",
  serverName: "Server Name",
  ip: "IP",
  serverType: "Server Type",
  serverRole: "Server Role",
  serverDuty: "Server Duty",
  database: "ฐานข้อมูล Database",
  application: "แอปพลิเคชัน application",
  operatingSystem: "ระบบปฏิบัติการ operation system",
  servicePack: "Service Pack",
  build: "Build",
  cpu: "CPU",
  ram: "RAM",
  disk: "Disk",
  dr: "DR",
  joinDomain: "Join Domain",
  windowsCluster: "Windows Cluster",
  productionUnit: "หน่วยงานที่ดูแล"
};

export const CONNECTION_LABELS = {
  ad: "AD",
  dns: "DNS",
  tpam: "TPAM",
  fim: "FIM",
  ftpServer: "FTP Server",
  emailSmtp: "Email SMTP",
  apiManagement: "API Management",
  snmp: "SNMP",
  adfs: "ADFS",
  ntp: "NTP",
  netka: "Netka",
  ftpGoAnywhereMFTServer: "FTP GoAnywhere MFT Server",
  sms: "SMS",
  dv: "DV"
};

export const SECURITY_LABELS = {
  urlWebsite: "URL Website",
  certificateExpireDate: "Certificate Expire Date",
  backupPolicy: "Backup Policy",
  downtimeAllowed: "Downtime Allowed",
  centralizeLog: "Centralize Log",
  setupAgentPatch: "Setup Agent Patch",
  internetFacing: "Internet Facing"
};

export const FILTER_LABELS = {
  searchPlaceholder: "ค้นหาตามชื่อเซิร์ฟเวอร์, IP หรือ Role",
  environmentFilter: "กรองตาม Environment",
  serverTypeFilter: "กรองตามประเภทเซิร์ฟเวอร์",
  resultsFound: "พบ",
  machinesOf: "เครื่อง จากทั้งหมด",
  machines: "เครื่อง",
  search: "ค้นหา",
  environment: "Environment",
  serverType: "Server Type"
};

export const BUTTON_LABELS = {
  share: "แชร์",
  save: "บันทึก",
  delete: "ลบ",
  showMore: "แสดงรายละเอียดเพิ่มเติม",
  add: "เพิ่ม",
  back: "ย้ายกลับ",
  next: "ถัดไป"
};

export const ERROR_MESSAGES = {
  noResults: {
    title: "ไม่พบข้อมูลที่ค้นหา",
    suggestion: "ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองใหม่"
  }
};
