// All source code embedded as strings for download
export const SOURCE_FILES: Record<string, string> = {};

// Main entry
SOURCE_FILES['src/main.tsx'] = [
  'import React from "react";',
  'import ReactDOM from "react-dom/client";',
  'import "./index.css";',
  'import App from "./App.tsx";',
  '',
  'ReactDOM.createRoot(document.getElementById("root")!).render(<App />);',
].join('\n');

// Types
SOURCE_FILES['src/types.ts'] = `export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  sparkline?: number[];
}

export interface AnalysisResult {
  coinId: string;
  symbol: string;
  name: string;
  score: number;
  dowTrend: 'bullish' | 'bearish' | 'neutral';
  smcSignal: 'buy' | 'sell' | 'wait';
  orderBlock?: { type: 'bullish' | 'bearish'; price: number };
  fairValueGap?: { type: 'bullish' | 'bearish'; high: number; low: number };
  breakOfStructure?: { type: 'bullish' | 'bearish'; price: number };
  liquidityZone?: { level: number; type: 'buy' | 'sell' };
  reason: string;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
}

export interface PriceAlert {
  id: string;
  coinId: string;
  symbol: string;
  targetPrice: number;
  direction: 'above' | 'below';
  active: boolean;
  createdAt: number;
  triggered: boolean;
}

export interface NotificationSettings {
  browserNotification: boolean;
  email: { enabled: boolean; address: string; smtpServer: string; smtpPort: number; smtpUser: string; smtpPass: string; };
  telegram: { enabled: boolean; botToken: string; chatId: string; };
  discord: { enabled: boolean; webhookUrl: string; };
  twitter: { enabled: boolean; apiKey: string; apiSecret: string; accessToken: string; accessSecret: string; };
}

export interface AppState {
  watchlist: AnalysisResult[];
  alerts: PriceAlert[];
  settings: NotificationSettings;
  isLoading: boolean;
  lastUpdate: number | null;
  activeTab: 'watchlist' | 'alerts' | 'settings' | 'analysis';
}`;

// CSS
SOURCE_FILES['src/index.css'] = `@import "tailwindcss";

@theme {
  --color-primary: #FE7A15;
  --color-secondary: #D3DD18;
  --color-accent1: #F8D90F;
  --color-accent2: #0191B4;
  --color-accent3: #35BBCA;
  --color-cream: #FFF8F0;
  --color-cream-dark: #F5EDE3;
  --color-gray-light: #F0EDED;
  --color-gray-mid: #B8B0A8;
  --color-gray-dark: #6B6560;
  --color-text: #2D2A27;
}

body {
  font-family: 'Vazirmatn', sans-serif;
  background-color: #FFF8F0;
  color: #2D2A27;
  direction: rtl;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #F0EDED; border-radius: 3px; }
::-webkit-scrollbar-thumb { background: #B8B0A8; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #6B6560; }

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.4s ease-out; }`;

// App.tsx
SOURCE_FILES['src/App.tsx'] = `import { useState, useEffect, useCallback } from 'react';
import { CoinData, AnalysisResult, PriceAlert, NotificationSettings, AppState } from './types';
import { fetchCoinData } from './utils/api';
import { analyzeCoins } from './utils/analysis';
import Watchlist from './components/Watchlist';
import Alerts from './components/Alerts';
import Settings from './components/Settings';
import AnalysisPanel from './components/AnalysisPanel';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const DEFAULT_SETTINGS: NotificationSettings = {
  browserNotification: false,
  email: { enabled: false, address: '', smtpServer: '', smtpPort: 587, smtpUser: '', smtpPass: '' },
  telegram: { enabled: false, botToken: '', chatId: '' },
  discord: { enabled: false, webhookUrl: '' },
  twitter: { enabled: false, apiKey: '', apiSecret: '', accessToken: '', accessSecret: '' },
};

function App() {
  const [state, setState] = useState<AppState>({
    watchlist: [],
    alerts: JSON.parse(localStorage.getItem('priceAlerts') || '[]'),
    settings: JSON.parse(localStorage.getItem('notificationSettings') || JSON.stringify(DEFAULT_SETTINGS)),
    isLoading: true,
    lastUpdate: null,
    activeTab: 'watchlist',
  });

  const [coinData, setCoinData] = useState<CoinData[]>([]);

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await fetchCoinData();
      setCoinData(data);
      const analysis = analyzeCoins(data);
      setState(prev => ({ ...prev, watchlist: analysis, isLoading: false, lastUpdate: Date.now() }));
    } catch (error) {
      console.error('Error loading data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  const addAlert = (alert: PriceAlert) => {
    const newAlerts = [...state.alerts, alert];
    setState(prev => ({ ...prev, alerts: newAlerts }));
    localStorage.setItem('priceAlerts', JSON.stringify(newAlerts));
  };

  const removeAlert = (id: string) => {
    const newAlerts = state.alerts.filter(a => a.id !== id);
    setState(prev => ({ ...prev, alerts: newAlerts }));
    localStorage.setItem('priceAlerts', JSON.stringify(newAlerts));
  };

  const updateSettings = (settings: NotificationSettings) => {
    setState(prev => ({ ...prev, settings }));
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  };

  const setActiveTab = (tab: AppState['activeTab']) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setState(prev => ({ ...prev, settings: { ...prev.settings, browserNotification: true } }));
      }
    }
  };

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <Sidebar activeTab={state.activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header lastUpdate={state.lastUpdate} onRefresh={loadData} isLoading={state.isLoading} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {state.activeTab === 'watchlist' && <Watchlist watchlist={state.watchlist} isLoading={state.isLoading} onAddAlert={addAlert} />}
          {state.activeTab === 'alerts' && <Alerts alerts={state.alerts} coins={coinData} onAdd={addAlert} onRemove={removeAlert} />}
          {state.activeTab === 'settings' && <Settings settings={state.settings} onUpdate={updateSettings} onRequestNotification={requestNotificationPermission} />}
          {state.activeTab === 'analysis' && <AnalysisPanel watchlist={state.watchlist} coinData={coinData} />}
        </main>
      </div>
    </div>
  );
}

export default App;`;
