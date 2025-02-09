"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import ContactForm from "@/components/ContactForm";
import Typewriter from 'typewriter-effect';
import CryptoTicker from "@/components/CryptoTicker";
import CryptoConverter from "@/components/CryptoConverter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/Footer";
import FAQs from "@/components/FAQs";

const queryClient = new QueryClient();

export default function HomePage() {
  const [isConverterActive, setIsConverterActive] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  


  return (
    <QueryClientProvider client={queryClient}>
      <div>
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-100 via-gray-200 to-gray-100 dark:from-black dark:via-gray-900 dark:to-black p-4 md:p-8 transition-colors duration-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-purple-500/5 to-transparent"></div>
        <div className="relative flex flex-col items-center justify-center">
          <motion.button
            onClick={() => setIsContactFormOpen(true)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="group mb-2 text-lg sm:text-xl lg:text-2xl text-[#5841D8] dark:text-[#F2A900]
              transition-all duration-300 cursor-pointer font-semibold text-center px-4 py-2
              rounded-lg hover:bg-[#5841D8]/5 dark:hover:bg-[#F2A900]/5 relative overflow-hidden
              max-w-[95vw] lg:max-w-3xl mx-auto backdrop-blur-xl border border-[#5841D8]/30
              dark:border-[#F2A900]/30 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
              hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-1
              focus:ring-[#5841D8]/50 dark:focus:ring-[#F2A900]/50 focus:ring-offset-1
              focus:ring-offset-background pointer-events-auto select-none z-50 relative"
            role="button"
            tabIndex={0}
            aria-label="Open contact form to make an offer"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsContactFormOpen(true);
              }
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px -20px rgba(88, 65, 216, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 block leading-relaxed tracking-wide group-hover:scale-[1.01] transition-transform will-change-transform">
              <span className="inline-block text-shadow-sm leading-tight">This Ultra-Premium Domain Monday.xyz And Tool Is For Sale.</span>
              <span className="text-[#F2A900] dark:text-[#5841D8] block text-base sm:text-lg lg:text-xl font-medium mt-0.5
                group-hover:text-[#6E5AE6] dark:group-hover:text-[#FFD700] transition-colors">
                Accepting Offers in Fiat or Crypto
              </span>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#5841D8]/30 via-[#F2A900]/20 to-[#5841D8]/30 pointer-events-none"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                bg-gradient-to-br from-[#5841D8]/10 to-[#F2A900]/10"
            />
            <motion.div
              className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-all duration-500
                bg-gradient-to-r from-[#5841D8] via-[#F2A900] to-[#5841D8] rounded-2xl"
              style={{ mixBlendMode: 'overlay' }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#5841D8]/5 to-[#F2A900]/5 opacity-0 group-hover:opacity-100"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#5841D8]/5 to-[#F2A900]/5"
            />
          </motion.button>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 text-4xl sm:text-7xl font-black uppercase p-4 inline-block hover:cursor-pointer transform-gpu transition-all duration-500 ease-out hover:rotate-1 text-center"
          >
            <span className="gradient-text neon-glow">
              MONDAY
            </span>
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 text-3xl font-bold text-gray-800 dark:text-gray-100 text-center max-w-3xl leading-tight"
          >
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("Trade Smarter. Convert Faster. Stay Ahead in Crypto.")
                  .pauseFor(500)
                  .typeString(" All in Real-Time with Monday ")
                  .pauseFor(300)
                  .callFunction(() => {
                    const rocketSpan = document.createElement('span');
                    rocketSpan.innerHTML = '🚀';
                    rocketSpan.className = 'inline-block transform hover:scale-110 transition-transform duration-200 text-4xl align-middle rocket-emoji';
                    const cursor = document.querySelector('.Typewriter__cursor');
                    if (cursor?.parentNode) {
                      cursor.parentNode.insertBefore(rocketSpan, cursor);
                    }
                    cursor?.remove();
                  })
                  .start();
              }}
              options={{
                delay: 50,
                cursor: '|',
                loop: false,
                autoStart: false,
              }}
            />
          </motion.h2>
          <div className="w-full mb-16">
            <CryptoConverter onInteractionChange={setIsConverterActive} />
          </div>
        </div>
        <CryptoTicker isConverterActive={isConverterActive} />
        <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
        <FAQs />
      </main>
      <Footer />
      </div>
    </QueryClientProvider>
  );
}
