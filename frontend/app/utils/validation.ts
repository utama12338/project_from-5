export interface ValidationErrors {
  [key: string]: string;

}

export interface FormData {
  systemName: string;
  developType: string;
  contractNo: string;
  vendorContactNo: string;
  businessUnit: string;
  developUnit: string | string[]; // Updated to accept both string and string array
  computerbackup: string;
  environmentInfo: Array<{
    environment: string;
    serverName: string;
    ip: string;
    serverType: string;
    serverRole: string;
    serverDuty: string;
    database: string;
    application: string;
    operatingSystem: string;
    servicePack: string;
    build: string;
    cpu: string;
    ram: string;
    disk: string;
    dr: string;
    joinDomain: string;
    windowsCluster: string;
    productionUnit: string | string[]; // Update this as well for consistency
  }>;
  connectionInfo: Array<{
    ad: string;
    adfs: string;
    dns: string;
    ntp: string;
    tpam: string;
    netka: string;
    fim: string;
    ftpServer: string;
    ftpGoAnywhereMFTServer: string;
    emailSmtp: string;
    sms: string;
    apiManagement: string;
    dv: string;
    snmp: string;
  }>;
  securityInfo: Array<{
    urlWebsite: string;
    certificateExpireDate: string;
    backupPolicy: string;
    downtimeAllowed: string;
  }>;
}

export const validateForm = (step: number, formData: FormData): ValidationErrors => {
  const newErrors: ValidationErrors = {};

  // Add null check for formData
  if (!formData) {
    return { form: 'Form data is undefined' };
  }

  // Validate Step 1: Basic Info
  if (step === 1) {
    if (!formData.systemName?.trim()) {
      newErrors.systemName = 'กรุณากรอกชื่อระบบ';
    }
    if (!formData.developType) {
      newErrors.developType = 'กรุณาเลือกประเภทการพัฒนา';
    }
    if (!formData.contractNo?.trim()) {
      newErrors.contractNo = 'กรุณากรอกเลขที่สัญญา';
    }
    if (!formData.vendorContactNo?.trim()) {
      newErrors.vendorContactNo = 'กรุณากรอกข้อมูลบริษัทคู่สัญญา';
    }
    if (!formData.businessUnit?.trim()) {
      newErrors.businessUnit = 'กรุณากรอกหน่วยงานเจ้าของระบบงาน';
    }
    if (!formData.developUnit) {
      newErrors.developUnit = 'กรุณาเลือกผู้รับผิดชอบ';
    }
    if (!formData.computerbackup) {
      newErrors.computerbackup = 'กรุณาเลือกสถานะ Computer Backup';
    }
  }

  // Validate Step 2: Environment Info
  if (step === 2) {
    formData.environmentInfo.forEach((env, index) => {
      if (!env.environment.trim()) {
        newErrors[`environment-${index}`] = 'กรุณากรอก Environment';
      }
      if (!env.serverName.trim()) {
        newErrors[`serverName-${index}`] = 'กรุณากรอก Server Name';
      }
      if (!env.serverType.trim()) {
        newErrors[`serverType-${index}`] = 'กรุณาเลือก Server Type';
      }
      if (!env.serverRole.trim()) {
        newErrors[`serverRole-${index}`] = 'กรุณาเลือก Server Role';
      }
      if (!env.serverDuty.trim()) {
        newErrors[`serverDuty-${index}`] = 'กรุณาเลือก Server Duty';
      }
      if (!env.database.trim()) {
        newErrors[`database-${index}`] = 'กรุณากรอก Database';
      }
      if (!env.application.trim()) {
        newErrors[`application-${index}`] = 'กรุณากรอก Application';
      }
      if (!env.operatingSystem.trim()) {
        newErrors[`operatingSystem-${index}`] = 'กรุณากรอก Operating System';
      }
      if (!env.servicePack.trim()) {
        newErrors[`servicePack-${index}`] = 'กรุณากรอก Service Pack';
      }
      if (!env.build.trim()) {
        newErrors[`build-${index}`] = 'กรุณากรอก Build';
      }
      if (!env.cpu.trim()) {
        newErrors[`cpu-${index}`] = 'กรุณากรอก CPU';
      }
      if (!env.ram.trim()) {
        newErrors[`ram-${index}`] = 'กรุณากรอก RAM';
      }
      if (!env.disk.trim()) {
        newErrors[`disk-${index}`] = 'กรุณากรอก Disk';
      }
      if (!env.dr.trim()) {
        newErrors[`dr-${index}`] = 'กรุณาเลือก DR';
      }
      if (!env.joinDomain.trim()) {
        newErrors[`joinDomain-${index}`] = 'กรุณาเลือก Join Domain';
      }
      if (!env.windowsCluster.trim()) {
        newErrors[`windowsCluster-${index}`] = 'กรุณาเลือก Windows Cluster';
      }
      if (!env.productionUnit || env.productionUnit.length === 0) {
        newErrors[`productionUnit-${index}`] = 'กรุณาเลือก Production Unit อย่างน้อย 1 รายการ';
      }
      if (!env.ip.trim()) {
        newErrors[`ip-${index}`] = 'กรุณากรอก IP Address';
      } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(env.ip)) {
        newErrors[`ip-${index}`] = 'รูปแบบ IP Address ไม่ถูกต้อง';
      }
    });
  }

  // Validate Step 4: Security Info
  if (step === 4) {
    formData.securityInfo.forEach((security, index) => {
      if (!security.urlWebsite.trim()) {
        newErrors[`urlWebsite-${index}`] = 'กรุณากรอก URL Website';
      } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(security.urlWebsite)) {
        newErrors[`urlWebsite-${index}`] = 'รูปแบบ URL ไม่ถูกต้อง';
      }
      if (!security.certificateExpireDate) {
        newErrors[`certificateExpireDate-${index}`] = 'กรุณาเลือกวันที่หมดอายุ Certificate';
      }
      if (!security.backupPolicy.trim()) {
        newErrors[`backupPolicy-${index}`] = 'กรุณากรอก Backup Policy';
      }
      if (!security.downtimeAllowed.trim()) {
        newErrors[`downtimeAllowed-${index}`] = 'กรุณากรอก Downtime Allowed';
      }
    });
  }

  return newErrors;
};
