// 

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
  productionUnit:  string[];// เปลี่ยนเป็นรับได้ทั้ง string และ array
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
export interface SystemData { //สำหรับสร้าง creat system
  id: string;
  systemName: string;
  developType: string;
  contractNo: string;
  vendorContactNo: string;
  businessUnit: string;
  developUnit: string ;
  computerbackup: string;
  environmentInfo: EnvironmentInfo[];
  connectionInfo: ConnectionInfo[];
  securityInfo: SecurityInfo[];
}

export interface FormData { //สำหรับสร้าง get มา
  systemName: string;
  developType: string;
  contractNo: string;
  vendorContactNo: string;
  businessUnit: string;
  developUnit: string;
  computerbackup: string;
  environmentInfo: EnvironmentInfo[];
  connectionInfo: ConnectionInfo[];
  securityInfo: SecurityInfo[];
}

export type SystemSearchParams = {
  systemName?: {
    equals: string;
  };
  developType?: {
    equals: string;
  };
  businessUnit?: {
    equals: string;
  };
  environmentInfo?: {
    some: {
      environment?: {
        equals: string;
      };
      serverName?: {
        equals: string;
      };
      ip?: {
        equals: string;
      };
    };
  };
};

// export interface CSVValidationResults {
//   row: number;
//   data: CSVRowData;
//   status: 'invalid' | 'incomplete' | 'update' | 'create';
//   errors: string[];
//   systemName: string;
// }

export interface HTMLInputEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    name: string;
    value: string;
  };
}

export interface HTMLSelectEvent extends React.ChangeEvent<HTMLSelectElement> {
  target: HTMLSelectElement & {
    name: string;
    value: string;
  };
}

export type FormChangeEvent = HTMLInputEvent | HTMLSelectEvent;

export interface ValidationErrors {
  [key: string]: string;

}


