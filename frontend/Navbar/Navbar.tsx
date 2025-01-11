'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BeakerIcon, UserIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, DocumentIcon, TrashIcon, CogIcon } from '@heroicons/react/24/solid';
import Sidebar from './Sidebar';
import axios from 'axios';

interface TrashItem {
  id: number;
  name: string;
  date: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const [trashCount, setTrashCount] = useState(0);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const userPanelRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserPanel = async () => {
    setIsUserPanelOpen(!isUserPanelOpen);
    if (!isUserPanelOpen) {
      try {
        const draftResponse = await axios.get('http://localhost:4000/form/getformedraft_Count');
        const trashResponse = await axios.get('http://localhost:4000/form/getformesoftdelete_Count');
        setDraftCount(draftResponse.data.count);
        setTrashCount(trashResponse.data.count);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    }
  };

  const closeUserPanel = () => {
    setIsUserPanelOpen(false);
  };

  const openTrashModal = async () => {
    setIsTrashModalOpen(true);
    try {
      const response = await axios.get('http://localhost:4000/form/getTrashItems');
      setTrashItems(response.data);
    } catch (error) {
      console.error('Error fetching trash items:', error);
    }
  };

  const closeTrashModal = () => {
    setIsTrashModalOpen(false);
    setSelectedItems([]);
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handlePermanentDelete = async () => {
    try {
      await axios.post('http://localhost:4000/form/permanentDelete', { ids: selectedItems });
      setTrashItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      closeTrashModal();
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  const handleRestore = async () => {
    try {
      await axios.post('http://localhost:4000/form/restore', { ids: selectedItems });
      setTrashItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      closeTrashModal();
    } catch (error) {
      console.error('Error restoring items:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userPanelRef.current && !userPanelRef.current.contains(event.target as Node)) {
        closeUserPanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <motion.nav
        className="bg-gsb-500 p-4 sticky top-0 z-50 shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* โลโก้ */}
          <Link href="/" className="flex items-center space-x-2 text-white text-2xl font-bold">
            <BeakerIcon className="h-8 w-8 text-white" />
            <span>หน้าหลัก</span>
          </Link>

          {/* ปุ่มเมนู (Mobile) */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? (
                <BeakerIcon className="h-6 w-6" />
              ) : (
                <BeakerIcon className="h-6 w-6" />
              )}
            </motion.button>
          </div>

          {/* เมนูหลัก (Desktop) */}
          <div className="hidden md:flex space-x-6">
            {['/forms', '/create', '/admin'].map((path, index) => (
              <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href={path} className="text-gray-300 hover:text-white transition-colors">
                  {path === '/forms' && 'รายการแบบฟอร์ม'}
                  {path === '/create' && 'สร้างแบบฟอร์ม'}
                  {path === '/admin' && 'Admin'}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* User Icon */}
          <div className="relative">
            <motion.button
              onClick={toggleUserPanel}
              className="text-white focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <UserIcon className="h-6 w-6" />
            </motion.button>
            {isUserPanelOpen && (
              <motion.div
                ref={userPanelRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onMouseLeave={closeUserPanel}
              >
                <Link href="/login" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Login
                </Link>
                <Link href="/logout" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </Link>
                <Link href="/webpage/web_views/draft" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <DocumentIcon className="h-5 w-5 mr-2" />
                  Draft
                  <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">{draftCount}</span>
                </Link>
                <button
                  onClick={openTrashModal}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Trash
                  <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">{trashCount}</span>
                </button>
                <Link href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <CogIcon className="h-5 w-5 mr-2" />
                  Settings
                </Link>
              </motion.div>
            )}
          </div>

          {/* Sidebar สำหรับ Mobile */}
          <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />
        </div>
      </motion.nav>

      {/* Trash Modal */}
      {isTrashModalOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Trash</h2>
            <div className="overflow-y-auto max-h-96">
              {trashItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between mb-2">
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="mr-2"
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{item.date}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleRestore}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Restore
              </button>
              <button
                onClick={handlePermanentDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Permanent Delete
              </button>
              <button
                onClick={closeTrashModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
