"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BitcoinLoader from "./BitcoinLoader";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import WebSocketService from "@/lib/websocket";

interface CryptoData {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

import { compressData, decompressData } from "@/lib/compression";

const fetchCryptoData = async () => {
  // Check localStorage for cached compressed data
  const cachedData = localStorage.getItem('cryptoData');
  const cacheTimestamp = localStorage.getItem('cryptoDataTimestamp');
  const now = Date.now();

  // Use cache if it's less than 1 second old
  if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 1000) {
    return decompressData(cachedData);
  }

  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 50,
        sparkline: false,
      },
    },
  );

  // Compress and cache the data
  const compressed = compressData(response.data);
  localStorage.setItem('cryptoData', compressed);
  localStorage.setItem('cryptoDataTimestamp', now.toString());

  return response.data;
};

interface CryptoTickerProps {
  isConverterActive: boolean;
}

export default function CryptoTicker({ isConverterActive }: CryptoTickerProps) {
  const [topData, setTopData] = useState<CryptoData[]>([]);
  const [rightData, setRightData] = useState<CryptoData[]>([]);
  const [bottomData, setBottomData] = useState<CryptoData[]>([]);
  const [leftData, setLeftData] = useState<CryptoData[]>([]);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ["cryptoData"],
    queryFn: fetchCryptoData,
    staleTime: Infinity,
    gcTime: 0,
  });

  const [data, setData] = useState(initialData);

  const updatePrices = useCallback((wsData: Record<string, string>) => {
    if (!data) return;
    
    setData((prevData: CryptoData[] | undefined) => 
      prevData?.map((coin: CryptoData) => {
        const newPrice = wsData[coin.symbol.toLowerCase()];
        if (newPrice) {
          const oldPrice = coin.current_price;
          const priceChange = ((parseFloat(newPrice) - oldPrice) / oldPrice) * 100;
          return {
            ...coin,
            current_price: parseFloat(newPrice),
            price_change_percentage_24h: priceChange
          };
        }
        return coin;
      })
    );
  }, [data]);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let wsConnection: any;
    const connectWebSocket = () => {
      const ws = WebSocketService.getInstance();
      wsConnection = ws.subscribe(updatePrices);
    };

    // Lazy load WebSocket connection
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(connectWebSocket);
    } else {
      setTimeout(connectWebSocket, 1000);
    }

    return () => {
      if (wsConnection) {
        wsConnection();
      }
    };
  }, [updatePrices]);

  useEffect(() => {
    if (data) {
      const splitSize = Math.floor(data.length / 4);
      setTopData(data.slice(0, splitSize));
      setRightData(data.slice(splitSize, splitSize * 2));
      setBottomData(data.slice(splitSize * 2, splitSize * 3));
      setLeftData(data.slice(splitSize * 3));
    }
  }, [data]);

  const TickerItem = ({ data }: { data: CryptoData }) => (
    <motion.div className="relative">
      <div className="absolute inset-0 golden-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <motion.div 
          className="mx-2 flex items-center space-x-2 rounded-md glass-effect shimmer px-4 py-2 shadow-lg shadow-[#F2A900]/5 border border-[#F2A900]/20 relative overflow-hidden group"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            scale: [1, 1.02, 1],
            rotate: [0, 1, 0]
          }}
          transition={{ 
            duration: 0.5,
            scale: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <span className="font-mono text-sm text-gray-600 dark:text-gray-400">{data.symbol.toUpperCase()}</span>
          <span className="text-sm font-medium text-white">
            ${data.current_price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1">
            {data.price_change_percentage_24h >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span
              className={`text-xs font-medium ${
                data.price_change_percentage_24h >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {Math.abs(data.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <BitcoinLoader size="lg" text="Loading market data..." />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top Ticker */}
      <AnimatePresence mode="wait">
        <motion.div
          className="absolute top-0 flex w-full overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: [-1000, dimensions.width]
          }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            opacity: { duration: 0.3 },
            y: { duration: 0.3 },
            x: { duration: isConverterActive ? 0 : 30, repeat: isConverterActive ? 0 : Infinity, ease: "linear" }
          }}
        >
            {topData.map((item) => (
              <TickerItem key={item.id} data={item} />
            ))}
          </motion.div>
      </AnimatePresence>

      {/* Right Ticker */}
      <AnimatePresence mode="wait">
        {!isConverterActive && (
          <motion.div
            className="absolute right-0 flex h-full -rotate-90 items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1,
              x: 0,
              y: [-1000, dimensions.height]
            }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ 
              opacity: { duration: 0.3 },
              x: { duration: 0.3 },
              y: { duration: 30, repeat: Infinity, ease: "linear" }
            }}
          >
            {rightData.map((item) => (
              <TickerItem key={item.id} data={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Ticker */}
      <AnimatePresence mode="wait">
        <motion.div
          className="absolute bottom-0 flex w-full overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: [dimensions.width, -1000]
          }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ 
            opacity: { duration: 0.3 },
            y: { duration: 0.3 },
            x: { duration: isConverterActive ? 0 : 30, repeat: isConverterActive ? 0 : Infinity, ease: "linear" }
          }}
        >
          {bottomData.map((item) => (
            <TickerItem key={item.id} data={item} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Left Ticker */}
      <AnimatePresence mode="wait">
        {!isConverterActive && (
          <motion.div
            className="absolute left-0 flex h-full rotate-90 items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1,
              x: 0,
              y: [dimensions.height, -1000]
            }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              opacity: { duration: 0.3 },
              x: { duration: 0.3 },
              y: { duration: 30, repeat: Infinity, ease: "linear" }
            }}
          >
            {leftData.map((item) => (
              <TickerItem key={item.id} data={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
