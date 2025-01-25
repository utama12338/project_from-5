"use client"
import { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import Swal from 'sweetalert2';
import CSVPreviewModal from './components/CSVPreviewModal';
import { CSVValidationResult } from './types/csv';
import { motion, type Variants } from 'framer-motion';
import { FiServer, FiShield, FiDatabase, FiLink,FiArrowLeft } from 'react-icons/fi';
// 
import StyledWrapper  from './components/neoninput';
// 
// steper
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import { StepIconProps } from '@mui/material/StepIcon';
import Check from '@mui/icons-material/Check';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import LinkIcon from '@mui/icons-material/Link';
import SecurityIcon from '@mui/icons-material/Security';
// steper



// Add interface for validation errors
interface ValidationErrors {
  [key: string]: string;
}
// animation 
const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
};

const iconVariants = {
  hover: {
    scale: [1, 0.1, 1.2],
    rotate: [0, 0, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};


const deleteButtonVariants = { // ของปุ่มลบ
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
};

const deleteIconVariants = {// ของปุ่มลบ
  hover: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};




// 
const backButtonVariants = {
  initial: {
    backgroundColor: "transparent"
  },
  hover: {
    backgroundColor: "rgba(99, 102, 241, 0.05)"
  }
};

const backIconVariants: Variants = {
  hover: {
    x: [0, 0, -5], // Sliding left and right
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
      repeatType: "reverse"
    }
  },
  initial: {
    x: 0
  }
};

// animation 
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


// steper

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(236,72,153) 0%,rgb(244,114,182) 50%,rgb(251,207,232) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(236,72,153) 0%,rgb(244,114,182) 50%,rgb(251,207,232) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: '#374151', // darker gray
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(236,72,153) 0%, rgb(244,114,182) 50%, rgb(251,207,232) 100%)',
    boxShadow: '0 4px 10px 0 rgba(236,72,153,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, rgb(236,72,153) 0%, rgb(244,114,182) 50%, rgb(251,207,232) 100%)',
  }),
}));

// Add custom styles for the StepLabel text
const CustomStepLabel = styled(StepLabel)({
  '& .MuiStepLabel-label': {
    color: '#fff', // This makes the text white
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: '#fff', // Active state text color
  },
  '& .MuiStepLabel-label.Mui-completed': {
    color: '#fff', // Completed state text color
  }
});

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <DescriptionIcon />,
    2: <StorageIcon />,
    3: <LinkIcon />,
    4: <SecurityIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ['ข้อมูลระบบ (Systeminfo)', 'สภาพแวดล้อม (Environment)', 'การเชื่อมต่อ (ConnectionInfo)', 'ความปลอดภัย (Security)'];

// steper
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
        router.push('/form');
        
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

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2 }
  };

  const buttonTap = {
    scale: 0.95
  };

  // Get step icon based on current step
  const getStepIcon = (step: number) => {
    switch(step) {
      case 1: return <FiDatabase className="w-6 h-6" />;
      case 2: return <FiServer className="w-6 h-6" />;
      case 3: return <FiLink className="w-6 h-6" />;
      case 4: return <FiShield className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(17,17,16)] py-8">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <motion.h2 
            className="text-3xl font-bold text-white"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            เพิ่มข้อมูลระบบ
          </motion.h2>
          <motion.div 
            className="space-x-4"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportCSV}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow-lg
                hover:bg-pink-600 transform transition-all duration-200
                hover:shadow-xl active:scale-95 flex items-center space-x-2"
            >
              <FiDatabase className="w-5 h-5" />
              <span>Import CSV</span>
            </button>
          </motion.div>
        </div>

        {/* Replace existing progress steps with MUI Stepper */}
        <motion.div 
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Stack spacing={4}>
            <Stepper alternativeLabel activeStep={currentStep - 1} connector={<ColorlibConnector />}>
              {steps.map((label) => (
                <Step key={label}>
                  <CustomStepLabel StepIconComponent={ColorlibStepIcon}>{label}</CustomStepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
        </motion.div>

        {/* Form Content */}
        <motion.div 
          className="bg-[rgb(27,27,26)] shadow-2xl rounded-2xl p-8 text-white"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: ข้อมูลระบบพื้นฐาน */}
            {currentStep === 1 && (
              <motion.div className="space-y-4" variants={fadeInUp}>
                <h3 className="text-lg font-medium text-gray-100 border-b pb-2">
                  ข้อมูลระบบพื้นฐาน
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-100">
                      ชื่อระบบ System name
                    </label>
                    <StyledWrapper>
                    <input  
                      type="text"
                      name="systemName"
                      value={formData.systemName}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.systemName ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                      required  
                      autoComplete="off"
                    /> </StyledWrapper>
                    {errors.systemName && (
                      <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-100">
                      ประเภทการพัฒนา Develop Type
                    </label>
                    <StyledWrapper>
                    <select
                      name="developType"
                      value={formData.developType}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.developType ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                      required
                      autoComplete="off"
                    >
                      <option value="">เลือกประเภทการพัฒนา</option>
                      <option value="OUTSOURCE">OUTSOURCE</option>
                      <option value="IN HOUSE">IN HOUSE</option>
                    </select>
                    </StyledWrapper>
                    {errors.developType && (
                      <p className="mt-1 text-sm text-red-600">{errors.developType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-100">
                      เลขที่สัญญา Contract NO.
                    </label>
                    <StyledWrapper>
                    <input
                      type="text"
                      name="contractNo"
                      value={formData.contractNo}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.contractNo ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                      required
                      autoComplete="off"
                    />
                    </StyledWrapper>
                    {errors.contractNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.contractNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block teBusiness Unitxt-sm font-medium text-gray-100">
                    บริษัทคู่สัญญา  / ติดต่อ   Vendor / Contact NO.
                    </label>  
                    <StyledWrapper>
                    <input
                      type="text"
                      name="vendorContactNo"
                      value={formData.vendorContactNo}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.vendorContactNo ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                      required
                      autoComplete="off"
                    />
                    </StyledWrapper>
                    {errors.vendorContactNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.vendorContactNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block teBusiness Unitxt-sm font-medium text-gray-100">
                    หน่วยงานเจ้าของระบบงาน Business Unit
                    </label>
                    <StyledWrapper>
                    <input
                      type="text"
                      name="businessUnit"
                      value={formData.businessUnit}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.businessUnit ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                      required
                      autoComplete="off"
                    />
                    </StyledWrapper>
                    {errors.businessUnit && (
                      <p className="mt-1 text-sm text-red-600">{errors.businessUnit}</p>
                    )}
                  </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-100">
                      ผู้รับผิดชอบของทีมพัฒนา Develop Unit
                    </label>
                    <StyledWrapper>
                    <select
                      name="developUnit"
                      value={formData.developUnit}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.developUnit ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                      required
                      autoComplete="off"
                    >
                      <option value="">เลือกผู้รับผิดชอบ</option>
                      <option value="ฝรล.">ฝรล.</option>
                      <option value="ส่วนระบบงานสนับสนุน">ส่วนระบบงานสนับสนุน</option>
                      <option value="ระบบสนับสนุนนโยบายรัฐ">ระบบสนับสนุนนโยบายรัฐ</option>
                      <option value="ธนรัตน์ เกรอด">ธนรัตน์ เกรอด</option>
                    </select>
                    </StyledWrapper>
                    {errors.developUnit && (
                      <p className="mt-1 text-sm text-red-600">{errors.developUnit}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-100">
                      Computer Backup
                    </label>
                    <StyledWrapper>
                    <select
                      name="computerbackup"
                      value={formData.computerbackup}
                      onChange={handleChange}
                      className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                        ${errors.computerbackup ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                      required
                      autoComplete="off"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                    </StyledWrapper>
                    {errors.computerbackup && (
                      <p className="mt-1 text-sm text-red-600">{errors.computerbackup}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Environment Info */}
            {currentStep === 2 && (
              <motion.div className="space-y-4" variants={fadeInUp}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-100 border-b pb-2">
                    ข้อมูลสภาพแวดล้อม - {formData.systemName || 'ไม่ระบุชื่อระบบ'}
                  </h3>
                  
                 

<motion.button
  type="button"
  onClick={addNewEntries}
  className="group px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 
    text-white rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
    transform transition-all duration-200 hover:shadow-xl
    flex items-center space-x-2 font-medium"
  variants={buttonVariants}
  whileHover="hover"
  whileTap="tap"
>
  <motion.svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5"
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    variants={iconVariants}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 4v16m8-8H4" 
    />
  </motion.svg>
  <span>เพิ่มข้อมูล</span>
</motion.button>
                </div>
                {formData.environmentInfo.map((env, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">ข้อมูลชุดที่ {index + 1}</h4>
                    
<motion.button
  type="button"
  onClick={() => removeEntries(index)}
  className="group px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 
    text-white rounded-lg shadow-md hover:from-red-600 hover:to-rose-700
    transform transition-all duration-200 hover:shadow-lg 
    flex items-center space-x-2"
  variants={deleteButtonVariants}
  whileHover="hover"
  whileTap="tap"
>
  <motion.svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    variants={deleteIconVariants}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
    />
  </motion.svg>
  <span>ลบ</span>
</motion.button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Environment
                        </label>
                        <StyledWrapper>
                        <select
                          name="environment"
                          value={env.environment}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`environment-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                        >
                          <option value="">Select Environment</option>
                          {ENVIRONMENT_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        </StyledWrapper>
                        {errors[`environment-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`environment-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Server Name
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="serverName"
                          value={env.serverName}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`serverName-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`serverName-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverName-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          IP Address
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="ip"
                          value={env.ip}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`ip-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`ip-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`ip-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Server Type
                        </label>
                        <StyledWrapper>
                        <select
                          name="serverType"
                          value={env.serverType}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`serverType-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                        >
                          <option value="">Select Server Type</option>
                          {SERVER_TYPE_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        </StyledWrapper>
                        {errors[`serverType-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverType-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Server Role
                        </label>
                        <StyledWrapper>
                        <select
                          name="serverRole"
                          value={env.serverRole}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`serverRole-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                        >
                          <option value="">Select Server Role</option>
                          {SERVER_ROLE_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        </StyledWrapper>
                        {errors[`serverRole-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverRole-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Server Duty
                        </label>
                        <StyledWrapper>
                        <select
                          name="serverDuty"
                          value={env.serverDuty}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`serverDuty-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                        >
                          <option value="">Select Server Duty</option>
                          {SERVER_DUTY_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        </StyledWrapper>
                        {errors[`serverDuty-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`serverDuty-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Database
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="database"
                          value={env.database}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`database-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          placeholder="Database management"
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`database-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`database-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Application
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="application"
                          value={env.application}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`application-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          placeholder="Supporting software IIS .net framework"
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`application-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`application-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Operating System
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="operatingSystem"
                          value={env.operatingSystem}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`operatingSystem-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`operatingSystem-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`operatingSystem-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Service Pack
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="servicePack"
                          value={env.servicePack}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`servicePack-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`servicePack-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`servicePack-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Build
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="build"
                          value={env.build}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`build-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`build-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`build-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          CPU
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="cpu"
                          value={env.cpu}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`cpu-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`cpu-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`cpu-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          RAM
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="ram"
                          value={env.ram}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`ram-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`ram-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`ram-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Disk
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="disk"
                          value={env.disk}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`disk-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`disk-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`disk-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          DR
                        </label>
                        <StyledWrapper>
                        <select
                          name="dr"
                          value={env.dr}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`dr-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                        >
                          <option value="">Select DR/DC</option>
                          <option value="DR">DR</option>
                          <option value="DC">DC</option>
                        </select>
                        </StyledWrapper>
                        {errors[`dr-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`dr-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Join Domain
                        </label>
                        <StyledWrapper>
                        <select
                          name="joinDomain"
                          value={env.joinDomain}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`joinDomain-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                        >
                          <option value="">Select Option</option>
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </select>
                        </StyledWrapper>
                        {errors[`joinDomain-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`joinDomain-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Windows Cluster
                        </label>
                        <StyledWrapper>
                        <select
                          name="windowsCluster"
                          value={env.windowsCluster}
                          onChange={(e) => handleEnvironmentChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`windowsCluster-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                        >
                          <option value="">Select Option</option>
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </select>
                        </StyledWrapper>
                        {errors[`windowsCluster-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`windowsCluster-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100 mb-2">
                          Production Unit
                        </label>
                        <div className={`grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md ${
                          errors[`productionUnit-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'
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
                                className={`h-4 w-4 focus:ring-pink-500 rounded ${
                                  errors[`productionUnit-${index}`] 
                                    ? 'border-red-500 text-red-600' 
                                    : 'border-gray-300 text-pink-600'
                                }`}
                              />
                              <label 
                                htmlFor={`productionUnit-${index}-${option}`}
                                className="text-sm text-gray-100"
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
              </motion.div>
            )}

            {/* Step 3: Connection Info */}
            {currentStep === 3 && (
              <motion.div className="space-y-4" variants={fadeInUp}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-100 border-b pb-2">
                    ข้อมูลการเชื่อมต่อ
                  </h3>
                </div>
                {formData.connectionInfo.map((conn, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-100">
                        Server Name: {formData.environmentInfo[index]?.serverName || 'N/A'}
                      </h4>
<motion.button
  type="button"
  onClick={() => removeEntries(index)}
  className="group px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 
    text-white rounded-lg shadow-md hover:from-red-600 hover:to-rose-700
    transform transition-all duration-200 hover:shadow-lg 
    flex items-center space-x-2"
  variants={deleteButtonVariants}
  whileHover="hover"
  whileTap="tap"
>
  <motion.svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    variants={deleteIconVariants}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
    />
  </motion.svg>
  <span>ลบ</span>
</motion.button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Active Directory (AD)
                        </label>
                        <StyledWrapper>
                        <select
                          name="ad"
                          value={conn.ad}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          ADFS
                        </label>
                        <StyledWrapper>
                        <select
                          name="adfs"
                          value={conn.adfs}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          DNS
                        </label>
                        <StyledWrapper>
                        <select
                          name="dns"
                          value={conn.dns}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          NTP
                        </label>
                        <StyledWrapper>
                        <select
                          name="ntp"
                          value={conn.ntp}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          TPAM
                        </label>
                        <StyledWrapper>
                        <select
                          name="tpam"
                          value={conn.tpam}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Netka
                        </label>
                        <StyledWrapper>
                        <select
                          name="netka"
                          value={conn.netka}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          FIM
                        </label>
                        <StyledWrapper>
                        <select
                          name="fim"
                          value={conn.fim}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          FTP Server
                        </label>
                        <StyledWrapper>
                        <select
                          name="ftpServer"
                          value={conn.ftpServer}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          FTP GoAnywhere MFT Server
                        </label>
                        <StyledWrapper>
                        <select
                          name="ftpGoAnywhereMFTServer"
                          value={conn.ftpGoAnywhereMFTServer}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Email SMTP
                        </label>
                        <StyledWrapper>
                        <select
                          name="emailSmtp"
                          value={conn.emailSmtp}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          SMS
                        </label>
                        <StyledWrapper>
                        <select
                          name="sms"
                          value={conn.sms}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          API Management
                        </label>
                        <StyledWrapper>
                        <select
                          name="apiManagement"
                          value={conn.apiManagement}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          DV
                        </label>
                        <StyledWrapper>
                        <select
                          name="dv"
                          value={conn.dv}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          SNMP
                        </label>
                        <StyledWrapper>
                        <select
                          name="snmp"
                          value={conn.snmp}
                          onChange={(e) => handleConnectionChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 4: Security Info */}
            {currentStep === 4 && (
              <motion.div className="space-y-4" variants={fadeInUp}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-100 border-b pb-2">
                    ข้อมูลความปลอดภัย
                  </h3>
                </div>
                {formData.securityInfo.map((security, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-100">
                        Server Name: {formData.environmentInfo[index]?.serverName || 'N/A'}
                      </h4>
                     <motion.button
  type="button"
  onClick={() => removeEntries(index)}
  className="group px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 
    text-white rounded-lg shadow-md hover:from-red-600 hover:to-rose-700
    transform transition-all duration-200 hover:shadow-lg 
    flex items-center space-x-2"
  variants={deleteButtonVariants}
  whileHover="hover"
  whileTap="tap"
>
  <motion.svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    variants={deleteIconVariants}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
    />
  </motion.svg>
  <span>ลบ</span>
</motion.button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          URL Website
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="urlWebsite"
                          value={security.urlWebsite}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`urlWebsite-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`urlWebsite-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`urlWebsite-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Certificate Expire Date
                        </label>
                        <StyledWrapper>
                        <input
                          type="date"
                          name="certificateExpireDate"
                          value={security.certificateExpireDate}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`certificateExpireDate-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`certificateExpireDate-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`certificateExpireDate-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Backup Policy
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="backupPolicy"
                          value={security.backupPolicy}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`backupPolicy-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`backupPolicy-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`backupPolicy-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Downtime Allowed
                        </label>
                        <StyledWrapper>
                        <input
                          type="text"
                          name="downtimeAllowed"
                          value={security.downtimeAllowed}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className={`input mt-1 block w-full rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 
                            ${errors[`downtimeAllowed-${index}`] ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-gray-100'}`}
                          required
                          autoComplete="off"
                        />
                        </StyledWrapper>
                        {errors[`downtimeAllowed-${index}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`downtimeAllowed-${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Centralize Log
                        </label>
                        <StyledWrapper>
                        <select
                          name="centralizeLog"
                          value={security.centralizeLog}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Setup Agent Patch
                        </label>
                        <StyledWrapper>
                        <select
                          name="setupAgentPatch"
                          value={security.setupAgentPatch}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-100">
                          Internet Facing
                        </label>
                        <StyledWrapper>
                        <select
                          name="internetFacing"
                          value={security.internetFacing}
                          onChange={(e) => handleSecurityChange(e, index)}
                          className="input mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 
                            shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                        </StyledWrapper>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Navigation buttons */}
            <motion.div 
              className="flex justify-between pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentStep > 1 && (
                <motion.button
  type="button"
  onClick={prevStep}
  className="px-6 py-3 border-2 border-pink-500 rounded-lg shadow-md
    text-pink-500 font-medium transform transition-all
    duration-200 hover:shadow-lg active:scale-95 flex items-center space-x-2
    hover:bg-pink-500 hover:text-white"
  variants={backButtonVariants}
  initial="initial"
  whileHover="hover"
  whileTap="tap"
>
  <motion.div variants={backIconVariants}>
    <FiArrowLeft className="h-5 w-5" />
  </motion.div>
  <span>ย้อนกลับ</span>
</motion.button>
              )}
              
              <motion.button
                type={currentStep === 4 ? 'submit' : 'button'}
                onClick={currentStep < 4 ? nextStep : handleSubmit}
                disabled={isSubmitting || isSubmitted}
                className={`px-6 py-3 rounded-lg shadow-lg font-medium
                  transform transition-all duration-200 flex items-center space-x-2
                  ${currentStep === 4 
                    ? 'bg-pink-600 hover:bg-pink-700' 
                    : 'bg-pink-500 hover:bg-pink-600'
                  } text-white hover:shadow-xl active:scale-95
                  ${(isSubmitting || isSubmitted) && 'opacity-50 cursor-not-allowed'}`}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <span>
                  {currentStep === 4 
                    ? (isSubmitting ? 'กำลังบันทึก...' : isSubmitted ? 'บันทึกเรียบร้อย' : 'บันทึกข้อมูล')
                    : 'ถัดไป'
                  }
                </span>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      <CSVPreviewModal 
        isOpen={showPreview}
        onClose={handleClosePreview}
        data={csvData}
        onConfirm={handleConfirmImport}
      />
    </div>
  );
}
