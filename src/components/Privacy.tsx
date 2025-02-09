"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Privacy() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-[#5841D8] dark:hover:text-[#F2A900] transition-colors rounded-lg flex items-center gap-2 text-sm"
      >
        Privacy
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 999999999 }}>
          {/* Dark overlay */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Content */}
          <div 
            className="w-[95%] sm:w-[600px] bg-[#111827] rounded-xl shadow-2xl relative"
            style={{ maxHeight: 'calc(100vh - 100px)', transform: 'translateY(-60px)' }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              <h3 className="text-xl font-semibold text-white text-center mb-6 pr-8">
                Privacy Notice
              </h3>
              
              <div className="space-y-6">
                <p className="text-gray-300">
                  At Monday.xyz, we value your privacy and are committed to protecting your personal information.
                </p>

                <div>
                  <h4 className="text-[#F2A900] font-medium mb-3">1. Information Collection</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>We do not collect any personal information without your explicit consent.</li>
                    <li>Any data collected is used solely for improving your experience on our platform.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#F2A900] font-medium mb-3">2. Data Protection</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>We employ industry-standard security measures to protect your information.</li>
                    <li>Your data is never shared with third parties without your consent.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#F2A900] font-medium mb-3">3. Cookie Policy</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>We use essential cookies to ensure basic functionality of the website.</li>
                    <li>You can control or disable cookies through your browser settings.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#F2A900] font-medium mb-3">4. Contact Information</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>For any privacy-related concerns or questions, please contact us.</li>
                    <li>We aim to respond to all privacy inquiries within 48 hours.</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-700/50">
                  <p className="text-sm text-gray-400 text-center">
                    By using Monday.xyz, you agree to the terms outlined in this privacy notice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
