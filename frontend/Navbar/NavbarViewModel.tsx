import { useState, useRef } from 'react';
import {fetchDraftCount,fetchTrashCount,getTrash,permanentDeleteItems,restoreItems,} from '../app/forme/api';
import axios from 'axios'
interface TrashItem {
  id: number;
  systemName: string;  // Changed from name
  deletedAt: string;   // Changed from date
  timeRemaining: string; // Added new field
}

export const useNavbarViewModel = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const [trashCount, setTrashCount] = useState(0);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]); // Ensure it's initialized as an empty array
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const userPanelRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserPanel = async () => {
    setIsUserPanelOpen(!isUserPanelOpen);
    if (!isUserPanelOpen) {
      try {
        const draftCount = await fetchDraftCount();
        const trashCount = await fetchTrashCount();
        setDraftCount(draftCount);
        setTrashCount(trashCount);
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
      const items = await getTrash();
      if (Array.isArray(items)) {
        setTrashItems(items);
      } else {
        console.error('Received invalid trash items format:', items);
        setTrashItems([]);
      }
    } catch (error) {
      console.error('Error fetching trash items:', error);
      setTrashItems([]);
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
      await permanentDeleteItems(selectedItems);
      setTrashItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      closeTrashModal();
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreItems(selectedItems);
      setTrashItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      closeTrashModal();
    } catch (error) {
      console.error('Error restoring items:', error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const allIds = trashItems.map(item => item.id);
    setSelectedItems(checked ? allIds : []);
  };

  return {
    isMenuOpen,
    isUserPanelOpen,
    isTrashModalOpen,
    draftCount,
    trashCount,
    trashItems,
    selectedItems,
    userPanelRef,
    toggleMenu,
    toggleUserPanel,
    closeUserPanel,
    openTrashModal,
    closeTrashModal,
    handleSelectItem,
    handlePermanentDelete,
    handleRestore,
    setSelectedItems, // Add this line
    handleSelectAll,  // Add this line
  };
};
