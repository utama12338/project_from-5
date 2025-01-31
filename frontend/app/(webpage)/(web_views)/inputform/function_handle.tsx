import { useState } from 'react';
  import { api } from '../../../services/api';
  import { useRouter } from 'next/navigation';
  import Swal from 'sweetalert2';
  import { validateForm } from '../../../utils/validation';
  import { FormData, FormChangeEvent, ValidationErrors } from '../../../types/inputform';
  
  export const useFormHandlers = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
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
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูล (เหมือนเดิม)
  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ฟังก์ชันสำหรับไปขั้นตอนถัดไป
  const nextStep = () => {
    const validationErrors = validateForm(currentStep, formData);
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(prev => prev + 1);
    } else {
      setErrors(validationErrors);
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

    // ตรวจสอบความถูกต้องของข้อมูลด้วย validateForm แทนการใช้ HTML5 validation
    const validationErrors = validateForm(currentStep, formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({
        title: 'ข้อมูลไม่ครบถ้วน!',
        text: 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.createSystem(formData);
      console.log('Success:', response);
      
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
  };

  const handleEnvironmentChange = (
    e: { target: { name: string; value: string | string[] } },
    index: number
  ) => {
    const { name, value } = e.target;
  
    if (name === 'productionUnit') {
      const updatedUnits = Array.isArray(value) ? value : [value];
      setFormData(prev => ({
        ...prev,
        environmentInfo: prev.environmentInfo.map((env, i) => 
          i === index ? { ...env, [name]: updatedUnits } : env
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        environmentInfo: prev.environmentInfo.map((env, i) => 
          i === index ? { ...env, [name]: value } : env
        )
      }));
    }
  };

  const handleConnectionChange = (e: { target: { name: string; value: string } }, index: number) => {
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
    e: FormChangeEvent | { target: { name: string; value: string } }, 
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
  // Add function to remove entries
  const removeEntries = (index: number) => {
    setFormData(prev => ({
      ...prev,
      environmentInfo: prev.environmentInfo.filter((_, i) => i !== index),
      connectionInfo: prev.connectionInfo.filter((_, i) => i !== index),
      securityInfo: prev.securityInfo.filter((_, i) => i !== index)
    }));
  };


  const handleDateChange = (date: Date | null, index: number) => {
    setFormData(prev => {
      const newSecurityInfo = [...prev.securityInfo];
      newSecurityInfo[index] = {
        ...newSecurityInfo[index],
        certificateExpireDate: date ? date.toISOString().split('T')[0] : ''
      };
      return {
        ...prev,
        securityInfo: newSecurityInfo
      };
    });
  };
  
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

    return {
      currentStep,
      formData,
      errors,
      isSubmitting,
      isSubmitted,
      handleChange,
      nextStep,
      prevStep,
      handleSubmit,
      handleEnvironmentChange,
      handleConnectionChange,
      handleSecurityChange,
      handleDateChange,
      addNewEntries,
      removeEntries
    };
  };

