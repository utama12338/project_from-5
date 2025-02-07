import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { fetchSystems, deleteSystem, bulkDeleteSystems, searchSystems } from '@/services/api';
import { transformDataForCSV } from './utils/dataTransformers';
import { downloadCSV } from './utils/fileOperations';
// import { SystemInfo } from '../types/forme';
import { SearchCriteria } from './components/SearchModal';
import { SystemData } from '@/types/inputform';
export const useSystemListViewModel = () => {
  const [systems, setSystems] = useState<SystemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'warning' | 'success' | 'error'>('warning');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Show 8 items per page
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [filteredSystems, setFilteredSystems] = useState<SystemData[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [lastSearchCriteria, setLastSearchCriteria] = useState<SearchCriteria>({
    systemName: '',
    serverName: '',
    environment: '',
    ip: '',
    developType: '',
    businessUnit: '',
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedSystems = isFiltering ? filteredSystems : systems;
  const currentSystems = displayedSystems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedSystems.length / itemsPerPage);

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
        await loadSystems(); // Replace window.location.reload() with loadSystems
        setSelectedItems([]); // Clear selections after deletion
      } catch (error) {
        console.error('ลบข้อมูลไม่สำเร็จ:', error);
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
        await Swal.fire({
          title: 'ลบข้อมูลสำเร็จ!',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
        await loadSystems(); // Replace window.location.reload() with loadSystems
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = async (criteria: SearchCriteria) => {
    try {
      setLoading(true);
      const results = await searchSystems(criteria);
      setFilteredSystems(results);
      setIsFiltering(true);
      setCurrentPage(1);
      setLastSearchCriteria(criteria); // Save the last search criteria
    } catch (error) {
      console.error('Error searching systems:', error);
      // Optionally show error message to user
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setFilteredSystems([]);
    setIsFiltering(false);
    setLastSearchCriteria({
      systemName: '',
      serverName: '',
      environment: '',
      ip: '',
      developType: '',
      businessUnit: '',
    });
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
    fetchSystems: loadSystems, // Expose loadSystems as fetchSystems
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
