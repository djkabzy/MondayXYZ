"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BitcoinLoader from "./BitcoinLoader";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import WebSocketService from "@/lib/websocket";
import Select from "react-select";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { useDrag, usePinch } from '@use-gesture/react';
import { useState as useGestureState } from 'react';

interface CryptoOption {
  value: string;
  label: string;
  image: string;
}

import { compressData, decompressData } from "@/lib/compression";

const fetchCryptoData = async () => {
  // Check localStorage for cached compressed data
  const cachedData = localStorage.getItem('converterData');
  const cacheTimestamp = localStorage.getItem('converterDataTimestamp');
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
        per_page: 30,
        sparkline: true,
        price_change_percentage: "24h",
      },
    },
  );

  // Compress and cache the data
  const compressed = compressData(response.data);
  localStorage.setItem('converterData', compressed);
  localStorage.setItem('converterDataTimestamp', now.toString());

  return response.data;
};

const fetchPriceHistory = async (id: string) => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
    {
      params: {
        vs_currency: "usd",
        days: "30",
        interval: "daily",
      },
    },
  );
  return response.data.prices.map(([timestamp, price]: [number, number]) => ({
    date: format(new Date(timestamp), 'MMM dd'),
    fullDate: format(new Date(timestamp), 'MMM dd, yyyy'),
    price,
    formattedPrice: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }));
};

interface CryptoConverterProps {
  onInteractionChange: (isInteracting: boolean) => void;
}

export default function CryptoConverter({ onInteractionChange }: CryptoConverterProps) {
  const [amount, setAmount] = useState<string>("");
  const [fromCrypto, setFromCrypto] = useState<CryptoOption | null>(null);
  const [toCrypto, setToCrypto] = useState<CryptoOption | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Reset interaction state after delay
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isInteracting) {
      onInteractionChange(true);
      timeoutId = setTimeout(() => {
        setIsInteracting(false);
        onInteractionChange(false);
      }, 5000); // Reset after 5 seconds of inactivity
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInteracting, onInteractionChange]);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ["cryptoConverterData"],
    queryFn: fetchCryptoData,
    staleTime: Infinity,
    gcTime: 0,
  });

  const [cryptoData, setCryptoData] = useState(initialData);

  interface CryptoDataItem {
    id: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    sparkline_in_7d?: {
      price: number[];
    };
  }

  const updatePrices = useCallback((wsData: Record<string, string>) => {
    if (!cryptoData) return;
    
    setCryptoData((prevData: CryptoDataItem[] | undefined) => 
      prevData?.map((coin: CryptoDataItem) => {
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
  }, [cryptoData]);

  useEffect(() => {
    if (initialData) {
      setCryptoData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ws = WebSocketService.getInstance();
    const unsubscribe = ws.subscribe(updatePrices);

    return () => {
      unsubscribe();
    };
  }, [updatePrices]);

  const cryptoOptions: CryptoOption[] = cryptoData?.map((crypto: any) => ({
    value: crypto.id,
    label: `${crypto.symbol.toUpperCase()} - ${crypto.name}`,
    image: crypto.image,
  })) ?? [];

  const calculateConversion = () => {
    if (!fromCrypto || !toCrypto || !amount || !cryptoData) return "0.00";
    
    const fromPrice = cryptoData.find((c: any) => c.id === fromCrypto.value)?.current_price ?? 0;
    const toPrice = cryptoData.find((c: any) => c.id === toCrypto.value)?.current_price ?? 0;
    
    if (fromPrice === 0 || toPrice === 0) return "0.00";
    
    const result = (parseFloat(amount) * fromPrice) / toPrice;
    return result.toFixed(8);
  };

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      background: "#1f2937",
      borderColor: state.isFocused ? "#F2A900" : "#374151",
      minHeight: "48px",
      cursor: "pointer",
      boxShadow: state.isFocused ? "0 0 0 1px #F2A900" : "none",
      "&:hover": {
        borderColor: "#F2A900"
      }
    }),
    menu: (base: any) => ({
      ...base,
      background: "#1f2937",
      border: "1px solid #374151",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 50
    }),
    option: (base: any, state: any) => ({
      ...base,
      background: state.isFocused ? "#F2A900" : "#1f2937",
      color: state.isFocused ? "white" : "#E5E7EB",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px",
      cursor: "pointer",
      transition: "all 150ms ease",
      "&:hover": {
        background: "#F2A900",
        color: "white"
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "white",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }),
    input: (base: any) => ({
      ...base,
      color: "white",
      caretColor: "#F2A900"
    }),
    dropdownIndicator: (base: any, state: any) => ({
      ...base,
      color: state.isFocused ? "#F2A900" : "#6B7280",
      cursor: "pointer",
      "&:hover": {
        color: "#F2A900"
      }
    }),
    clearIndicator: (base: any) => ({
      ...base,
      color: "#6B7280",
      cursor: "pointer",
      "&:hover": {
        color: "#F2A900"
      }
    }),
    menuList: (base: any) => ({
      ...base,
      padding: "4px",
      "&::-webkit-scrollbar": {
        width: "8px",
        height: "0px",
      },
      "&::-webkit-scrollbar-track": {
        background: "#1f2937"
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#374151",
        borderRadius: "4px",
        "&:hover": {
          background: "#4B5563"
        }
      }
    })
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <BitcoinLoader size="lg" text="Loading market data..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-4 md:p-8 rounded-2xl glass-effect shimmer border border-[#F2A900]/30 shadow-lg shadow-[#F2A900]/10 bg-gradient-to-br from-[#F2A900]/10 via-[#F2A900]/5 to-transparent golden-pulse relative overflow-hidden dark:bg-gray-900/50 dark:border-[#F2A900]/50 transition-all duration-300"
      onMouseEnter={() => {
        setIsInteracting(true);
        onInteractionChange(true);
      }}
      onMouseLeave={() => {
        // Only reset interaction if no active inputs or selections
        if (!amount && !fromCrypto && !toCrypto) {
          setIsInteracting(false);
          onInteractionChange(false);
        }
      }}
      onClick={() => {
        setIsInteracting(true);
        onInteractionChange(true);
      }}
      onFocus={() => {
        setIsInteracting(true);
        onInteractionChange(true);
      }}
      onBlur={(e) => {
        // Check if the next focused element is within the converter
        const relatedTarget = e.relatedTarget as Node;
        if (!e.currentTarget.contains(relatedTarget)) {
          // Only reset if we're not interacting with any converter elements
          if (!amount && !fromCrypto && !toCrypto) {
            setIsInteracting(false);
            onInteractionChange(false);
          }
        }
      }}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#F2A900] focus:border-transparent text-white"
            placeholder="Enter amount..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">From</label>
            <Select
              options={cryptoOptions}
              value={fromCrypto}
              onChange={(option) => setFromCrypto(option)}
              styles={customStyles}
              className="text-white"
              placeholder="Select crypto..."
              formatOptionLabel={(option: CryptoOption) => (
                <div className="flex items-center gap-2">
                  <img src={option.image} alt={option.label} className="w-6 h-6 rounded-full" />
                  <span>{option.label}</span>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">To</label>
            <Select
              options={cryptoOptions}
              value={toCrypto}
              onChange={(option) => setToCrypto(option)}
              styles={customStyles}
              className="text-white"
              placeholder="Select crypto..."
              formatOptionLabel={(option: CryptoOption) => (
                <div className="flex items-center gap-2">
                  <img src={option.image} alt={option.label} className="w-6 h-6 rounded-full" />
                  <span>{option.label}</span>
                </div>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-gray-800/80 rounded-lg border border-[#F2A900]/20 shimmer golden-pulse relative overflow-hidden">
            <div className="absolute inset-0 golden-shimmer"></div>
            <div className="relative z-10">
              <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Converted Amount</p>
              <p className="text-3xl font-bold text-white mt-1">
                {calculateConversion()}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {toCrypto?.label || "Select destination currency"}
              </p>
              </div>
            </div>
          </div>

          {fromCrypto && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-800 rounded-lg"
            >
              <p className="text-sm font-medium text-gray-300 mb-4">
                {fromCrypto.label} - 7 Day Price History
              </p>
              <div className="h-[300px] w-full touch-pan-x touch-pinch-zoom relative" style={{ touchAction: 'none' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={cryptoData?.find((c: any) => c.id === fromCrypto.value)?.sparkline_in_7d?.price.map((price: number, index: number) => ({
                      date: index,
                      price,
                    })) || []}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      tick={{ fill: '#9ca3af' }}
                      tickLine={{ stroke: '#6b7280' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      tick={{ fill: '#9ca3af' }}
                      tickLine={{ stroke: '#6b7280' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      wrapperStyle={{ 
                        outline: 'none',
                        touchAction: 'none'
                      }}
                      content={({ active, payload }: any) => {
                        if (active && payload?.[0]?.payload) {
                          return (
                            <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                              <p className="text-gray-400 text-sm mb-1">{payload[0]?.payload?.fullDate}</p>
                              <p className="text-white font-medium">{payload[0]?.payload?.formattedPrice}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {toCrypto && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-800 rounded-lg"
            >
              <p className="text-sm font-medium text-gray-300 mb-4">
                {toCrypto.label} - 7 Day Price History
              </p>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={cryptoData?.find((c: any) => c.id === toCrypto.value)?.sparkline_in_7d?.price.map((price: number, index: number) => ({
                      date: index,
                      price,
                    })) || []}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      tick={{ fill: '#9ca3af' }}
                      tickLine={{ stroke: '#6b7280' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      tick={{ fill: '#9ca3af' }}
                      tickLine={{ stroke: '#6b7280' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (active && payload?.[0]?.payload) {
                          return (
                            <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                              <p className="text-gray-400 text-sm mb-1">{payload[0]?.payload?.fullDate}</p>
                              <p className="text-white font-medium">{payload[0]?.payload?.formattedPrice}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorPrice2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
