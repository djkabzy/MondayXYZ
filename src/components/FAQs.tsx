"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FAQPage } from "schema-dts";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ContactFormButton from "./ContactFormButton";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    question: "What is Monday?",
    answer: (
      <div className="space-y-2">
        <p>Monday is a simple crypto platform that allows users to track real-time cryptocurrency prices.</p>
        <p>It also features a premium domain, Monday.xyz, which is available for purchase.</p>
      </div>
    ),
  },
  {
    question: "How does the crypto converter work?",
    answer: (
      <div className="space-y-2">
        <p>The crypto converter allows users to convert different cryptocurrencies into fiat currency or other cryptos in real-time.</p>
        <p>It fetches live exchange rates and updates conversions dynamically.</p>
      </div>
    ),
  },
  {
    question: "Where do the prices come from?",
    answer: (
      <div className="space-y-2">
        <p>Prices are pulled from trusted market data sources, such as CoinGecko, CoinMarketCap, and major exchanges.</p>
        <p>These sources track real-time price fluctuations based on trading activity across global markets.</p>
      </div>
    ),
  },
  {
    question: "Can I buy Monday.xyz?",
    answer: (
      <div className="space-y-4 relative z-[60]">
        <div className="space-y-2">
          <p>Yes! Monday.xyz is available for purchase.</p>
          <p>Click the button below to make an offer:</p>
        </div>
        <div className="relative">
          <ContactFormButton />
        </div>
      </div>
    ),
  },
  {
    question: "Who owns Monday.xyz?",
    answer: "Monday.xyz is privately owned and available for acquisition.",
  },
  {
    question: "What is cryptocurrency?",
    answer: (
      <div className="space-y-2">
        <p>Cryptocurrency is a digital currency that operates on a blockchain and uses cryptography for security.</p>
        <p>Unlike traditional money, it is decentralized and not controlled by banks or governments.</p>
        <p>Cryptos like Bitcoin, Ethereum, and Litecoin are used for payments, trading, and investment.</p>
        <p>Cryptos operate on different mechanisms like:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Proof of Work (PoW) – Miners solve complex equations to validate transactions (Bitcoin).</li>
          <li>Proof of Stake (PoS) – Users stake crypto to validate transactions (Ethereum).</li>
        </ul>
      </div>
    ),
  },
  {
    question: "How to trade cryptocurrency?",
    answer: (
      <div className="space-y-2">
        <ol className="list-decimal pl-5 space-y-1">
          <li>Choose a crypto exchange (e.g., Binance, Coinbase).</li>
          <li>Create an account and complete KYC verification.</li>
          <li>Deposit funds using a supported payment method.</li>
          <li>Select the crypto pair you want to trade.</li>
          <li>Choose between Market Orders, Limit Orders, or Stop Orders.</li>
          <li>Place your order and monitor the market.</li>
        </ol>
        <p className="text-yellow-500 mt-2">⚠️ Risk Note: Crypto trading is volatile—only trade what you can afford to lose.</p>
      </div>
    ),
  },
  {
    question: "How to earn cryptocurrency?",
    answer: (
      <div className="space-y-2">
        <ul className="list-disc pl-5 space-y-1">
          <li>Mining – Use powerful computers to validate transactions and earn crypto.</li>
          <li>Staking – Lock up crypto in a network and earn rewards over time.</li>
          <li>Trading – Buy low, sell high, or engage in futures/options trading.</li>
          <li>Airdrops – Some projects give away free tokens to active users.</li>
          <li>Crypto Projects – Earn crypto through bug bounties, content creation, or development work.</li>
          <li>Education – Learn about crypto on platforms like Crypto.com University and earn tokens.</li>
        </ul>
      </div>
    ),
  },
];

const FAQItem = ({ question, answer }: FAQItem) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-gray-700/50 last:border-none"
      initial={false}
    >
      <motion.button
        className="w-full flex items-center justify-between py-4 px-6 text-left hover:bg-gray-800/30 transition-colors rounded-lg group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.4)" }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          )}
        </motion.div>
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              height: { duration: 0.3, type: "spring", stiffness: 100, damping: 15 },
              opacity: { duration: 0.2 }
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 text-gray-400 space-y-2">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {answer}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map(faq => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: typeof faq.answer === 'string' 
                  ? faq.answer 
                  : 'Detailed answer available on website'
              }
            }))
          })
        }}
      />
      <div className="w-full max-w-4xl mx-auto mb-20 px-4 sm:px-0">
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden backdrop-blur-sm relative z-[100]"
      >
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-semibold text-white">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-700/50">
          {faqData.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
        </motion.div>
      </div>
    </>
  );
}
