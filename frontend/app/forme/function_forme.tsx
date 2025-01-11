import axios from "axios";
import Swal from "sweetalert2"
import { useEffect, useState } from 'react';
const [systems, setSystems] = useState<SystemInfo[]>([]);
const [selectedItems, setSelectedItems] = useState<number[]>([]);


interface SystemInfo {
    id: number;
    systemName: string;
    developType: string;
    businessUnit: string;
    developUnit: string;
    createdAt: string;
    updatedAt: string;
  }


export const handleBulkDelete = async () => {
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




  export const  handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(systems.map(system => system.id));
    } else {
      setSelectedItems([]);
    }
  };

  // เลือกแต่ละรายการ
  export const handleSelectItem = (id: number) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };




  export const handleBulkView = () => {
    if (selectedItems.length === 0) return;
    const queryString = selectedItems.join(',');
    window.location.href = `/systems/view-multiple?ids=${queryString}`;
  };
  