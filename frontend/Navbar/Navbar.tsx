"use client";

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
// import { FaServer, FaDatabase, FaNetworkWired, FaShieldAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { FaServer,  FaPlus  } from 'react-icons/fa';
import { colors } from '../app/styles/theme';

const pageTitles: { [key: string]: string } = {
  '/': 'ระบบทั้งหมด | All Systems',
  '/systemmanage': 'จัดการระบบ | System Management',
  '/connection': 'การเชื่อมต่อระบบ | System Connection',
  '/security': 'ความปลอดภัย | Security',
  '/add': 'เพิ่มข้อมูล | Add Information',
  '/search': 'ค้นหา | Search'
};

const menuItems = [
  { icon: <FaServer className="w-5 h-5" />, text: 'ระบบทั้งหมด', link: '/form' },
  // { icon: <FaDatabase className="w-5 h-5" />, text: 'จัดการระบบ', link: '/systemmanage' },
  // { icon: <FaNetworkWired className="w-5 h-5" />, text: 'เชื่อมต่อระบบ', link: '/connection' },
  // { icon: <FaShieldAlt className="w-5 h-5" />, text: 'ความปลอดภัย', link: '/security' },
  { icon: <FaPlus className="w-5 h-5" />, text: 'เพิ่มระบใหม่', link: '/inputform' },
  // { icon: <FaSearch className="w-5 h-5" />, text: 'ค้นหา', link: '/search' },
];

// เส้นทางที่ต้องการซ่อน Navbar
const hideNavbarPaths = ['/login', '/register'];

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pathname = usePathname();

  // ซ่อน Navbar ในบางหน้า
  if (hideNavbarPaths.includes(pathname)) {
    return null;
  }

  return (
    <nav style={{ backgroundColor: colors.background.primary }} className="p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-xl font-bold">
          {pageTitles[pathname] || 'System Management'}
        </div>

        {/* Menu Items */}
        <div className="hidden md:flex items-center space-x-1">
          {menuItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              className={`relative px-4 py-2 hover:text-white transition-colors ${
                activeIndex === index 
                  ? 'text-white' 
                  : `text-white/80`
              }`}
              style={{
                backgroundColor: activeIndex === index 
                  ? `${colors.button.primary.background}20` 
                  : 'transparent'
              }}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-2">
                {item.icon}
                <span>{item.text}</span>
              </span>
              {activeIndex === index && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 w-full rounded-full"
                  style={{ backgroundColor: colors.button.primary.background }}
                  layoutId="underline"
                />
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </nav>
  );
}
