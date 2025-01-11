import { motion, AnimatePresence } from 'framer-motion';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'warning' | 'success' | 'error';
}

const Alert = ({ isOpen, onClose, onConfirm, title, message, type }: AlertProps) => {
  const colors = {
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className={`rounded-lg p-6 border-2 shadow-xl ${colors[type]} max-w-md w-full`}>
              <h2 className="text-xl font-bold mb-4">{title}</h2>
              <p className="mb-6">{message}</p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={onClose}
                >
                  ยกเลิก
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-white rounded ${
                    type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                    type === 'success' ? 'bg-green-500 hover:bg-green-600' :
                    'bg-red-500 hover:bg-red-600'
                  }`}
                  onClick={onConfirm}
                >
                  ยืนยัน
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Alert; 