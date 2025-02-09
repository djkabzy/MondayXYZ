"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { init, send } from '@emailjs/browser';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  amount: z.string().min(1, "Amount is required"),
  currency: z.enum(["USD", "EUR", "GBP", "ETH", "BTC", "SOL"])
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      init("IrtTBEs5F8-RP24Sq");
      console.log("EmailJS initialized with public key");
    } catch (error) {
      console.error("EmailJS initialization failed:", error);
      toast.error("Service initialization failed", {
        description: "Please check your connection and try again.",
        icon: "⚠️",
        duration: 5000
      });
    }
  }, []);

  const sendEmailWithRetry = async (templateParams: any, maxRetries = 3) => {
    let retryCount = 0;
    let lastError;

    while (retryCount < maxRetries) {
      try {
        console.log(`Attempt ${retryCount + 1} of ${maxRetries}`);
        
        const response = await send(
          "service_2p992ph", // Service ID with "service_" prefix
          "template_bcx3jup", // Template ID with "template_" prefix
          templateParams
        );

        console.log("Email sent successfully:", response);
        return response;
      } catch (error) {
        lastError = error;
        retryCount++;
        console.error(`Attempt ${retryCount} failed:`, error);
        
        if (retryCount < maxRetries) {
          const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 8000);
          console.log(`Retrying in ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    }

    throw lastError;
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      const templateParams = {
        to_email: "djkabzy@gmail.com",
        from_name: data.name,
        from_email: data.email,
        amount: data.amount,
        currency: data.currency,
        message: `Offer amount: ${data.amount} ${data.currency}`,
        reply_to: data.email,
      };

      console.log("Sending email with params:", templateParams);
      
      const response = await sendEmailWithRetry(templateParams);

      if (response.status === 200) {
        toast.success("Offer submitted successfully!", {
          description: "We'll get back to you soon.",
          icon: "🚀"
        });
        reset();
        onClose();
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error("Email send failed:", error);
      let errorMessage = "Please try again later.";
      
      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('Invalid template ID')) {
          errorMessage = "Configuration error. Please contact support.";
        } else if (error.message.includes('Network Error')) {
          errorMessage = "Network error. Please check your connection.";
        }
      }
      
      toast.error("Failed to submit offer", {
        description: `${errorMessage} (Retried 3 times)`,
        icon: "❌",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="contact-form-modal fixed left-[50%] top-[50%] w-[90%] max-w-[400px] -translate-x-[50%] -translate-y-[50%] rounded-xl bg-gray-900 p-4 md:p-5 shadow-xl border border-[#F2A900]/20 max-h-[90vh] md:max-h-[85vh] overflow-y-auto optimize-gpu z-[999999] min-h-[200px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-xl font-semibold text-gray-800 dark:text-white">
                    Make an Offer
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      {...register("name")}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#F2A900] focus:border-transparent text-white appearance-none"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#F2A900] focus:border-transparent text-white"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Currency
                      </label>
                      <select
                        {...register("currency")}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#F2A900] focus:border-transparent text-white"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="ETH">ETH (Ξ)</option>
                        <option value="BTC">BTC (₿)</option>
                        <option value="SOL">SOL (◎)</option>
                      </select>
                      {errors.currency && (
                        <p className="mt-1 text-sm text-red-500">{errors.currency.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Amount
                      </label>
                      <input
                        {...register("amount")}
                        type="number"
                        step="any"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#F2A900] focus:border-transparent text-white"
                        placeholder="0.00"
                      />
                      {errors.amount && (
                        <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
                      )}
                    </div>
                  </div>

                  <motion.div className="relative">
                    <AnimatePresence mode="wait">
                      {showSuccess ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="flex items-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-lg">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ 
                                type: "spring",
                                stiffness: 260,
                                damping: 20 
                              }}
                            >
                              <svg 
                                className="w-6 h-6" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <motion.path
                                  d="M5 13l4 4L19 7"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 0.5 }}
                                />
                              </svg>
                            </motion.div>
                            <span className="font-medium">Offer Submitted!</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.button
                          type="submit"
                          className="w-full mt-4 mb-2 px-6 py-4 bg-[#F2A900] text-white rounded-lg hover:bg-[#F2A900]/90 transition-all font-medium shadow-lg text-lg relative border border-[#F2A900]/20 backdrop-blur-sm transform hover:scale-[1.02] hover:shadow-xl"
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          {isSubmitting ? "Sending..." : "Submit Offer"}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
}
