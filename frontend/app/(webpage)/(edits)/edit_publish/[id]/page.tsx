'use client'
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Save,Plus } from 'lucide-react';
import { useParams,useRouter } from 'next/navigation';
import axios from 'axios';

const ENVIRONMENT_OPTIONS = ['DEV', 'SIT', 'UAT', 'PreProd', 'Prod'];
const SERVER_TYPE_OPTIONS = [
  'Physics',
  'Network Device',
  'WorkStation PC',
  'Laptop',
  'Virtualize Environment',
  'Container'
];
const SERVER_ROLE_OPTIONS = [
  'Database Server',
  'Application Server',
  'Web Server'
];
const SERVER_DUTY_OPTIONS = [
  'Web Frontend',
  'Service Web Backend',
  'Backup Server',
  'Database Server',
  'Server Fileshare',
  'Log Server',
  'Gateway Server'
];
const PRODUCTION_UNIT_OPTIONS = [
  'หน่วยโปรแกรมระบบ',
  'หน่วยระบบงานคอมพิวเตอร์ 1',
  'หน่วยระบบฐานข้อมูล',
  'หน่วยระบบงานคอมพิวเตอร์ 2',
  'หน่วยระบบงานคอมพิวเตอร์ 3',
  'หน่วยระบบสนับสนุนนโยบายรัฐ',
  'หน่วยระบบสนับสนุนงานธุรกิจ'
];

interface SystemData {
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

interface EnvironmentInfo {
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
  productionUnit: string | string[]; // เปลี่ยนเป็นรับได้ทั้ง string และ array
}

interface ConnectionInfo {
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

interface SecurityInfo {
  urlWebsite: string;
  certificateExpireDate: string;
  backupPolicy: string;
  downtimeAllowed: string;
  centralizeLog: string;
  setupAgentPatch: string;
  internetFacing: string;
}

const defaultSystemData: SystemData = {
  id: 0,
  systemName: '',
  developType: '',
  contractNo: '',
  vendorContactNo: '',
  businessUnit: '',
  developUnit: '',
  computerbackup: '',
  environmentInfo: [{
    environment: '',
    serverName: '',
    ip: '',
    serverType: '',
    serverRole: '',
    serverDuty: '',
    database: '',
    application: '',
    operatingSystem: '',
    servicePack: '',
    build: '',
    cpu: '',
    ram: '',
    disk: '',
    dr: '',
    joinDomain: '',
    windowsCluster: '',
    productionUnit: ''
  }],
  connectionInfo: [{
    ad: '',
    adfs: '',
    dns: '',
    ntp: '',
    tpam: '',
    netka: '',
    fim: '',
    ftpServer: '',
    ftpGoAnywhereMFTServer: '',
    emailSmtp: '',
    sms: '',
    apiManagement: '',
    dv: '',
    snmp: ''
  }],
  securityInfo: [{
    urlWebsite: '',
    certificateExpireDate: '',
    backupPolicy: '',
    downtimeAllowed: '',
    centralizeLog: '',
    setupAgentPatch: '',
    internetFacing: ''
  }]
};

const tabs = [
  { id: 'system', label: 'ข้อมูลระบบ' },
  { id: 'environment', label: 'สภาพแวดล้อม' },
  { id: 'connection', label: 'การเชื่อมต่อ' },
  { id: 'security', label: 'ความปลอดภัย' }
];

const FormField = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange?: (value: string) => void;
 
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input 
      type="text"
      className="w-full rounded-md border border-gray-300 shadow-sm p-2 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 hover:border-gray-400 transition-colors"
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  </div>
);
// option
interface FormFieldOptionProps {
  label: string;
  value: string | string[];
  onChange?: (value: string | string[]) => void;
  options: string[];
  multiple?: boolean;
}

const FormFieldOption = ({
  label,
  value,
  onChange,
  options,
  multiple = false
}: FormFieldOptionProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {multiple ? (
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
        {options.map((option) => {
          const isSelected = Array.isArray(value) 
            ? value.includes(option)
            : typeof value === 'string' 
              ? value.split(',').includes(option)
              : false;

          return (
            <div key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${label}-${option}`}
                checked={isSelected}
                onChange={(e) => {
                  if (onChange) {
                    const currentValues = Array.isArray(value) 
                      ? value 
                      : typeof value === 'string'
                        ? value.split(',').filter(Boolean)
                        : [];
                    
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    
                    onChange(newValues);
                  }
                }}
                className="h-4 w-4 focus:ring-indigo-500 border-gray-300 rounded text-indigo-600"
              />
              <label htmlFor={`${label}-${option}`} className="text-sm text-gray-700">
                {option}
              </label>
            </div>
          );
        })}
      </div>
    ) : (
      <select
        className="w-full rounded-md border border-gray-300 shadow-sm p-2 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   hover:border-gray-400 transition-colors"
        value={value as string}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    )}
  </div>
);


// option
const updateArrayItemField = (array: any[], index: number, field: string, value: string | string[]) => {
  return array.map((item, i) => {
    if (i === index) {
      const finalValue = Array.isArray(value) ? value.join(',') : value;
      return { ...item, [field]: finalValue };
    }
    return item;
  });
};

export default function EditSystem() {
  const [activeTab, setActiveTab] = useState('system');
  const [systemData, setSystemData] = useState<SystemData>(defaultSystemData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); 
  const router = useRouter();
  

  
  const fetchSystemData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/from/getSystemById/${id}`);
      console.log('Fetched data:', response.data);
      setSystemData(response.data);
      setError(null);
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
      setError(
        axios.isAxiosError(error) && error.response 
          ? error.response.data.message 
          : 'ไม่สามารถโหลดข้อมูลได้'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  // ...existing code...

  useEffect(() => {
    fetchSystemData();
  }, [id, fetchSystemData]);

  const handleShare = () => {
    const url = `${window.location.origin}/system/${id}`;
    navigator.clipboard.writeText(url);
    alert('ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว');
  };

  const handleSave = async () => {
    try {
      console.log('ข้อมูลที่ส่งไป:', systemData);
      
      const response = await axios.put(`http://localhost:4000/from/updateforme/${id}`, systemData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // ตรวจสอบว่า response มีสถานะ 200
      if (response.status === 200) {
        console.log('Response จาก API:', response);
        alert('บันทึกข้อมูลสำเร็จ');
        
        // หลังจากบันทึกสำเร็จให้ทำการนำทาง
        
        return router.push('/frome');
      } else {
        throw new Error('ไม่สามารถบันทึกข้อมูลได้');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };
  
  

  const updateSystemField = (field: keyof SystemData, value: string | string[]) => {
    setSystemData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateEnvironmentInfo = (index: number, field: keyof EnvironmentInfo, value: string | string[]) => {
    setSystemData(prev => ({
      ...prev,
      environmentInfo: prev.environmentInfo.map((item, i) => {
        if (i === index) {
          // เก็บค่า array โดยตรงสำหรับ productionUnit
          if (field === 'productionUnit') {
            return { ...item, [field]: value };
          }
          // สำหรับฟิลด์อื่นๆ ยังคงใช้การแปลงเป็น string
          const finalValue = Array.isArray(value) ? value.join(',') : value;
          return { ...item, [field]: finalValue };
        }
        return item;
      })
    }));
  };

  const updateConnectionInfo = (index: number, field: keyof ConnectionInfo, value: string | string[]) => {
    setSystemData(prev => ({
      ...prev,
      connectionInfo: updateArrayItemField(prev.connectionInfo, index, field, value)
    }));
  };

  const updateSecurityInfo = (index: number, field: keyof SecurityInfo, value: string | string[]) => {
    setSystemData(prev => ({
      ...prev,
      securityInfo: updateArrayItemField(prev.securityInfo, index, field, value)
    }));
  };

  const addEnvironmentInfo = () => {
    setSystemData(prev => ({
      ...prev,
      environmentInfo: [...prev.environmentInfo, {
        environment: '',
        serverName: '',
        ip: '',
        serverType: '',
        serverRole: '',
        serverDuty: '',
        database: '',
        application: '',
        operatingSystem: '',
        servicePack: '',
        build: '',
        cpu: '',
        ram: '',
        disk: '',
        dr: '',
        joinDomain: '',
        windowsCluster: '',
        productionUnit: ''
      }]
    }));
  };

  const removeEnvironmentInfo = (index: number) => {
    setSystemData(prev => ({
      ...prev,
      environmentInfo: prev.environmentInfo.filter((_, i) => i !== index)
    }));
  };

  const addConnectionInfo = () => {
    setSystemData(prev => ({
      ...prev,
      connectionInfo: [...prev.connectionInfo, {
        ad: '',
        adfs: '',
        dns: '',
        ntp: '',
        tpam: '',
        netka: '',
        fim: '',
        ftpServer: '',
        ftpGoAnywhereMFTServer: '',
        emailSmtp: '',
        sms: '',
        apiManagement: '',
        dv: '',
        snmp: ''
      }]
    }));
  };

  const removeConnectionInfo = (index: number) => {
    setSystemData(prev => ({
      ...prev,
      connectionInfo: prev.connectionInfo.filter((_, i) => i !== index)
    }));
  };

  const addSecurityInfo = () => {
    setSystemData(prev => ({
      ...prev,
      securityInfo: [...prev.securityInfo, {
        urlWebsite: '',
        certificateExpireDate: '',
        backupPolicy: '',
        downtimeAllowed: '',
        centralizeLog: '',
        setupAgentPatch: '',
        internetFacing: ''
      }]
    }));
  };

  const removeSecurityInfo = (index: number) => {
    setSystemData(prev => ({
      ...prev,
      securityInfo: prev.securityInfo.filter((_, i) => i !== index)
    }));
  };

const renderSystemInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField 
        label="ชื่อระบบ" 
        value={systemData.systemName} 
        onChange={(value) => updateSystemField('systemName', value)}
      />
      <FormFieldOption 
        label="ประเภทการพัฒนา" 
        value={systemData.developType} 
        onChange={(value) => updateSystemField('developType', value)}
        options={['IN HOUSE', 'OUTSOURCE']} // Ensure options are correctly passed
      />
      <FormField 
        label="เลขที่สัญญา" 
        value={systemData.contractNo} 
        onChange={(value) => updateSystemField('contractNo', value)}
      />
      <FormField 
        label="เลขที่ติดต่อผู้ขาย" 
        value={systemData.vendorContactNo} 
        onChange={(value) => updateSystemField('vendorContactNo', value)}
      />
      <FormField 
        label="หน่วยธุรกิจ" 
        value={systemData.businessUnit} 
        onChange={(value) => updateSystemField('businessUnit', value)}
      />
      <FormFieldOption
        label="หน่วยพัฒนา" 
        value={systemData.developUnit} 
        onChange={(value) => {
          const finalValue = Array.isArray(value) ? value.join(',') : value;
          updateSystemField('developUnit', finalValue);
        }}
        options={['ฝรล.', 'ส่วนระบบงานสนับสนุน','ระบบสนับสนุนนโยบายรัฐ','ธนรัตน์ เกรอด']}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* ...existing fields... */}
    <FormFieldOption
      label="Computer Backup"
      value={systemData.computerbackup}
      onChange={(value) => updateSystemField('computerbackup', value)}
      options={['YES', 'NO']}
    />
  </div>
      {/* <FormField 
        label="สถานะ" 
        value={systemData.draftStatus} 
        onChange={(value) => updateSystemField('draftStatus', value)}
      /> */}
    </div>
);

const renderEnvironmentInfo = () => (
    <div className="space-y-8">
      {systemData.environmentInfo.map((env, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-6 text-center text-gray-800">
            สภาพแวดล้อม {index + 1}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFieldOption
              label="Environment"
              value={env.environment}
              onChange={(value) => updateEnvironmentInfo(index, 'environment', value)}
              options={ENVIRONMENT_OPTIONS}
            />
            <FormField 
              label="Server Name" 
              value={env.serverName}
              onChange={(value) => updateEnvironmentInfo(index, 'serverName', value)}
            />
            <FormField 
              label="IP" 
              value={env.ip}
              onChange={(value) => updateEnvironmentInfo(index, 'ip', value)}
            />
            <FormFieldOption
              label="Server Type"
              value={env.serverType}
              onChange={(value) => updateEnvironmentInfo(index, 'serverType', value)}
              options={SERVER_TYPE_OPTIONS}
            />
            <FormFieldOption
              label="Server Role"
              value={env.serverRole}
              onChange={(value) => updateEnvironmentInfo(index, 'serverRole', value)}
              options={SERVER_ROLE_OPTIONS}
            />
            <FormFieldOption
              label="Server Duty"
              value={env.serverDuty}
              onChange={(value) => updateEnvironmentInfo(index, 'serverDuty', value)}
              options={SERVER_DUTY_OPTIONS}
            />
            <FormField 
              label="ฐานข้อมูล" 
              value={env.database}
              onChange={(value) => updateEnvironmentInfo(index, 'database', value)}
            />
              <FormField 
              label="แอปพลิเคชัน" 
              value={env.application}
              onChange={(value) => updateEnvironmentInfo(index, 'application', value)}
            />
              <FormField 
              label="ระบบปฏิบัติการ" 
              value={env.operatingSystem}
              onChange={(value) => updateEnvironmentInfo(index, 'operatingSystem', value)}
            />
               <FormField 
              label="Service Pack" 
              value={env.servicePack}
              onChange={(value) => updateEnvironmentInfo(index, 'servicePack', value)}
            />
               <FormField 
              label="Build" 
              value={env.build}
              onChange={(value) => updateEnvironmentInfo(index, 'build', value)}
            />
                <FormField 
              label="CPU" 
              value={env.cpu}
              onChange={(value) => updateEnvironmentInfo(index, 'cpu', value)}
            />
               <FormField 
              label="RAM" 
              value={env.ram}
              onChange={(value) => updateEnvironmentInfo(index, 'ram', value)}
            />
                <FormField 
              label="Disk" 
              value={env.disk}
              onChange={(value) => updateEnvironmentInfo(index, 'disk', value)}
            />

            <FormFieldOption
              label="DR"
              value={env.dr}
              onChange={(value) => updateEnvironmentInfo(index, 'dr', value)}
              options={['DR', 'DC']}
            />
            <FormFieldOption
              label="Join Domain"
              value={env.joinDomain}
              onChange={(value) => updateEnvironmentInfo(index, 'joinDomain', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption
              label="Windows Cluster"
              value={env.windowsCluster}
              onChange={(value) => updateEnvironmentInfo(index, 'windowsCluster', value)}
              options={['YES', 'NO']}
            />
                        <FormFieldOption
              label="Production Unit"
              value={Array.isArray(env.productionUnit) 
                ? env.productionUnit 
                : env.productionUnit.split(',').filter(Boolean)}
              onChange={(value) => {
                // ส่งค่าเป็น array โดยตรง ไม่ต้องแปลงเป็น string
                updateEnvironmentInfo(index, 'productionUnit', value);
              }}
              options={PRODUCTION_UNIT_OPTIONS}
              multiple={true}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => removeEnvironmentInfo(index)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              ลบ
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-end mt-4">
      <button
        onClick={addEnvironmentInfo}
         className="flex items-center justify-center w-full py-2 mb-4 bg-blue-100
            hover:bg-blue-200 rounded-md focus:outline-none"
        >
          <Plus className="w-5 h-5 text-blue-600" />
        </button>
      </div>
    </div>
);

const renderConnectionInfo = () => (
    <div className="space-y-8">
      {systemData.connectionInfo.map((conn, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-6 text-center text-gray-800">
            ข้อมูลการเชื่อมต่อ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFieldOption
              label="AD" 
              value={conn.ad}
              onChange={(value) => updateConnectionInfo(index, 'ad', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="DNS" 
              value={conn.dns}
              onChange={(value) => updateConnectionInfo(index, 'dns', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="TPAM" 
              value={conn.tpam}
              onChange={(value) => updateConnectionInfo(index, 'tpam', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="FIM" 
              value={conn.fim}
              onChange={(value) => updateConnectionInfo(index, 'fim', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="FTP Server" 
              value={conn.ftpServer}
              onChange={(value) => updateConnectionInfo(index, 'ftpServer', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="Email SMTP" 
              value={conn.emailSmtp}
              onChange={(value) => updateConnectionInfo(index, 'emailSmtp', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="API Management" 
              value={conn.apiManagement}
              onChange={(value) => updateConnectionInfo(index, 'apiManagement', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="SNMP" 
              value={conn.snmp}
              onChange={(value) => updateConnectionInfo(index, 'snmp', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="ADFS" 
              value={conn.adfs}
              onChange={(value) => updateConnectionInfo(index, 'adfs', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="NTP" 
              value={conn.ntp}
              onChange={(value) => updateConnectionInfo(index, 'ntp', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="Netka" 
              value={conn.netka}
              onChange={(value) => updateConnectionInfo(index, 'netka', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="FTP GoAnywhere MFT Server" 
              value={conn.ftpGoAnywhereMFTServer}
              onChange={(value) => updateConnectionInfo(index, 'ftpGoAnywhereMFTServer', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="SMS" 
              value={conn.sms}
              onChange={(value) => updateConnectionInfo(index, 'sms', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption 
              label="DV" 
              value={conn.dv}
              onChange={(value) => updateConnectionInfo(index, 'dv', value)}
              options={['YES', 'NO']}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => removeConnectionInfo(index)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              ลบ
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-end mt-4">
      <button
        onClick={addConnectionInfo}
         className="flex items-center justify-center w-full py-2 mb-4 bg-blue-100
            hover:bg-blue-200 rounded-md focus:outline-none"
        >
          <Plus className="w-5 h-5 text-blue-600" />
        </button>
      </div>
    </div>
);

const renderSecurityInfo = () => (
    <div className="space-y-6">
      {systemData.securityInfo.map((security, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-6 text-center text-gray-800">
            ข้อมูลความปลอดภัย
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              label="URL Website" 
              value={security.urlWebsite}
              onChange={(value) => updateSecurityInfo(index, 'urlWebsite', value)}
            />
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={security.certificateExpireDate}
              onChange={(e) => updateSecurityInfo(index, 'certificateExpireDate', e.target.value)}
            />
            <FormField 
              label="Backup Policy" 
              value={security.backupPolicy}
              onChange={(value) => updateSecurityInfo(index, 'backupPolicy', value)}
            />
            <FormField 
              label="Downtime Allowed" 
              value={security.downtimeAllowed}
              onChange={(value) => updateSecurityInfo(index, 'downtimeAllowed', value)}
            />
            <FormFieldOption
              label="Centralize Log"
              value={security.centralizeLog}
              onChange={(value) => updateSecurityInfo(index, 'centralizeLog', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption
              label="Setup Agent Patch"
              value={security.setupAgentPatch}
              onChange={(value) => updateSecurityInfo(index, 'setupAgentPatch', value)}
              options={['YES', 'NO']}
            />
            <FormFieldOption
              label="Internet Facing"
              value={security.internetFacing}
              onChange={(value) => updateSecurityInfo(index, 'internetFacing', value)}
              options={['YES', 'NO']}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => removeSecurityInfo(index)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              ลบ
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-end mt-4">
      <button
        onClick={addSecurityInfo}
         className="flex items-center justify-center w-full py-2 mb-4 bg-blue-100
            hover:bg-blue-200 rounded-md focus:outline-none"
        >
          <Plus className="w-5 h-5 text-blue-600" />
        </button>
      </div>
    </div>
);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">แก้ไขระบบ</h1>
        <div className="space-x-4">
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md
                     hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <Share2 className="w-4 h-4 mr-2" />
            แชร์
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Save className="w-4 h-4 mr-2" />
            บันทึก
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          กำลังโหลด...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    focus:outline-none`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <AnimatePresence>
            {activeTab === 'system' && (
              <motion.div 
              key="system"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              >
                {renderSystemInfo()}
              </motion.div>
            )}
            {activeTab === 'environment' && (
               <motion.div 
               key="environment"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               transition={{ duration: 0.2 }}
              >
                {renderEnvironmentInfo()}
              </motion.div>
            )}
            {activeTab === 'connection' && (
              <motion.div
              key="connection"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               transition={{ duration: 0.2 }}
              >
                {renderConnectionInfo()}
              </motion.div>
            )}
            {activeTab === 'security' && (
               <motion.div
               key="security"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               transition={{ duration: 0.2 }}
              >
                {renderSecurityInfo()}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}