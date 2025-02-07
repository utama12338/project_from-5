
import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { api } from '@/services/api';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  CSVValidationResult, 
  CSVRowData 
} from '@/types/inputform';

export const useCSVImport = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [csvData, setCsvData] = useState<CSVValidationResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateCSVRow = async (row: CSVRowData, index: number): Promise<CSVValidationResult> => {
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
      const exists = await api.checkSystem(row.systemName);
      if (exists) {
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

    Papa.parse<CSVRowData>(file, {
      header: true,
      complete: async (results) => {
        const validationPromises = results.data.map((row: CSVRowData, index: number) => 
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
      for (const row of csvData) {
        if (row.status === 'invalid') continue;

        const endpoint = row.status === 'update' ? '/api/system/update' : 
                        row.status === 'incomplete' ? '/api/system/draft' : 
                        '/api/system/create';

        await axios.post(endpoint, row.data);
      }

      setShowPreview(false);
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

  const handleClosePreview = () => {
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    showPreview,
    csvData,
    fileInputRef,
    handleImportCSV,
    handleConfirmImport,
    handleClosePreview
  };
};


  // Get step icon based on current step
  // const getStepIcon = (step: number) => {
  //   switch(step) {
  //     case 1: return <FiDatabase className="w-6 h-6" />;
  //     case 2: return <FiServer className="w-6 h-6" />;
  //     case 3: return <FiLink className="w-6 h-6" />;
  //     case 4: return <FiShield className="w-6 h-6" />;
  //     default: return null;
  //   }
  // };