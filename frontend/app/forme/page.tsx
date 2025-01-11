'use client'
import { useEffect } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import CustomAlert from './select';
import { useSystemListViewModel } from './useSystemListViewModel';

export default function SystemList() {
  const {
    systems,
    loading,
    selectedItems,
    showAlert,
    alertType,
    handleSelectAll,
    handleSelectItem,
    handleBulkDelete,
    handleDownloadCSV,
    setShowAlert,
    setAlertType,
  } = useSystemListViewModel();

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
                onClick={useSystemListViewModel.handleBulkView}
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




















