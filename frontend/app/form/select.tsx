// เพิ่มส่วนนี้ที่ด้านบนของไฟล์ ก่อน export default function SystemList()
import { motion, AnimatePresence } from "framer-motion";
const CustomAlert =   ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    type = 'warning' 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    onConfirm: () => void; 
    type?: 'warning' | 'success' | 'error';
  }) => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl z-50 w-96"
          >
            {/* Alert content */}
            <h3 className="text-xl font-semibold mb-4 text-center">
              {type === 'warning' ? 'ยืนยันการลบ?' : type === 'success' ? 'สำเร็จ!' : 'ผิดพลาด!'}
            </h3>
            <div className="flex justify-center space-x-3">
              {type === 'warning' && (
                <>
                  <motion.button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg">ยืนยัน</motion.button>
                  <motion.button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">ยกเลิก</motion.button>
                </>
              )}s
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  export default CustomAlert