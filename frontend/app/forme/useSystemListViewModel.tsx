import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { fetchSystems, deleteSystem, bulkDeleteSystems } from './api/systemApi';
import { transformDataForCSV } from './utils/dataTransformers';
import { downloadCSV } from './utils/fileOperations';
import { SystemInfo } from './types';

export const useSystemListViewModel = () => {
  const [systems, setSystems] = useState<SystemInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'warning' | 'success' | 'error'>('warning');

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    try {
      const data = await fetchSystems();
      setSystems(data);
    } catch (error) {
      console.error('Error fetching systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedItems(e.target.checked ? systems.map(system => system.id) : []);
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    const result = await Swal.fire({
      title: `ยืนยันการลบ ${selectedItems.length} รายการ?`,
      text: 'คุณต้องการลบข้อมูลที่เลือกใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบข้อมูล!',
      cancelButtonText: 'ยกเลิก'
    });
  
    if (result.isConfirmed) {
      try {
        await bulkDeleteSystems(selectedItems);
        await showSuccessMessage('สำเร็จ!', 'ลบข้อมูลเรียบร้อยแล้ว');
        window.location.reload();
      } catch (error) {
        showErrorMessage();
      }
    }
  };

  const handleDownloadCSV = () => {
    if (selectedItems.length === 0) {
      alert('No data selected for download.');
      return;
    }

    const transformedData = transformDataForCSV(systems, selectedItems, ['user', 'draftStatus']);
    downloadCSV(transformedData, 'systems-data.csv');
  };

  const handleBulkView = () => {
    if (selectedItems.length === 0) return;
    const queryString = selectedItems.join(',');
    window.location.href = `/systems/view-multiple?ids=${queryString}`;
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบข้อมูล!',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      try {
        await deleteSystem(id);
        Swal.fire({
          title: 'ลบข้อมูลสำเร็จ!',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Error deleting system:', error);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถลบข้อมูลได้.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  return {
    systems,
    loading,
    selectedItems,
    showAlert,
    alertType,
    handleSelectAll,
    handleSelectItem,
    handleBulkDelete,
    handleBulkView,
    handleDelete,
    handleDownloadCSV,
    setShowAlert,
    setAlertType,
  };
};

const showSuccessMessage = (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#3085d6',
  });
};

const showErrorMessage = () => {
  return Swal.fire({
    title: 'เกิดข้อผิดพลาด!',
    text: 'ไม่สามารถลบข้อมูลได้.',
    icon: 'error',
    confirmButtonColor: '#d33',
  });
};
