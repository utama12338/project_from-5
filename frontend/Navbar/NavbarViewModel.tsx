import { useState, useRef } from 'react';
import {fetchDraftCount,fetchTrashCount,fetchTrashItems,permanentDeleteItems,restoreItems,} from '../app/forme/api';

interface TrashItem {
  id: number;
  name: string;
  date: string;
}

export const useNavbarViewModel = () => {
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
      const trashItems = await fetchTrashItems();
      setTrashItems(trashItems);
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
  };
};
