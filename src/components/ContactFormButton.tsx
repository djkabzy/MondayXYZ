"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ContactForm from "./ContactForm";

export default function ContactFormButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-[#F2A900] text-white rounded-lg hover:bg-[#F2A900]/90 transition-all font-medium shadow-lg text-sm border border-[#F2A900]/20 backdrop-blur-sm transform hover:scale-[1.02] hover:shadow-xl w-full max-w-xs mx-auto flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Make an Offer
      </motion.button>
      <ContactForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
