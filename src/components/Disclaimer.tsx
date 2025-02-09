"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ContactForm from "./ContactForm";

export default function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-[#5841D8] dark:hover:text-[#F2A900] transition-colors rounded-lg flex items-center gap-2 text-sm"
      >
        Disclaimer
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0" style={{ position: 'fixed', zIndex: 999999999 }}>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Container - Positioned above everything */}
          <div 
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 999999999 }}
          >
            {/* Modal Content */}
            <div className="w-[95%] sm:w-[600px] bg-[#111827] rounded-xl shadow-2xl pointer-events-auto max-h-[90vh] overflow-hidden relative" style={{ marginTop: '-45vh' }}>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-2 top-2 text-gray-400 hover:text-white transition-colors z-50 p-2 rounded-lg hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white text-center mb-6 pr-8">
                  Disclaimer
                </h3>
                
                <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(90vh - 160px)' }}>
                  <div className="space-y-6">
                    <p className="text-gray-300">
                      The information provided on Monday.xyz is for informational and educational purposes only. 
                      While we strive for accuracy, we make no guarantees regarding completeness, reliability, or suitability.
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[#F2A900] font-medium mb-3">1. No Financial or Investment Advice</h4>
                        <ul className="list-disc pl-5 space-y-2 text-gray-400">
                          <li>The content on this site does not constitute financial, investment, or legal advice.</li>
                          <li>Cryptocurrency investments involve risks, and you should conduct your own research before making any decisions.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[#F2A900] font-medium mb-3">2. No Liability</h4>
                        <ul className="list-disc pl-5 space-y-2 text-gray-400">
                          <li>Monday.xyz and its owners are not liable for any losses or damages resulting from the use of this website or reliance on the information provided.</li>
                          <li>We do not guarantee price accuracy, as crypto prices are volatile and sourced from third-party providers.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[#F2A900] font-medium mb-3">3. External Links</h4>
                        <ul className="list-disc pl-5 space-y-2 text-gray-400">
                          <li>This site may contain links to third-party websites for convenience and reference.</li>
                          <li>We do not endorse or take responsibility for external content, privacy policies, or services.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[#F2A900] font-medium mb-3">4. Domain Sale Notice</h4>
                        <ul className="list-disc pl-5 space-y-2 text-gray-400">
                          <li>Monday.xyz is a domain available for purchase and is not associated with any official cryptocurrency platform.</li>
                          <li>
                            Inquiries about acquiring the domain can be made via the 
                            <button 
                              onClick={() => setIsContactFormOpen(true)}
                              className="text-blue-500 hover:text-blue-600 hover:underline focus:outline-none inline font-normal mx-1"
                            >
                              contact form
                            </button>.
                          </li>
                          <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700/50">
                      <p className="text-sm text-gray-400 text-center">
                        By using this website, you acknowledge and agree to this disclaimer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
