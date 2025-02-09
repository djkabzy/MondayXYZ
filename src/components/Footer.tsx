"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Privacy from "./Privacy";
import dynamic from 'next/dynamic';

const Disclaimer = dynamic(() => import('./Disclaimer'), {
  ssr: false
});

export default function Footer() {
  return (
    <motion.footer 
      className="fixed bottom-0 left-0 right-0 text-center py-4 text-sm text-gray-600 dark:text-gray-400 bg-gradient-to-t from-background to-transparent optimize-gpu z-[999]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-row items-center justify-center space-x-6 flex-nowrap">
          <Privacy />
          <div className="h-4 w-px bg-gray-700/50"></div>
          <Disclaimer />
        </div>
        <div className="flex flex-col items-center space-y-1">
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> by Kabz
          </p>
          <p>© 2025 Monday.xyz. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}
