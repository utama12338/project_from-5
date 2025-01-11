// src/components/Sidebar.tsx
import Link from 'next/link';
import { BeakerIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <motion.div
      className="fixed top-0 right-0 h-full w-64 bg-gsb-700 p-4 transform md:hidden shadow-lg"
      animate={{ x: isOpen ? 0 : '100%' }}
      initial={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-semibold">Menu</h2>
        <motion.button
          onClick={onClose}
          className="text-white focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <BeakerIcon className="h-6 w-6" />
        </motion.button>
      </div>
      <nav className="flex flex-col space-y-4">
        {['/forms', '/create', '/admin'].map((path, index) => (
          <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href={path} className="text-gray-300 hover:text-white transition-colors block py-2">
              {path === '/forms' && 'รายการแบบฟอร์ม'}
              {path === '/create' && 'สร้างแบบฟอร์ม'}
              {path === '/admin' && 'Admin'}
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
