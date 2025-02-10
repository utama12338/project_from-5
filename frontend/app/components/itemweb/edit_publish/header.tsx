"use client"
import { motion } from 'framer-motion';
import { Share2, Save } from 'lucide-react';
import {  line } from '@/styles/theme';

interface HeaderProps {
  handleShareAction: () => void;
  handleSaveAction: () => void;
}

export default function Header({ handleShareAction, handleSaveAction }: HeaderProps) {
  return (
    <div className="container mx-auto px-4 max-w-[98%]">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-violet-500 dark:from-pink-400 dark:to-violet-400 bg-clip-text text-transparent"
        >
          แก้ไขระบบ
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "200px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="h-1 mx-auto mt-4 rounded-full"
          style={{ background: line.line }}
        />
        <div className="flex justify-center mt-6 space-x-4">
          <motion.button
            onClick={handleShareAction}
            className="inline-flex items-center px-6 py-2 rounded-full
                     bg-opacity-10 dark:bg-opacity-20
                     backdrop-blur-sm
                     text-pink-600 dark:text-pink-400
                     border border-pink-200 dark:border-pink-800
                     hover:bg-pink-100 dark:hover:bg-pink-900
                     hover:border-pink-400 dark:hover:border-pink-600
                     transition-all duration-200"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)'
            }}
            transition={{ duration: 0.2 }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            แชร์
          </motion.button>
          <motion.button
            onClick={handleSaveAction}
            className="inline-flex items-center px-6 py-2 rounded-full
                     bg-gradient-to-r from-pink-500 to-violet-500
                     dark:from-pink-600 dark:to-violet-600
                     hover:from-pink-600 hover:to-violet-600
                     dark:hover:from-pink-500 dark:hover:to-violet-500
                     text-white
                     shadow-lg shadow-pink-500/30 dark:shadow-pink-800/30"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 25px rgba(236, 72, 153, 0.5)'
            }}
            transition={{ duration: 0.2 }}
          >
            <Save className="w-4 h-4 mr-2" />
            บันทึก
          </motion.button>
        </div>
      </div>
    </div>
  );
}