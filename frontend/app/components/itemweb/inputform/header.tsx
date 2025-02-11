import { motion } from 'framer-motion';
import { FiDatabase } from 'react-icons/fi';
import { colors, line } from '@/styles/theme';
import { RefObject } from 'react';

interface HeaderProps {
  // Update the type to allow null
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleImportCSV: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Header({ fileInputRef, handleImportCSV }: HeaderProps) {
  return (
    <div className="text-center mb-12">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          color: colors.text.primary,
          background: `linear-gradient(to right, ${colors.button.primary.background}, ${colors.button.primary.hover})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        className="text-4xl font-bold tracking-tight mb-4"
      >
        เพิ่มข้อมูลระบบ
      </motion.h1>
      <motion.div 
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "200px" }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{
          height: "2px",
          background: line.line,
          margin: "0 auto",
          borderRadius: "4px"
        }}
      />  
      <div className="flex justify-center mt-6 space-x-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportCSV}
          accept=".csv"
          className="hidden"
        />
        <button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className="px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white rounded-lg shadow-lg
          hover:from-green-500 hover:via-green-600 hover:to-green-700 transform transition-all duration-200
          hover:shadow-xl active:scale-95 flex items-center space-x-2"
        >
          <FiDatabase className="w-5 h-5" />
          <span>Import CSV</span>
        </button>
      </div>
    </div>
  );
}