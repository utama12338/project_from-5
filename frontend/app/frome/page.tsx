'use client'
import { useEffect } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import CustomAlert from './select';
import { useSystemListViewModel } from './useSystemListViewModel';
import axios from 'axios'
import SearchModal from './components/SearchModal';

export default function SystemList() {
  const {
    systems,
    fetchSystems, // Make sure this is exposed from the view model
    loading,
    selectedItems,
    showAlert,
    alertType,
    handleSelectItem,
    handleBulkDelete,
    handleDownloadCSV,
    setShowAlert,
    setAlertType,
    handleBulkView,
    handleDelete,
    currentSystems,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
    showSearchModal,
    setShowSearchModal,
    handleSearch,
    clearSearch,
    isFiltering,
    lastSearchCriteria,
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
        <h1 className="text-2xl font-bold text-gray-900">ระบบทั้งหมด</h1>
        <div className="flex space-x-3">
          {selectedItems.length === 0 ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearchModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
              >
                <i className="fas fa-search mr-2"></i>
                ค้นหา
              </motion.button>
              {isFiltering && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  ล้างการค้นหา
                </motion.button>
              )}
            </>
          ) : (
            <>
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

      {/* Add SearchModal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        initialCriteria={lastSearchCriteria} // Pass the last search criteria
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentSystems.map((system) => (
          <motion.div
            key={system.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden ${
              selectedItems.includes(system.id) ? 'ring-2 ring-blue-500' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Card Header */}
            <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
              <input
                type="checkbox"
                checked={selectedItems.includes(system.id)}
                onChange={() => handleSelectItem(system.id)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex space-x-2">
                <Link
                  href={`/edit/${system.id}`}
                  className="p-2 text-yellow-600 hover:text-yellow-900 transition-colors"
                >
                  <i className="fas fa-edit text-lg"></i>
                </Link>
                <button
                  onClick={() => handleDelete(system.id)}
                  className="p-2 text-red-600 hover:text-red-900 transition-colors"
                >
                  <i className="fas fa-trash text-lg"></i>
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">ชื่อระบบ:
                {system.systemName}
              </h3>
              
              {system.environmentInfo && system.environmentInfo.map((env, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Servername:</span> {env.serverName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Environment:</span> {env.environment}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">IP server:</span> {env.ip}
                  </p>
                </div>
              ))}
            </div>

            {/* Updated Card Footer with Edit and View Details buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t space-y-2">
              <Link
                href={`/edit_publish/${system.id}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors mb-2"
              >
                แก้ไขข้อมูล
                <i className="fas fa-edit ml-2"></i>
              </Link>
              <Link
                href={`/systems/${system.id}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                ดูรายละเอียด
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center items-center space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          ย้อนกลับ
        </button>
        <span className="text-gray-700">
          หน้า {currentPage} จาก {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          ถัดไป
        </button>
      </div>

      {/* Alert Component สำหรับการลบหลายรายการ */}
      <CustomAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={async () => {
          try {
            await Promise.all(
              selectedItems.map(id => 
                axios.delete(`http://localhost:4000/from/deleteforme/${id}`)
              )
            );
            setAlertType('success');
            // Instead of reloading window, fetch fresh data
            await fetchSystems();
            setShowAlert(false);
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




















