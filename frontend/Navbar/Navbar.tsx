"use client";

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTachometerAlt, FaAddressBook, FaClone, FaCalendarAlt, FaChartBar, FaCopy } from 'react-icons/fa';

const menuItems = [
  { icon: <FaTachometerAlt />, text: 'Dashboard', link: '/' },
  { icon: <FaAddressBook />, text: 'Address Book', link: '/address' },
  { icon: <FaClone />, text: 'Components', link: '/components' },
  { icon: <FaCalendarAlt />, text: 'Calendar', link: '/calendar' },
  { icon: <FaChartBar />, text: 'Charts', link: '/charts' },
  { icon: <FaCopy />, text: 'Documents', link: '/documents' },
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
    <nav className="bg-[#5161ce] p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-xl font-bold">Logo</div>

        {/* Menu Items */}
        <div className="hidden md:flex items-center space-x-1">
          {menuItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              className={`relative px-4 py-2 text-white/80 hover:text-white transition-colors ${
                activeIndex === index ? 'text-white' : ''
              }`}
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
                  className="absolute bottom-0 left-0 h-1 w-full bg-white rounded-full"
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
