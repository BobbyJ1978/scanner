import { CoinData } from '../types';

// Extension Bridge proxy for CORS handling
const PROXY_BASE = 'https://api.allorigins.win/raw?url=';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Top coins to analyze
const TOP_COINS = [
  'bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple',
  'cardano', 'avalanche-2', 'polygon-pos', 'chainlink', 'polkadot',
  'dogecoin', 'litecoin', 'uniswap', 'stellar', 'near',
  'arbitrum', 'optimism', 'injective-protocol', 'sui', 'aptos'
];

export async function fetchCoinData(): Promise<CoinData[]> {
  try {
    const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${TOP_COINS.join(',')}&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h,7d`;
    
    const response = await fetch(`${PROXY_BASE}${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      change7d: coin.price_change_percentage_7d_in_currency || 0,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      sparkline: coin.sparkline_in_7d?.price || [],
    }));
  } catch (error) {
    console.error('Error fetching coin data:', error);
    // Return mock data as fallback
    return getMockData();
  }
}

export async function fetchCoinOHLC(coinId: string, days: number = 7): Promise<number[][]> {
  try {
    const url = `${COINGECKO_BASE}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;
    const response = await fetch(`${PROXY_BASE}${encodeURIComponent(url)}`);
    
    if (!response.ok) throw new Error('Failed to fetch OHLC');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching OHLC:', error);
    return generateMockOHLC();
  }
}

function generateMockOHLC(): number[][] {
  const data: number[][] = [];
  let price = 100 + Math.random() * 50000;
  
  for (let i = 0; i < 168; i++) { // 7 days * 24 hours / 4
    const open = price;
    const change = (Math.random() - 0.45) * price * 0.02;
    const high = open + Math.abs(change) * (1 + Math.random());
    const low = open - Math.abs(change) * (1 + Math.random());
    const close = open + change;
    
    data.push([Date.now() - (168 - i) * 3600000, open, high, low, close]);
    price = close;
  }
  
  return data;
}

function getMockData(): CoinData[] {
  const coins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', basePrice: 67500 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', basePrice: 3450 },
    { id: 'solana', symbol: 'SOL', name: 'Solana', basePrice: 172 },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', basePrice: 590 },
    { id: 'ripple', symbol: 'XRP', name: 'XRP', basePrice: 0.52 },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', basePrice: 0.45 },
    { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', basePrice: 35 },
    { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', basePrice: 14 },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', basePrice: 7.2 },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.12 },
    { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', basePrice: 5.8 },
    { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', basePrice: 1.1 },
    { id: 'optimism', symbol: 'OP', name: 'Optimism', basePrice: 2.5 },
    { id: 'sui', symbol: 'SUI', name: 'Sui', basePrice: 1.4 },
    { id: 'aptos', symbol: 'APT', name: 'Aptos', basePrice: 8.9 },
    { id: 'injective-protocol', symbol: 'INJ', name: 'Injective', basePrice: 25 },
    { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', basePrice: 7.8 },
    { id: 'stellar', symbol: 'XLM', name: 'Stellar', basePrice: 0.11 },
    { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', basePrice: 72 },
    { id: 'polygon-pos', symbol: 'MATIC', name: 'Polygon', basePrice: 0.72 },
  ];

  return coins.map(coin => {
    const change24h = (Math.random() - 0.4) * 10;
    const change7d = (Math.random() - 0.35) * 20;
    const price = coin.basePrice * (1 + change24h / 100);
    
    const sparkline: number[] = [];
    let p = price * 0.95;
    for (let i = 0; i < 168; i++) {
      p += (Math.random() - 0.47) * p * 0.005;
      sparkline.push(p);
    }
    
    return {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      price: price,
      change24h: change24h,
      change7d: change7d,
      volume24h: coin.basePrice * 1000000 * (0.5 + Math.random()),
      marketCap: coin.basePrice * 100000000 * (1 + Math.random()),
      high24h: price * 1.03,
      low24h: price * 0.97,
      sparkline,
    };
  });
}
