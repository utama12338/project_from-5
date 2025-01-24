"use client"
import { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import Swal from 'sweetalert2';
import CSVPreviewModal from './components/CSVPreviewModal';
import { CSVValidationResult } from './types/csv';

// Add interface for validation errors
interface ValidationErrors {
  [key: string]: string;
}

// Add these constants at the top of the file, after imports
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
  productionUnit: string[];
}

export default function CreateSystem() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // สร้าง state สำหรับควบคุมขั้นตอน
  const [currentStep, setCurrentStep] = useState(1);
  
  // สร้าง state สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    systemName: '',
    developType: '',
    contractNo: '',
    vendorContactNo: '',
    businessUnit: '',
    developUnit: '',
    computerbackup: 'NO', // Add this new field
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
      productionUnit: [] as string[]
    }],
    connectionInfo: [{
      ad: 'NO', 
      adfs: 'NO',
      dns: 'NO',
      ntp: 'NO',
      tpam: 'NO',
      netka: 'NO',
      fim: 'NO',
      ftpServer: 'NO',
      ftpGoAnywhereMFTServer: 'NO',
      emailSmtp: 'NO',
      sms: 'NO',
      apiManagement: 'NO',
      dv: 'NO',
      snmp: 'NO'
    }],
    securityInfo: [{
      urlWebsite: '',
      certificateExpireDate: '',
      backupPolicy: '',
      downtimeAllowed: '',
      centralizeLog: 'NO',
      setupAgentPatch: 'NO',
      internetFacing: 'NO'
    }]
  });

  // Add validation errors state
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Add state for CSV preview modal
  const [showPreview, setShowPreview] = useState(false);
  const [csvData, setCsvData] = useState<CSVValidationResult[]>([]);

  // Add new state for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูล (เหมือนเดิม)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCSVRow = async (row: any, index: number): Promise<CSVValidationResult> => {
    const errors: string[] = [];
    let status: 'invalid' | 'incomplete' | 'update' | 'create' = 'create';
    
    // เช็คว่าเป็น empty row หรือไม่
    const isEmpty = Object.values(row).every(value => !value || value.toString().trim() === '');
    if (isEmpty) {
      return {
        row: index + 1,
        data: row,
        status: 'invalid',
        errors: ['ข้อมูลว่างเปล่า'],
        systemName: 'N/A'
      };
    }

    // Validate required fields
    const requiredFields = [
      'systemName',
      'developType',
      'contractNo',
      'vendorContactNo',
      'businessUnit',
      'developUnit',
      'environment',
      'serverName',
      'ip'
    ];

    const missingFields = requiredFields.filter(field => !row[field] || row[field].toString().trim() === '');
    if (missingFields.length > 0) {
      status = 'incomplete';
      errors.push(`ข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
    }

    // Validate data formats
    if (row.ip && !/^(\d{1,3}\.){3}\d{1,3}$/.test(row.ip)) {
      errors.push('รูปแบบ IP Address ไม่ถูกต้อง');
    }
    
    if (row.urlWebsite && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(row.urlWebsite)) {
      errors.push('รูปแบบ URL ไม่ถูกต้อง');
    }

    // ตรวจสอบว่าระบบมีอยู่แล้วหรือไม่
    try {
      const response = await axios.get(`http://localhost:4000/from/api/system/check?systemName=${row.systemName}`);
      if (response.data) {
        status = 'update';
      }
    } catch (error) {
      console.error('Error checking system:', error);
    }

    // ถ้ามี error ให้เปลี่ยนสถานะเป็น invalid
    if (errors.length > 0 && status !== 'incomplete') {
      status = 'invalid';
    }

    return {
      row: index + 1,
      data: row,
      status,
      errors,
      systemName: row.systemName || 'N/A'
    };
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const validationPromises = results.data.map((row: any, index: number) => 
          validateCSVRow(row, index)
        );

        const validatedData = await Promise.all(validationPromises);
        setCsvData(validatedData);
        setShowPreview(true);
      }
    });
  };

  const handleConfirmImport = async () => {
    try {
      // Process each row based on status
      for (const row of csvData) { 
        if (row.status === 'invalid') continue;

        const endpoint = row.status === 'update' ? '/api/system/update' : 
                        row.status === 'incomplete' ? '/api/system/draft' : 
                        '/api/system/create';

        await axios.post(endpoint, row.data);
      }

      setShowPreview(false);
      // Show success message
      Swal.fire({
        title: 'นำเข้าข้อมูลสำเร็จ',
        icon: 'success'
      });
    } catch (error) {
      console.error('Import error:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถนำเข้าข้อมูลได้',
        icon: 'error'
      });
    }
  };

  // ฟังก์ชันสำหรับไปขั้นตอนถัดไป
  const nextStep = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      Swal.fire({
        title: 'ข้อมูลไม่ครบถ้วน!',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  // ฟังก์ชันสำหรับกลับไปขั้นตอนก่อนหน้า
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // ฟังก์ชันสำหรับส่งข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || isSubmitted) {
      return;
    }

    if (validateForm(currentStep)) {
      try {
        setIsSubmitting(true);
        const response = await axios.post('http://localhost:4000/from/createforme', {
          ...formData,  
        });
        console.log('Success:', response.data);
        
        setIsSubmitted(true);
        router.push('/forme');
        
        Swal.fire({
          title: 'บันทึกสำเร็จ!',
          text: 'ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      } catch (error) {
        console.error('Error saving data:', error);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถบันทึกข้อมูลได้',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      Swal.fire({
        title: 'ข้อมูลไม่ครบถ้วน!',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  const handleEnvironmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string | string[] } },
    index: number
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newEnvironmentInfo = [...prev.environmentInfo];
      newEnvironmentInfo[index] = {
        ...newEnvironmentInfo[index],
        [name]: value
      };
      return {
        ...prev,
        environmentInfo: newEnvironmentInfo
      };
    });
  };

  const handleConnectionChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newConnectionInfo = [...prev.connectionInfo];
      newConnectionInfo[index] = {
        ...newConnectionInfo[index],
        [name]: value
      };
      return {
        ...prev,
        connectionInfo: newConnectionInfo
      };
    });
  };

  const handleSecurityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
    index: number
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newSecurityInfo = [...prev.securityInfo];
      newSecurityInfo[index] = {
        ...newSecurityInfo[index],
        [name]: value
      };
      return {
        ...prev,
        securityInfo: newSecurityInfo
      };
    });
  };

  // Add function to add new entries
  const addNewEntries = () => {
    setFormData(prev => ({
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
        productionUnit: [] as string[]
      }],
      connectionInfo: [...prev.connectionInfo, {
        ad: 'NO',
        adfs: 'NO',
        dns: 'NO',
        ntp: 'NO',
        tpam: 'NO',
        netka: 'NO',
        fim: 'NO',
        ftpServer: 'NO',
        ftpGoAnywhereMFTServer: 'NO',
        emailSmtp: 'NO',
        sms: 'NO',
        apiManagement: 'NO',
        dv: 'NO',
        snmp: 'NO'
      }],
      securityInfo: [...prev.securityInfo, {
        urlWebsite: '',
        certificateExpireDate: '',
        backupPolicy: '',
        downtimeAllowed: '',
        centralizeLog: 'NO',
        setupAgentPatch: 'NO',
        internetFacing: 'NO'
      }]
    }));
  };

  // Add function to remove entries
  const removeEntries = (index: number) => {
    setFormData(prev => ({
      ...prev,
      environmentInfo: prev.environmentInfo.filter((_, i) => i !== index),
      connectionInfo: prev.connectionInfo.filter((_, i) => i !== index),
      securityInfo: prev.securityInfo.filter((_, i) => i !== index)
    }));
  };

  // Add validation function
  const validateForm = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate Step 1: Basic Info
    if (step === 1) {
      if (!formData.systemName.trim()) {
        newErrors.systemName = 'กรุณากรอกชื่อระบบ';
      }
      if (!formData.developType) {
        newErrors.developType = 'กรุณาเลือกประเภทการพัฒนา';
      }
      if (!formData.contractNo.trim()) {
        newErrors.contractNo = 'กรุณากรอกเลขที่สัญญา';
      }
      if (!formData.vendorContactNo.trim()) {
        newErrors.vendorContactNo = 'กรุณากรอกข้อมูลบริษัทคู่สัญญา';
      }
      if (!formData.businessUnit.trim()) {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with import and draft buttons */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold">เพิ่มข้อมูลระบบ</h2>
          <div className="space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportCSV}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Import CSV
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['ข้อมูลระบบ', 'สภาพแวดล้อม', 'การเชื่อมต่อ', 'ความปลอดภัย'].map((step, index) => (
              <div
                key={index}
                className={`text-sm font-medium ${
                  currentStep > index + 1 ? 'text-indigo-600' :
                  currentStep === index + 1 ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form content */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: ข้อมูลระบบพื้นฐาน */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  ข้อมูลระบบพื้นฐาน
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ชื่อระบบ System name
                    </label>
                    <input
                      type="text"
                      name="systemName"
                      value={formData.systemName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                        ${errors.systemName ? 'border-red-500' : 'border-gray-300'}`}
                      required
                      autoComplete="off"
                    />
                    {errors.systemName && (
                      <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ประเภทการพัฒนา Develop Type
                    </label>
                    <select
                      name="developType"
                      value={formData.developType}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                        ${errors.developType ? 'border-red-500' : 'border-gray-300'}`}
                      required
                      autoComplete="off"
                    >
                      <option value="">เลือกประเภทการพัฒนา</option>
                      <option value="OUTSOURCE">OUTSOURCE</option>
                      <option value="IN HOUSE">IN HOUSE</option>
                    </select>
                    {errors.developType && (
                      <p className="mt-1 text-sm text-red-600">{errors.developType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      เลขที่สัญญา Contract NO.
                    </label>
                    <input
                      type="text"
                      name="contractNo"
                      value={formData.contractNo}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                        ${errors.contractNo ? 'border-red-500' : 'border-gray-300'}`}
                      required
                      autoComplete="off"
                    />
                    {errors.contractNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.contractNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block teBusiness Unitxt-sm font-medium text-gray-700">
                    บริษัทคู่สัญญา  / ติดต่อ   Vendor / Contact NO.
                    </label>  
                    <input
                      type="text"
                      name="vendorContactNo"
                      value={formData.vendorContactNo}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                        ${errors.vendorContactNo ? 'border-red-500' : 'border-gray-300'}`}
                      required
                      autoComplete="off"
                    />
                    {errors.vendorContactNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.vendorContactNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block teBusiness Unitxt-sm font-medium text-gray-700">
                    หน่วยงานเจ้าของระบบงาน Business Unit
                    </label>
                    <input
                      type="text"
                      name="businessUnit"
                      value={formData.businessUnit}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                        ${errors.businessUnit ? 'border-red-500' : 'border-gray-300'}`}
                      required
                      autoComplete="off"
                    />
                    {errors.businessUnit && (
                      <p className="mt-1 text-sm text-red-600">{errors.businessUnit}</p>
                    )}
                  </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ผู้รับผิดชอบของทีมพัฒนา Develop Unit
                    </label>
                    <select
                      name="developUnit"
                      value={formData.developUnit}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                        ${errors.developUnit ? 'border-red-500' : 'border-gray-300'}`}
                      required
                      autoComplete="off"
                    >
                      <option value="">เลือกผู้รับผิดชอบ</option>
                      <option value="ฝรล.">ฝรล.</option>
                      <option value="ส่วนระบบงานสนับสนุน">ส่วนระบบงานสนับสนุน</option>
                      <option value="ระบบสนับสนุนนโยบายรัฐ">ระบบสนับสนุนนโยบายรัฐ</option>
                      <option value="ธนรัตน์ เกรอด">ธนรัตน์ เกรอด</option>
                    </select>
                    {errors.developUnit && (
                      <p className="mt-1 text-sm text-red-600">{errors.developUnit}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Computer Backup
                    </label>
                    <select
                      name="computerbackup"
                      value={formData.computerbackup}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                        ${errors.computerbackup ? 'border-red-500' : 'border-gray-300'}`}
                      required
                      autoComplete="off"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                    {errors.computerbackup && (
                      <p className="mt-1 text-sm text-red-600">{errors.computerbackup}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Environment Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    ข้อมูลสภาพแวดล้อม - {formData.systemName || 'ไม่ระบุชื่อระบบ'}
                  </h3>
                  
                  <button
                    type="button"
                    onClick={addNewEntries}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    เพิ่มข้อมูล
                  </button>
                </div>
                {formData.environmentInfo.map((env, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">ข้อมูลชุดที่ {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeEntries(index)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        ลบ
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Environment
                        </label>
                        <select
                          name="environment"
                          value={env.environment}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`environment-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                        >
                          <option value="">Select Environment</option>
                          {ENVIRONMENT_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {errors[`environment-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`environment-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Server Name
                        </label>
                        <input
                          type="text"
                          name="serverName"
                          value={env.serverName}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`serverName-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`serverName-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverName-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          IP Address
                        </label>
                        <input
                          type="text"
                          name="ip"
                          value={env.ip}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`ip-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`ip-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`ip-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Server Type
                        </label>
                        <select
                          name="serverType"
                          value={env.serverType}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`serverType-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                        >
                          <option value="">Select Server Type</option>
                          {SERVER_TYPE_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {errors[`serverType-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverType-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Server Role
                        </label>
                        <select
                          name="serverRole"
                          value={env.serverRole}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`serverRole-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                        >
                          <option value="">Select Server Role</option>
                          {SERVER_ROLE_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {errors[`serverRole-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverRole-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Server Duty
                        </label>
                        <select
                          name="serverDuty"
                          value={env.serverDuty}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`serverDuty-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                        >
                          <option value="">Select Server Duty</option>
                          {SERVER_DUTY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {errors[`serverDuty-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverDuty-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Database
                        </label>
                        <input
                          type="text"
                          name="database"
                          value={env.database}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`database-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Database management"
                          required
                          autoComplete="off"
                        />
                        {errors[`database-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`database-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Application
                        </label>
                        <input
                          type="text"
                          name="application"
                          value={env.application}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`application-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Supporting software IIS .net framework"
                          required
                          autoComplete="off"
                        />
                        {errors[`application-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`application-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Operating System
                        </label>
                        <input
                          type="text"
                          name="operatingSystem"
                          value={env.operatingSystem}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`operatingSystem-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`operatingSystem-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`operatingSystem-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Service Pack
                        </label>
                        <input
                          type="text"
                          name="servicePack"
                          value={env.servicePack}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`servicePack-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`servicePack-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`servicePack-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Build
                        </label>
                        <input
                          type="text"
                          name="build"
                          value={env.build}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`build-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`build-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`build-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CPU
                        </label>
                        <input
                          type="text"
                          name="cpu"
                          value={env.cpu}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`cpu-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`cpu-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`cpu-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          RAM
                        </label>
                        <input
                          type="text"
                          name="ram"
                          value={env.ram}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`ram-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`ram-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`ram-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Disk
                        </label>
                        <input
                          type="text"
                          name="disk"
                          value={env.disk}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`disk-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`disk-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`disk-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          DR
                        </label>
                        <select
                          name="dr"
                          value={env.dr}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`dr-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                        >
                          <option value="">Select DR/DC</option>
                          <option value="DR">DR</option>
                          <option value="DC">DC</option>
                        </select>
                        {errors[`dr-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`dr-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Join Domain
                        </label>
                        <select
                          name="joinDomain"
                          value={env.joinDomain}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`joinDomain-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                        >
                          <option value="">Select Option</option>
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </select>
                        {errors[`joinDomain-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`joinDomain-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Windows Cluster
                        </label>
                        <select
                          name="windowsCluster"
                          value={env.windowsCluster}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`windowsCluster-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                        >
                          <option value="">Select Option</option>
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </select>
                        {errors[`windowsCluster-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`windowsCluster-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Production Unit
                        </label>
                        <div className={`grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md ${
                          errors[`productionUnit-${index}`] ? 'border-red-500' : 'border-gray-300'
                        }`}>
                          {PRODUCTION_UNIT_OPTIONS.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`productionUnit-${index}-${option}`}
                                checked={env.productionUnit.includes(option)}
                                onChange={(e) => {
                                  const updatedUnits = e.target.checked
                                    ? [...env.productionUnit, option]
                                    : env.productionUnit.filter(unit => unit !== option);
                                  
                                  handleEnvironmentChange({
                                    target: {
                                      name: 'productionUnit',
                                      value: updatedUnits
                                    }
                                  }, index);
                                }}
                                className={`h-4 w-4 focus:ring-indigo-500 rounded ${
                                  errors[`productionUnit-${index}`] 
                                    ? 'border-red-500 text-red-600' 
                                    : 'border-gray-300 text-indigo-600'
                                }`}
                              />
                              <label 
                                htmlFor={`productionUnit-${index}-${option}`}
                                className="text-sm text-gray-700"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                        {errors[`productionUnit-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`productionUnit-${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Connection Info */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    ข้อมูลการเชื่อมต่อ
                  </h3>
                </div>
                {formData.connectionInfo.map((conn, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">
                        Server Name: {formData.environmentInfo[index]?.serverName || 'N/A'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeEntries(index)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        ลบ
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Active Directory (AD)
                        </label>
                        <select
                          name="ad"
                          value={conn.ad}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ADFS
                        </label>
                        <select
                          name="adfs"
                          value={conn.adfs}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          DNS
                        </label>
                        <select
                          name="dns"
                          value={conn.dns}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          NTP
                        </label>
                        <select
                          name="ntp"
                          value={conn.ntp}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          TPAM
                        </label>
                        <select
                          name="tpam"
                          value={conn.tpam}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Netka
                        </label>
                        <select
                          name="netka"
                          value={conn.netka}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          FIM
                        </label>
                        <select
                          name="fim"
                          value={conn.fim}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          FTP Server
                        </label>
                        <select
                          name="ftpServer"
                          value={conn.ftpServer}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          FTP GoAnywhere MFT Server
                        </label>
                        <select
                          name="ftpGoAnywhereMFTServer"
                          value={conn.ftpGoAnywhereMFTServer}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email SMTP
                        </label>
                        <select
                          name="emailSmtp"
                          value={conn.emailSmtp}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          SMS
                        </label>
                        <select
                          name="sms"
                          value={conn.sms}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          API Management
                        </label>
                        <select
                          name="apiManagement"
                          value={conn.apiManagement}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          DV
                        </label>
                        <select
                          name="dv"
                          value={conn.dv}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          SNMP
                        </label>
                        <select
                          name="snmp"
                          value={conn.snmp}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Security Info */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    ข้อมูลความปลอดภัย
                  </h3>
                </div>
                {formData.securityInfo.map((security, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">
                        Server Name: {formData.environmentInfo[index]?.serverName || 'N/A'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeEntries(index)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        ลบ
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          URL Website
                        </label>
                        <input
                          type="text"
                          name="urlWebsite"
                          value={security.urlWebsite}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`urlWebsite-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`urlWebsite-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`urlWebsite-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Certificate Expire Date
                        </label>
                        <input
                          type="date"
                          name="certificateExpireDate"
                          value={security.certificateExpireDate}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`certificateExpireDate-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`certificateExpireDate-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`certificateExpireDate-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Backup Policy
                        </label>
                        <input
                          type="text"
                          name="backupPolicy"
                          value={security.backupPolicy}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`backupPolicy-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`backupPolicy-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`backupPolicy-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Downtime Allowed
                        </label>
                        <input
                          type="text"
                          name="downtimeAllowed"
                          value={security.downtimeAllowed}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                            ${errors[`downtimeAllowed-${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          required
                          autoComplete="off"
                        />
                        {errors[`downtimeAllowed-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`downtimeAllowed-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Centralize Log
                        </label>
                        <select
                          name="centralizeLog"
                          value={security.centralizeLog}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Setup Agent Patch
                        </label>
                        <select
                          name="setupAgentPatch"
                          value={security.setupAgentPatch}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Internet Facing
                        </label>
                        <select
                          name="internetFacing"
                          value={security.internetFacing}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-5">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  ย้อนกลับ
                </button>
              )}
              <div>
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    ถัดไป
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting || isSubmitted}
                    className={`px-4 py-2 text-white rounded-md ${
                      isSubmitting || isSubmitted 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : isSubmitted ? 'บันทึกเรียบร้อย' : 'บันทึกข้อมูล'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <CSVPreviewModal 
        isOpen={showPreview}
        onClose={handleClosePreview}
        data={csvData}
        onConfirm={handleConfirmImport}
      />
    </div>
  );
}
