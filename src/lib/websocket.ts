"use client";

import { io } from "socket.io-client";

const WEBSOCKET_URL = "wss://ws.coincap.io/prices?assets=bitcoin,ethereum,tether,solana,cardano,ripple,polkadot,dogecoin,avalanche,chainlink";

class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private listeners: Set<(data: any) => void> = new Set();

  private constructor() {
    this.connect();
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private connect() {
    if (typeof window === 'undefined') return;
    
    this.socket = new WebSocket(WEBSOCKET_URL);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach(listener => listener(data));
    };

    this.socket.onclose = () => {
      setTimeout(() => this.connect(), 5000); // Reconnect after 5 seconds
    };
  }

  subscribe(callback: (data: any) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default WebSocketService;
