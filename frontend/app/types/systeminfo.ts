export interface SystemInfo {
    id: number;
    systemName: string;
    developType: string;
    businessUnit: string;
    developUnit: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SystemData {
    id: number;
    systemName: string;
    developType: string;
    contractNo: string;
    vendorContactNo: string;
    businessUnit: string;
    developUnit: string | string[];
    computerbackup: string;
    environmentInfo: EnvironmentInfo[];
    connectionInfo: ConnectionInfo[];
    securityInfo: SecurityInfo[];
  }
  
  export interface EnvironmentInfo {
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
    productionUnit: string | string[];
  }
  
  export interface ConnectionInfo {
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
  }
  
  export interface SecurityInfo {
    urlWebsite: string;
    certificateExpireDate: string;
    backupPolicy: string;
    downtimeAllowed: string;
    centralizeLog: string;
    setupAgentPatch: string;
    internetFacing: string;
  }
  