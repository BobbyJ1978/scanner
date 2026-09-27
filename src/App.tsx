import { useState, useEffect, useCallback } from 'react';
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
  email: {
    enabled: false,
    address: '',
    smtpServer: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
  },
  telegram: {
    enabled: false,
    botToken: '',
    chatId: '',
  },
  discord: {
    enabled: false,
    webhookUrl: '',
  },
  twitter: {
    enabled: false,
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    accessSecret: '',
  },
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
      
      setState(prev => ({
        ...prev,
        watchlist: analysis,
        isLoading: false,
        lastUpdate: Date.now(),
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [loadData]);

  // Check price alerts
  useEffect(() => {
    if (!coinData.length) return;
    
    const triggeredAlerts: PriceAlert[] = [];
    
    state.alerts.forEach(alert => {
      if (!alert.active || alert.triggered) return;
      
      const coin = coinData.find(c => c.id === alert.coinId);
      if (!coin) return;
      
      if (alert.direction === 'above' && coin.price >= alert.targetPrice) {
        triggeredAlerts.push(alert);
      } else if (alert.direction === 'below' && coin.price <= alert.targetPrice) {
        triggeredAlerts.push(alert);
      }
    });
    
    if (triggeredAlerts.length > 0) {
      triggeredAlerts.forEach(alert => {
        sendNotification(alert);
      });
      
      setState(prev => ({
        ...prev,
        alerts: prev.alerts.map(a => 
          triggeredAlerts.find(t => t.id === a.id) ? { ...a, triggered: true } : a
        ),
      }));
    }
  }, [coinData, state.alerts]);

  const sendNotification = (alert: PriceAlert) => {
    const message = `🔔 آلارم ${alert.symbol}: قیمت به ${alert.targetPrice.toLocaleString()} دلار رسید!`;
    
    // Browser notification
    if (state.settings.browserNotification && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('آلارم قیمتی', { body: message, icon: '/favicon.ico' });
      }
    }
    
    // Console log for demo
    console.log('Notification sent:', message);
  };

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
        setState(prev => ({
          ...prev,
          settings: { ...prev.settings, browserNotification: true },
        }));
      }
    }
  };

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <Sidebar activeTab={state.activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          lastUpdate={state.lastUpdate} 
          onRefresh={loadData} 
          isLoading={state.isLoading}
        />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {state.activeTab === 'watchlist' && (
            <Watchlist 
              watchlist={state.watchlist} 
              isLoading={state.isLoading}
              onAddAlert={addAlert}
            />
          )}
          {state.activeTab === 'alerts' && (
            <Alerts 
              alerts={state.alerts}
              coins={coinData}
              onAdd={addAlert}
              onRemove={removeAlert}
            />
          )}
          {state.activeTab === 'settings' && (
            <Settings 
              settings={state.settings}
              onUpdate={updateSettings}
              onRequestNotification={requestNotificationPermission}
            />
          )}
          {state.activeTab === 'analysis' && (
            <AnalysisPanel 
              watchlist={state.watchlist}
              coinData={coinData}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
