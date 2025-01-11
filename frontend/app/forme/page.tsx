'use client'
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import Link from 'next/link';
import Swal from 'sweetalert2';
import CustomAlert from './select';
import Papa from 'papaparse';
interface SystemInfo {
  id: number;
  systemName: string;
  developType: string;
  businessUnit: string;
  developUnit: string;
  createdAt: string;
  updatedAt: string;
}

export default function SystemList() {
  const [systems, setSystems] = useState<SystemInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'warning' | 'success' | 'error'>('warning');

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/form/getforme');
        setSystems(response.data);
      } catch (error) {
        console.error('Error fetching systems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystems();
  }, []);

  // เลือกทั้งหมด
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(systems.map(system => system.id));
    } else {
      setSelectedItems([]);
    }
  };

  // เลือกแต่ละรายการ
  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // ลบหลายรายการ
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
        await Promise.all(
          selectedItems.map(id => 
            axios.delete(`http://localhost:4000/form/softdeleteforme/${id}`)
          )
        );
        
        Swal.fire('สำเร็จ!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting items:', error);
        Swal.fire('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้', 'error');
      }
    }
  };

  // ดูรายละเอียดหลายรายการ
  const handleBulkView = () => {
    if (selectedItems.length === 0) return;
    const queryString = selectedItems.join(',');
    window.location.href = `/systems/view-multiple?ids=${queryString}`;
  };

  // ฟังก์ชันสำหรับลบข้อมูล
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
        await axios.delete(`http://localhost:4000/form/softdeleteforme/${id}`);
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



  // ฟังก์ชันสำหรับดาวน์โหลดข้อมูลเป็น CSV
const handleDownloadCSV = () => {
  const dataToDownload = systems.filter(system => selectedItems.includes(system.id));

  if (dataToDownload.length === 0) {
    alert('No data selected for download.');
    return;
  }

  const keysToRemove = ['user', 'draftStatus'];
  
  // Transform data and handle arrays
  const transformedData: { [key: string]: string }[] = [];
  
  dataToDownload.forEach(item => {
    const processArrays = (obj: any, prefix = '', baseRow: { [key: string]: string } = {}) => {
      let rows: { [key: string]: string }[] = [{ ...baseRow }];
      
      for (const key in obj) {
        if (!obj.hasOwnProperty(key) || keysToRemove.includes(key)) continue;
        
        const newKey = prefix ? `${key}` : key;
        const value = obj[key];
        
        if (Array.isArray(value)) {
          // Handle array fields by creating multiple rows
          const newRows: { [key: string]: string }[] = [];
          
          value.forEach(arrayItem => {
            if (typeof arrayItem === 'object' && arrayItem !== null) {
              // Process nested objects within array
              rows.forEach(existingRow => {
                const arrayRows = processArrays(arrayItem, newKey, { ...existingRow });
                newRows.push(...arrayRows);
              });
            } else {
              // Handle primitive values in array
              rows.forEach(existingRow => {
                newRows.push({
                  ...existingRow,
                  [newKey]: String(arrayItem)
                });
              });
            }
          });
          
          if (newRows.length > 0) rows = newRows;
        } else if (typeof value === 'object' && value !== null) {
          // Process nested objects
          rows = rows.map(existingRow => {
            const nestedRows = processArrays(value, newKey, existingRow);
            return nestedRows[0]; // Take first row if multiple were created
          });
        } else {
          // Handle primitive values
          rows.forEach(row => {
            row[newKey] = String(value);
          });
        }
      }
      
      return rows;
    };
    
    const itemRows = processArrays(item);
    transformedData.push(...itemRows);
  });

  // Convert to CSV
  const csv = Papa.unparse(transformedData);

  // Add BOM for Unicode support
  const csvWithBOM = '\uFEFF' + csv;

  // Create Blob and download
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'systems-data.csv';
  document.body.appendChild(a);
  a.click();


  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

  




  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
             
          <Link 
          href="/" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          เพิ่มระบบใหม่
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">ระบบทั้งหมด ที่ public</h1>
        <div className="flex space-x-3">
          {selectedItems.length > 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBulkView}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                ดูรายละเอียด ({selectedItems.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                ลบที่เลือก ({selectedItems.length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadCSV}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                ดาวน์โหลด CSV ({selectedItems.length})
              </motion.button>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedItems.length === systems.length}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อระบบ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หน่วยงาน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้พัฒนา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เริ่มระบบ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {systems.map((system) => (
              <motion.tr 
                key={system.id}
                className={`hover:bg-gray-50 ${
                  selectedItems.includes(system.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(system.id)}
                    onChange={() => handleSelectItem(system.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{system.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{system.systemName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{system.developType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{system.businessUnit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{system.developUnit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(system.createdAt).toLocaleDateString('th-TH')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link 
                      href={`/systems/${system.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      ดูรายละเอียด
                    </Link>
                    <Link 
                      href={`/edit/${system.id}`}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDelete(system.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alert Component สำหรับการลบหลายรายการ */}
      <CustomAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={async () => {
          try {
            await Promise.all(
              selectedItems.map(id => 
                axios.delete(`http://localhost:4000/users/forme/${id}`)
              )
            );
            setAlertType('success');
            setTimeout(() => {
              setShowAlert(false);
              window.location.reload();
            }, 1500);
          } catch (error) {
            console.error('Error deleting systems:', error);
            setAlertType('error');
          }
        }}
        type={alertType}
      />
    </div>
  );
}
















  



