'use client'
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import CustomAlert from './select';
import { useSystemListViewModel } from './useSystemListViewModel';
import axios from 'axios'
import SearchModal from './components/SearchModal';
import DetailViewModal from '../components/DetailViewModal';
import { colors, shadows, transitions } from '../styles/theme';
import AddSystemButton from '../components/button/addsystem';
import SearchButton from '../components/button/search';
import EditButton from '../components/button/edite';
import DetailButton from '../components/button/detail';
import FormBox from '../components/form/form_box';

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

  const [selectedSystems, setSelectedSystems] = useState<any[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Add helper function to get selected systems
  const getSelectedSystems = () => {
    return systems.filter(system => selectedItems.includes(system.id));
  };

  // Update the bulk view button click handler
  const handleBulkViewClick = () => {
    const systemsToView = getSelectedSystems();
    setSelectedSystems(systemsToView);
    setShowDetailModal(true);
  };

  // Add handler for single system view
  const handleSingleSystemView = (system: any) => {
    setSelectedSystems([system]); // Put single system in array
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.background.primary }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.button.primary.background }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: colors.background.primary }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <AddSystemButton />
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>ระบบทั้งหมด</h1>
          <div className="flex space-x-3">
            {selectedItems.length === 0 ? (
              <>
                <div onClick={() => setShowSearchModal(true)}>
                  <SearchButton />
                </div>
                {isFiltering && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSearch}
                    style={{
                      backgroundColor: colors.input.background,
                      color: colors.text.primary,
                      transition: transitions.default
                    }}
                    className="px-4 py-2 rounded-lg hover:bg-opacity-80"
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
                  style={{
                    backgroundColor: colors.button.danger.background,
                    transition: transitions.default
                  }}
                  className="px-4 py-2 text-white rounded-lg hover:bg-opacity-80"
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
                <DetailButton 
                  onClick={handleBulkViewClick} 
                  isBulk={true} 
                  count={selectedItems.length}
                />
              </>
            )}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentSystems.map((system) => (
            <motion.div
              key={system.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <FormBox
                header={`ชื่อระบบ: ${system.systemName}`}
                rightHeaderContent={
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(system.id)}
                      onChange={() => handleSelectItem(system.id)}
                      className="rounded"
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
                }
              >
                <div className="space-y-4">
                  {/* Environment info */}
                  {Array.isArray((system as { environmentInfo?: { serverName: string; environment: string; ip: string }[] }).environmentInfo) &&
    (system as { environmentInfo?: { serverName: string; environment: string; ip: string }[] }).environmentInfo!.map(
      (env, index) => (
                      <div key={index} className="space-y-2">
                        <p className="text-sm text-gray-300">
                          <span className="font-medium">Servername:</span> {env.serverName}
                        </p>
                        <p className="text-sm text-gray-400">
                          <span className="font-medium">Environment:</span> {env.environment}
                        </p>
                        <p className="text-sm text-gray-400">
                          <span className="font-medium">IP server:</span> {env.ip}
                        </p>
                      </div>
                    ))}
                  
                  {/* Action buttons */}
                  <div className="space-y-2 pt-4">
                    <Link href={`/edit_publish/${system.id}`}>
                      <EditButton />
                    </Link>
                    <DetailButton onClick={() => handleSingleSystemView(system)} />
                  </div>
                </div>
              </FormBox>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center items-center space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{
              backgroundColor: currentPage === 1 ? colors.input.background : colors.button.primary.background,
              color: colors.text.primary,
              transition: transitions.default
            }}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-opacity-80'
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
            style={{
              backgroundColor: currentPage === totalPages ? colors.input.background : colors.button.primary.background,
              color: colors.text.primary,
              transition: transitions.default
            }}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? 'cursor-not-allowed'
                : 'hover:bg-opacity-80'
            }`}
          >
            ถัดไป
          </button>
        </div>
      </div>

      {/* Keep modals and alerts outside the container but inside the wrapper */}
      {/* SearchModal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
        initialCriteria={lastSearchCriteria}
      />

      {/* CustomAlert */}
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

      {/* DetailViewModal */}
      {showDetailModal && (
        <DetailViewModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          systems={selectedSystems}
        />
      )}
    </div>
  );
}