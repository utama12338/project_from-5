"use client"
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Save, Plus, Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import StyledWrapper from '../../../../components/neoninput';
import ModernDropdown from '../../../../components/ModernDropdown';
import CustomDatePicker from '../../../../components/CustomDatePicker';
import Checkbox3d from '../../../../components/checkbox3d';
import { api } from '../../../../services/api';
import { validateForm, ValidationErrors } from '../../../../utils/validation';
import Swal from 'sweetalert2';
import { colors, shadows, transitions,line } from '../../../../styles/theme';

import Agenda from '@/components/itemweb/edit_publish/agenda';
import {ENVIRONMENT_OPTIONS,
  SERVER_TYPE_OPTIONS,
  SERVER_ROLE_OPTIONS,
  SERVER_DUTY_OPTIONS,
  PRODUCTION_UNIT_OPTIONS,
  DEVELOPER_UNIT,
  YES_NO,
  DR_DC,
  DEVELOPER_TYPE
}from '@/types/optionselect';
import {SystemData,EnvironmentInfo,ConnectionInfo,SecurityInfo}from'@/types/inputform'



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


const FormField = ({ 
  label, 
  value, 
  onChange,
  error 
}: { 
  label: string; 
  value: string; 
  onChange?: (value: string) => void;
  error?: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-100 mb-2">{label}</label>
    <StyledWrapper>
      <input 
        type="text"
        className={`w-full rounded-md border-none bg-transparent text-white p-2 
                focus:ring-2 focus:ring-pink-500 
                hover:border-gray-400 transition-colors
                ${error ? 'border-red-500 ring-1 ring-red-500' : ''}`}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </StyledWrapper>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

interface FormFieldOptionProps {
  label: string;
  value: string | string[];
  onChange?: (value: string | string[]) => void;
  options: string[];
  multiple?: boolean;
  error?: string;
  required?: boolean;
}

const FormFieldOption = ({
  label,
  value,
  onChange,
  options,
  multiple = false,
  error
}: FormFieldOptionProps & { error?: string }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-100 mb-2">{label}</label>
    {multiple ? (
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded-md bg-[rgb(32,32,31)]">
        {options.map((option) => (
          <Checkbox3d key={option}>
            <label className="container flex items-center space-x-2">
              <input
                type="checkbox"
                checked={Array.isArray(value) ? value.includes(option) : value.split(',').includes(option)}
                onChange={(e) => {
                  if (onChange) {
                    const currentValues = Array.isArray(value) 
                      ? value 
                      : value.split(',').filter(Boolean);
                    
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    
                    onChange(newValues);
                  }
                }}
              />
              <svg viewBox="0 0 64 64" height="24" width="24">
                <path d="M 0 16 V 56 A 8 8 0 0 0 8 64 H 56 A 8 8 0 0 0 64 56 V 8 A 8 8 0 0 0 56 0 H 8 A 8 8 0 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 0 0 0 56 0 H 8 A 8 8 0 0 0 0 8 V 16" className="path"/>
              </svg>
              <span className="text-sm text-gray-100 ml-2">{option}</span>
            </label>
          </Checkbox3d>
        ))}
      </div>
    ) : (
      <ModernDropdown
        options={options}
        value={value as string}
        onChange={(value) => onChange?.(value)}

        // label={label} label ที่ซ้ำซ้อนออก
        required
        placeholder={`Select ${label}`}
      />
    )}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const updateArrayItemField = <T extends Record<string, any>>(
  array: T[],
  index: number,
  field: keyof T,
  value: string | string[]
): T[] => {
  return array.map((item, i) => {
    if (i === index) {
      if (field === 'developUnit' || field === 'businessUnit') {
        return { ...item, [field]: value };
      }
      const finalValue = Array.isArray(value) ? value.join(',') : value;
      return { ...item, [field]: finalValue } as T;
    }
    return item;
  });
};

const FormContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{ 
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    boxShadow: shadows.primary,
    transition: transitions.default
  }} className="p-6 rounded-lg">
    {children}
  </div>
);

// Add new interfaces for filtering
interface FilterOptions {
  environment: string;
  serverType: string;
  searchTerm: string;
}

export default function EditSystem() {
  const [activeTab, setActiveTab] = useState('system');
  const [systemData, setSystemData] = useState<SystemData>(defaultSystemData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { id } = useParams(); 
  const router = useRouter();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    environment: '',
    serverType: '',
    searchTerm: ''
  });
  const [filteredIndexes, setFilteredIndexes] = useState<number[]>([]);
  
  const fetchSystemData = useCallback(async () => {
    try {
      // Convert string id to number
      const numericId = parseInt(id as string, 10);
      const data = await api.getSystemById(numericId);
      console.log('Fetched data:', data);
      setSystemData(data);
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
      // Validate all sections at once
      let allErrors = {};
      
      // Validate System Info (Step 1)
      const systemErrors = validateForm(1, systemData);
      // Validate Environment Info (Step 2)
      const environmentErrors = validateForm(2, systemData);
      // Validate Connection Info (Step 3)
      const connectionErrors = validateForm(3, systemData);
      // Validate Security Info (Step 4)
      const securityErrors = validateForm(4, systemData);

      // Combine all errors
      allErrors = {
        ...systemErrors,
        ...environmentErrors,
        ...connectionErrors,
        ...securityErrors
      };

      setErrors(allErrors);

      if (Object.keys(allErrors).length > 0) {
        // Group errors by section for better user feedback
        const errorSections = [];
        if (Object.keys(systemErrors).length > 0) errorSections.push('ข้อมูลระบบ');
        if (Object.keys(environmentErrors).length > 0) errorSections.push('สภาพแวดล้อม');
        if (Object.keys(connectionErrors).length > 0) errorSections.push('การเชื่อมต่อ');
        if (Object.keys(securityErrors).length > 0) errorSections.push('ความปลอดภัย');

        // Show error message with sections that need attention
        Swal.fire({
          title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          html: `กรุณาตรวจสอบข้อมูลในส่วน:<br>${errorSections.join('<br>')}`,
          icon: 'warning',
          confirmButtonText: 'ตกลง'
        });
        return;
      }

      // If validation passes, proceed with save
      const numericId = parseInt(id as string, 10);
      await api.updateSystem(numericId, systemData);
      
      Swal.fire({
        title: 'บันทึกสำเร็จ!',
        text: 'ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });
      
      return router.push('/form');
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
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
          if (field === 'productionUnit') {
            return { ...item, [field]: value };
          }
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
      }],
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
      }],
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

  const removeEnvironmentInfo = (index: number) => {
    setSystemData(prev => ({
      ...prev,
      environmentInfo: prev.environmentInfo.filter((_, i) => i !== index),
      connectionInfo: prev.connectionInfo.filter((_, i) => i !== index),
      securityInfo: prev.securityInfo.filter((_, i) => i !== index)
    }));
  };

  // แยก filter logic ออกมา
  const filterEnvironments = useCallback((environments: EnvironmentInfo[]) => {
    return environments.filter((env) => {
      const matchesSearch = 
        env.serverName.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) ||
        env.ip.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) ||
        env.application.toLowerCase().includes(filterOptions.searchTerm.toLowerCase());
      
      const matchesEnvironment = 
        !filterOptions.environment || env.environment === filterOptions.environment;
      
      const matchesServerType = 
        !filterOptions.serverType || env.serverType === filterOptions.serverType;

      return matchesSearch && matchesEnvironment && matchesServerType;
    });
  }, [filterOptions]);

  // ใช้ useEffect ในการจัดการ filtered indexes
  useEffect(() => {
    const filteredEnvs = filterEnvironments(systemData.environmentInfo);
    const indexes = systemData.environmentInfo
      .map((env, index) => ({ env, index }))
      .filter(({ env }) => filteredEnvs.includes(env))
      .map(({ index }) => index);
    
    setFilteredIndexes(indexes);
  }, [filterOptions, systemData.environmentInfo, filterEnvironments]);

  const renderSystemInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField 
        label="ชื่อระบบ" 
        value={systemData.systemName} 
        onChange={(value) => updateSystemField('systemName', value)}
        error={errors.systemName}
      />
      <FormFieldOption 
        label="ประเภทการพัฒนา" 
        value={systemData.developType} 
        onChange={(value) => updateSystemField('developType', value)}
        options={DEVELOPER_TYPE}
        error={errors.developType}
      />
      <FormField 
        label="เลขที่สัญญา" 
        value={systemData.contractNo} 
        onChange={(value) => updateSystemField('contractNo', value)}
        error={errors.contractNo}
      />
      <FormField 
        label="เลขที่ติดต่อผู้ขาย" 
        value={systemData.vendorContactNo} 
        onChange={(value) => updateSystemField('vendorContactNo', value)}
        error={errors.vendorContactNo}
      />
      <FormField 
        label="หน่วยธุรกิจ" 
        value={systemData.businessUnit} 
        onChange={(value) => updateSystemField('businessUnit', value)}
        error={errors.businessUnit}
      />
      <FormFieldOption
        label="หน่วยพัฒนา" 
        value={systemData.developUnit} 
        onChange={(value) => {
          const finalValue = Array.isArray(value) ? value.join(',') : value;
          updateSystemField('developUnit', finalValue);
        }}
        options={DEVELOPER_UNIT}
        error={errors.developUnit}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormFieldOption
          label="Computer Backup"
          value={systemData.computerbackup}
          onChange={(value) => updateSystemField('computerbackup', value)}
          options={YES_NO}
          error={errors.computerbackup}
        />
      </div>
    </div>
  );

const renderEnvironmentInfo = () => (
  <div className="space-y-8">
    {/* Filter Controls */}
    <div className="bg-[rgb(27,27,26)] p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อเครื่อง, IP, แอปพลิเคชัน..."
            className="w-full pl-10 pr-4 py-2 bg-[rgb(32,32,31)] rounded-md text-white"
            value={filterOptions.searchTerm}
            onChange={(e) => setFilterOptions(prev => ({
              ...prev,
              searchTerm: e.target.value
            }))}
          />
        </div>

        {/* Environment Filter */}
        <ModernDropdown
          options={['', ...ENVIRONMENT_OPTIONS]}
          value={filterOptions.environment}
          onChange={(value) => setFilterOptions(prev => ({
            ...prev,
            environment: value
          }))}
          placeholder="กรองตาม Environment"
        />

        {/* Server Type Filter */}
        <ModernDropdown
          options={['', ...SERVER_TYPE_OPTIONS]}
          value={filterOptions.serverType}
          onChange={(value) => setFilterOptions(prev => ({
            ...prev,
            serverType: value
          }))}
          placeholder="กรองตามประเภทเซิร์ฟเวอร์"
        />
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-gray-300">
        พบ {filteredIndexes.length} เครื่อง จากทั้งหมด {systemData.environmentInfo.length} เครื่อง
        {filterOptions.searchTerm && (
          <span className="ml-2">
            (ค้นหาด้วย: {filterOptions.searchTerm})
          </span>
        )}
      </div>
    </div>

    {/* Render Filtered Environments */}
    {systemData.environmentInfo
      .filter((_, index) => filteredIndexes.length === 0 || filteredIndexes.includes(index))
      .map((env, index) => (
        <div key={index} className="bg-[rgb(27,27,26)] p-6 rounded-lg shadow-sm">
          {/* Show environment summary first */}
          <div className="border-b border-gray-700 pb-4 mb-4">
            <h3 className="text-lg font-medium text-gray-100">
              {env.serverName} ({env.ip})
            </h3>
            <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-300">
              <div>Environment: {env.environment}</div>
              <div>Type: {env.serverType}</div>
              <div>Role: {env.serverRole}</div>
            </div>
          </div>

          {/* Expandable Details */}
          <details className="mt-4">
            <summary className="cursor-pointer text-gray-300 hover:text-white">
              แสดงรายละเอียดเพิ่มเติม
            </summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormFieldOption
                label="Environment"
                value={env.environment}
                onChange={(value) => updateEnvironmentInfo(index, 'environment', value)}
                options={ENVIRONMENT_OPTIONS}
                error={errors[`environment-${index}`]}
              />
              <FormField 
                label="Server Name" 
                value={env.serverName}
                onChange={(value) => updateEnvironmentInfo(index, 'serverName', value)}
                error={errors[`serverName-${index}`]}
              />
              <FormField 
                label="IP" 
                value={env.ip}
                onChange={(value) => updateEnvironmentInfo(index, 'ip', value)}
                error={errors[`ip-${index}`]}
              />
              <FormFieldOption
                label="Server Type"
                value={env.serverType}
                onChange={(value) => updateEnvironmentInfo(index, 'serverType', value)}
                options={SERVER_TYPE_OPTIONS}
                error={errors[`serverType-${index}`]}
              />
              <FormFieldOption
                label="Server Role"
                value={env.serverRole}
                onChange={(value) => updateEnvironmentInfo(index, 'serverRole', value)}
                options={SERVER_ROLE_OPTIONS}
                error={errors[`serverRole-${index}`]}
              />
              <FormFieldOption
                label="Server Duty"
                value={env.serverDuty}
                onChange={(value) => updateEnvironmentInfo(index, 'serverDuty', value)}
                options={SERVER_DUTY_OPTIONS}
                error={errors[`serverDuty-${index}`]}
              />
              <FormField 
                label="ฐานข้อมูล" 
                value={env.database}
                onChange={(value) => updateEnvironmentInfo(index, 'database', value)}
                error={errors[`database-${index}`]}
              />
              <FormField 
                label="แอปพลิเคชัน" 
                value={env.application}
                onChange={(value) => updateEnvironmentInfo(index, 'application', value)}
                error={errors[`application-${index}`]}
              />
              <FormField 
                label="ระบบปฏิบัติการ" 
                value={env.operatingSystem}
                onChange={(value) => updateEnvironmentInfo(index, 'operatingSystem', value)}
                error={errors[`operatingSystem-${index}`]}
              />
              <FormField 
                label="Service Pack" 
                value={env.servicePack}
                onChange={(value) => updateEnvironmentInfo(index, 'servicePack', value)}
                error={errors[`servicePack-${index}`]}
              />
              <FormField 
                label="Build" 
                value={env.build}
                onChange={(value) => updateEnvironmentInfo(index, 'build', value)}
                error={errors[`build-${index}`]}
              />
              <FormField 
                label="CPU" 
                value={env.cpu}
                onChange={(value) => updateEnvironmentInfo(index, 'cpu', value)}
                error={errors[`cpu-${index}`]}
              />
              <FormField 
                label="RAM" 
                value={env.ram}
                onChange={(value) => updateEnvironmentInfo(index, 'ram', value)}
                error={errors[`ram-${index}`]}
              />
              <FormField 
                label="Disk" 
                value={env.disk}
                onChange={(value) => updateEnvironmentInfo(index, 'disk', value)}
                error={errors[`disk-${index}`]}
              />
              <FormFieldOption
                label="DR"
                value={env.dr}
                onChange={(value) => updateEnvironmentInfo(index, 'dr', value)}
                options={DR_DC}
                error={errors[`dr-${index}`]}
              />
              <FormFieldOption
                label="Join Domain"
                value={env.joinDomain}
                onChange={(value) => updateEnvironmentInfo(index, 'joinDomain', value)}
                options={YES_NO}
                error={errors[`joinDomain-${index}`]}
              />
              <FormFieldOption
                label="Windows Cluster"
                value={env.windowsCluster}
                onChange={(value) => updateEnvironmentInfo(index, 'windowsCluster', value)}
                options={YES_NO}
                error={errors[`windowsCluster-${index}`]}
              />
                <FormFieldOption
                  label="Production Unit"
                  value={Array.isArray(env.productionUnit) 
                    ? env.productionUnit 
                    : env.productionUnit.split(',').filter(Boolean)}
                  onChange={(value) => {
                    if (value && value.length > 0) {
                      updateEnvironmentInfo(index, 'productionUnit', value);
                      // Clear error if exists
                      const newErrors = {...errors};
                      delete newErrors[`productionUnit-${index}`];
                      setErrors(newErrors);
                    } else {
                      // Set error if no units selected
                      setErrors(prev => ({
                        ...prev,
                        [`productionUnit-${index}`]: 'Please select at least one Production Unit'
                      }));
                    }
                  }}
                  options={PRODUCTION_UNIT_OPTIONS}
                  multiple={true}
                  error={errors[`productionUnit-${index}`]}
                  required={true}
                />
            </div>
          </details>
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
    {systemData.connectionInfo
      .filter((_, index) => filteredIndexes.length === 0 || filteredIndexes.includes(index))
      .map((conn, index) => (
        <div key={index} className="bg-[rgb(27,27,26)] p-6 rounded-lg shadow-sm">
          {/* Show summary first */}
          <div className="border-b border-gray-700 pb-4 mb-4">
            <h3 className="text-lg font-medium text-gray-100">
              {systemData.environmentInfo[index]?.serverName || 'ไม่มีชื่อ'}
            </h3>
            <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-300">
              <div>AD: {conn.ad}</div>
              <div>DNS: {conn.dns}</div>
              <div>TPAM: {conn.tpam}</div>
            </div>
          </div>

          {/* Expandable Details */}
          <details className="mt-4">
            <summary className="cursor-pointer text-gray-300 hover:text-white">
              แสดงรายละเอียดเพิ่มเติม
            </summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormFieldOption
                label="AD" 
                value={conn.ad}
                onChange={(value) => updateConnectionInfo(index, 'ad', value)}
                options={YES_NO}
                error={errors[`ad-${index}`]}
              />
              <FormFieldOption 
                label="DNS" 
                value={conn.dns}
                onChange={(value) => updateConnectionInfo(index, 'dns', value)}
                options={YES_NO}
                error={errors[`dns-${index}`]}
              />
              {/* ...rest of connection fields in 2 columns... */}
              <FormFieldOption 
                label="TPAM" 
                value={conn.tpam}
                onChange={(value) => updateConnectionInfo(index, 'tpam', value)}
                options={YES_NO}
                error={errors[`tpam-${index}`]}
              />
              <FormFieldOption 
                label="FIM" 
                value={conn.fim}
                onChange={(value) => updateConnectionInfo(index, 'fim', value)}
                options={YES_NO}
                error={errors[`fim-${index}`]}
              />
              <FormFieldOption 
                label="FTP Server" 
                value={conn.ftpServer}
                onChange={(value) => updateConnectionInfo(index, 'ftpServer', value)}
                options={YES_NO}
                error={errors[`ftpServer-${index}`]}
              />
              <FormFieldOption 
                label="Email SMTP" 
                value={conn.emailSmtp}
                onChange={(value) => updateConnectionInfo(index, 'emailSmtp', value)}
                options={YES_NO}
                error={errors[`emailSmtp-${index}`]}
              />
              <FormFieldOption 
                label="API Management" 
                value={conn.apiManagement}
                onChange={(value) => updateConnectionInfo(index, 'apiManagement', value)}
                options={YES_NO}
                error={errors[`apiManagement-${index}`]}
              />
              <FormFieldOption 
                label="SNMP" 
                value={conn.snmp}
                onChange={(value) => updateConnectionInfo(index, 'snmp', value)}
                options={YES_NO}
                error={errors[`snmp-${index}`]}
              />
              <FormFieldOption 
                label="ADFS" 
                value={conn.adfs}
                onChange={(value) => updateConnectionInfo(index, 'adfs', value)}
                options={YES_NO}
                error={errors[`adfs-${index}`]}
              />
              <FormFieldOption 
                label="NTP" 
                value={conn.ntp}
                onChange={(value) => updateConnectionInfo(index, 'ntp', value)}
                options={YES_NO}
                error={errors[`ntp-${index}`]}
              />
              <FormFieldOption 
                label="Netka" 
                value={conn.netka}
                onChange={(value) => updateConnectionInfo(index, 'netka', value)}
                options={YES_NO}
                error={errors[`netka-${index}`]}
              />
              <FormFieldOption 
                label="FTP GoAnywhere MFT Server" 
                value={conn.ftpGoAnywhereMFTServer}
                onChange={(value) => updateConnectionInfo(index, 'ftpGoAnywhereMFTServer', value)}
                options={YES_NO}
                error={errors[`ftpGoAnywhereMFTServer-${index}`]}
              />
              <FormFieldOption 
                label="SMS" 
                value={conn.sms}
                onChange={(value) => updateConnectionInfo(index, 'sms', value)}
                options={YES_NO}
                error={errors[`sms-${index}`]}
              />
              <FormFieldOption 
                label="DV" 
                value={conn.dv}
                onChange={(value) => updateConnectionInfo(index, 'dv', value)}
                options={YES_NO}
                error={errors[`dv-${index}`]}
              />
            </div>
          </details>
        </div>
      ))}
    {/* ...existing summary count... */}
  </div>
);

const renderSecurityInfo = () => (
  <div className="space-y-6">
    {systemData.securityInfo
      .filter((_, index) => filteredIndexes.length === 0 || filteredIndexes.includes(index))
      .map((security, index) => (
        <div key={index} className="bg-[rgb(27,27,26)] p-6 rounded-lg shadow-sm">
          {/* Show summary first */}
          <div className="border-b border-gray-700 pb-4 mb-4">
            <h3 className="text-lg font-medium text-gray-100">
              {systemData.environmentInfo[index]?.serverName || 'ไม่มีชื่อ'}
            </h3>
            <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-300">
              <div>URL: {security.urlWebsite}</div>
              <div>Backup: {security.backupPolicy}</div>
              <div>Centralize Log: {security.certificateExpireDate}</div>
            </div>
          </div>

          {/* Expandable Details */}
          <details className="mt-4">
            <summary className="cursor-pointer text-gray-300 hover:text-white">
              แสดงรายละเอียดเพิ่มเติม
            </summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                label="URL Website" 
                value={security.urlWebsite}
                onChange={(value) => updateSecurityInfo(index, 'urlWebsite', value)}
                error={errors[`urlWebsite-${index}`]}
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Certificate Expire Date
                </label>
                <StyledWrapper style={{ position: 'relative', zIndex: 50 }}>
                  <CustomDatePicker
                    selectedDate={security.certificateExpireDate ? new Date(security.certificateExpireDate) : null}
                    onChange={(date) => {
                      if (date) {
                        updateSecurityInfo(index, 'certificateExpireDate', date.toISOString().split('T')[0]);
                      }
                    }}
                    placeholder="Select expiry date"
                    required
                    error={!!errors[`certificateExpireDate-${index}`]}
                  />
                </StyledWrapper>
                {errors[`certificateExpireDate-${index}`] && (
                  <p className="mt-1 text-sm text-red-500">{errors[`certificateExpireDate-${index}`]}</p>
                )}
              </div>
              <FormField 
                label="Backup Policy" 
                value={security.backupPolicy}
                onChange={(value) => updateSecurityInfo(index, 'backupPolicy', value)}
                error={errors[`backupPolicy-${index}`]}
              />
              <FormField 
                label="Downtime Allowed" 
                value={security.downtimeAllowed}
                onChange={(value) => updateSecurityInfo(index, 'downtimeAllowed', value)}
                error={errors[`downtimeAllowed-${index}`]}
              />
              <FormFieldOption
                label="Centralize Log"
                value={security.centralizeLog}
                onChange={(value) => updateSecurityInfo(index, 'centralizeLog', value)}
                options={YES_NO}
                error={errors[`centralizeLog-${index}`]}
              />
              <FormFieldOption
                label="Setup Agent Patch"
                value={security.setupAgentPatch}
                onChange={(value) => updateSecurityInfo(index, 'setupAgentPatch', value)}
                options={YES_NO}
                error={errors[`setupAgentPatch-${index}`]}
              />
              <FormFieldOption
                label="Internet Facing"
                value={security.internetFacing}
                onChange={(value) => updateSecurityInfo(index, 'internetFacing', value)}
                options={YES_NO}
                error={errors[`internetFacing-${index}`]}
              />
            </div>
          </details>
        </div>
      ))}
    {/* ...existing summary count... */}
  </div>
);

  return (
    <div style={{ backgroundColor: colors.background.primary }} className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-[98%]">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ 
              color: colors.text.primary,
              background: `linear-gradient(to right, ${colors.button.primary.background}, ${colors.button.primary.hover})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }} 
            className="text-4xl font-bold tracking-tight"
          >
            แก้ไขระบบ
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "200px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-1 mx-auto mt-4 rounded-full"
            style={{ background: line.line }}
          />
          <div className="flex justify-center mt-6 space-x-4">
            <motion.button
              onClick={handleShare}
              style={{ 
                backgroundColor: `${colors.button.primary.background}10`,
                color: colors.button.primary.background
              }}
              className="inline-flex items-center px-6 py-2 rounded-full shadow-lg"
              whileHover={{ 
                backgroundColor: `${colors.button.primary.hover}20`,
                scale: 1.05,
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)'
              }}
              transition={{ duration: 0.2 }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              แชร์
            </motion.button>
            <motion.button
              onClick={handleSave}
              style={{ backgroundColor: colors.button.primary.background }}
              className="inline-flex items-center px-6 py-2 text-white rounded-full shadow-lg"
              whileHover={{ 
                backgroundColor: colors.button.primary.hover,
                scale: 1.05,
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)'
              }}
              transition={{ duration: 0.2 }}
            >
              <Save className="w-4 h-4 mr-2" />
              บันทึก
            </motion.button>
          </div>
        </div>

        <Agenda activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence>
          {activeTab === 'system' && (
            <FormContainer>
              {renderSystemInfo()}
            </FormContainer>
          )}
          {activeTab === 'environment' && (
            <FormContainer>
              {renderEnvironmentInfo()}
            </FormContainer>
          )}
          {activeTab === 'connection' && (
            <FormContainer>
              {renderConnectionInfo()}
            </FormContainer>
          )}
          {activeTab === 'security' && (
            <FormContainer>
              {renderSecurityInfo()}
            </FormContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}