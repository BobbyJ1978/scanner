export interface CoinData {
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
  email: {
    enabled: boolean;
    address: string;
    smtpServer: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
  };
  telegram: {
    enabled: boolean;
    botToken: string;
    chatId: string;
  };
  discord: {
    enabled: boolean;
    webhookUrl: string;
  };
  twitter: {
    enabled: boolean;
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessSecret: string;
  };
}

export interface AppState {
  watchlist: AnalysisResult[];
  alerts: PriceAlert[];
  settings: NotificationSettings;
  isLoading: boolean;
  lastUpdate: number | null;
  activeTab: 'watchlist' | 'alerts' | 'settings' | 'analysis';
}
