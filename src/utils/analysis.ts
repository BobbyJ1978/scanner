import { CoinData, AnalysisResult } from '../types';

// Dow Theory Analysis
function analyzeDowTheory(sparkline: number[]): { trend: 'bullish' | 'bearish' | 'neutral'; strength: number } {
  if (!sparkline || sparkline.length < 20) return { trend: 'neutral', strength: 0 };

  // Identify Higher Highs (HH) and Higher Lows (HL) for bullish
  // Lower Highs (LH) and Lower Lows (LL) for bearish
  const highs: number[] = [];
  const lows: number[] = [];
  const window = 8;

  for (let i = window; i < sparkline.length - window; i++) {
    const slice = sparkline.slice(i - window, i + window + 1);
    if (sparkline[i] === Math.max(...slice)) highs.push(sparkline[i]);
    if (sparkline[i] === Math.min(...slice)) lows.push(sparkline[i]);
  }

  let hhCount = 0, hlCount = 0, lhCount = 0, llCount = 0;

  for (let i = 1; i < highs.length; i++) {
    if (highs[i] > highs[i - 1]) hhCount++;
    else lhCount++;
  }

  for (let i = 1; i < lows.length; i++) {
    if (lows[i] > lows[i - 1]) hlCount++;
    else llCount++;
  }

  const bullishScore = hhCount + hlCount;
  const bearishScore = lhCount + llCount;
  const total = bullishScore + bearishScore || 1;

  if (bullishScore > bearishScore * 1.3) {
    return { trend: 'bullish', strength: Math.min(bullishScore / total, 1) };
  } else if (bearishScore > bullishScore * 1.3) {
    return { trend: 'bearish', strength: Math.min(bearishScore / total, 1) };
  }
  return { trend: 'neutral', strength: 0.5 };
}

// Smart Money Concepts (SMC) Analysis
function analyzeSMC(sparkline: number[]): {
  signal: 'buy' | 'sell' | 'wait';
  orderBlock?: { type: 'bullish' | 'bearish'; price: number };
  fairValueGap?: { type: 'bullish' | 'bearish'; high: number; low: number };
  breakOfStructure?: { type: 'bullish' | 'bearish'; price: number };
  liquidityZone?: { level: number; type: 'buy' | 'sell' };
  score: number;
} {
  if (!sparkline || sparkline.length < 50) {
    return { signal: 'wait', score: 0 };
  }

  let score = 0;
  let orderBlock: { type: 'bullish' | 'bearish'; price: number } | undefined;
  let fairValueGap: { type: 'bullish' | 'bearish'; high: number; low: number } | undefined;
  let breakOfStructure: { type: 'bullish' | 'bearish'; price: number } | undefined;
  let liquidityZone: { level: number; type: 'buy' | 'sell' } | undefined;

  // Detect Order Blocks (OB)
  // Bullish OB: last bearish candle before a strong bullish move
  for (let i = sparkline.length - 20; i < sparkline.length - 2; i++) {
    const current = sparkline[i];
    const next = sparkline[i + 1];
    const afterMove = sparkline.slice(i + 2, i + 6);
    
    if (afterMove.length > 0) {
      const avgAfter = afterMove.reduce((a, b) => a + b, 0) / afterMove.length;
      
      // Bullish Order Block
      if (next < current && avgAfter > current * 1.02) {
        orderBlock = { type: 'bullish', price: current };
        score += 25;
        break;
      }
      
      // Bearish Order Block
      if (next > current && avgAfter < current * 0.98) {
        orderBlock = { type: 'bearish', price: current };
        score -= 25;
        break;
      }
    }
  }

  // Detect Fair Value Gaps (FVG)
  for (let i = sparkline.length - 15; i < sparkline.length - 3; i++) {
    const candle1High = Math.max(sparkline[i], sparkline[i + 1]);
    const candle1Low = Math.min(sparkline[i], sparkline[i + 1]);
    const candle3 = sparkline[i + 2];
    
    // Bullish FVG: gap between candle 1 high and candle 3 low
    if (candle3 > candle1High * 1.005) {
      fairValueGap = { type: 'bullish', high: candle3, low: candle1High };
      score += 20;
      break;
    }
    
    // Bearish FVG
    if (candle3 < candle1Low * 0.995) {
      fairValueGap = { type: 'bearish', high: candle1Low, low: candle3 };
      score -= 20;
      break;
    }
  }

  // Detect Break of Structure (BOS)
  const recentHighs = sparkline.slice(-30, -5);
  const recentLows = sparkline.slice(-30, -5);
  const currentPrice = sparkline[sparkline.length - 1];
  
  const prevHigh = Math.max(...recentHighs);
  const prevLow = Math.min(...recentLows);
  
  if (currentPrice > prevHigh) {
    breakOfStructure = { type: 'bullish', price: prevHigh };
    score += 30;
  } else if (currentPrice < prevLow) {
    breakOfStructure = { type: 'bearish', price: prevLow };
    score -= 30;
  }

  // Detect Liquidity Zones
  const priceLevels = sparkline.filter((_, i) => i % 5 === 0);
  const clusteredLevels = findPriceClusters(priceLevels, 0.02);
  
  if (clusteredLevels.length > 0) {
    const closestCluster = clusteredLevels.reduce((closest, level) => 
      Math.abs(level - currentPrice) < Math.abs(closest - currentPrice) ? level : closest
    );
    
    if (closestCluster < currentPrice) {
      liquidityZone = { level: closestCluster, type: 'buy' };
      score += 15;
    } else {
      liquidityZone = { level: closestCluster, type: 'sell' };
      score -= 15;
    }
  }

  // Volume analysis (simulated from price movement intensity)
  const recentMoves = sparkline.slice(-24).map((p, i, arr) => 
    i > 0 ? Math.abs(p - arr[i - 1]) / arr[i - 1] : 0
  );
  const avgMove = recentMoves.reduce((a, b) => a + b, 0) / recentMoves.length;
  
  if (avgMove > 0.005) score += 10; // High volatility = smart money active

  const signal: 'buy' | 'sell' | 'wait' = score > 30 ? 'buy' : score < -30 ? 'sell' : 'wait';

  return { signal, orderBlock, fairValueGap, breakOfStructure, liquidityZone, score };
}

function findPriceClusters(prices: number[], threshold: number): number[] {
  const clusters: number[] = [];
  const sorted = [...prices].sort((a, b) => a - b);
  
  let cluster: number[] = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    if (Math.abs(sorted[i] - cluster[cluster.length - 1]) / cluster[cluster.length - 1] < threshold) {
      cluster.push(sorted[i]);
    } else {
      if (cluster.length >= 3) {
        clusters.push(cluster.reduce((a, b) => a + b, 0) / cluster.length);
      }
      cluster = [sorted[i]];
    }
  }
  
  if (cluster.length >= 3) {
    clusters.push(cluster.reduce((a, b) => a + b, 0) / cluster.length);
  }
  
  return clusters;
}

// Main analysis function
export function analyzeCoins(coins: CoinData[]): AnalysisResult[] {
  const results: AnalysisResult[] = coins.map(coin => {
    const dowAnalysis = analyzeDowTheory(coin.sparkline || []);
    const smcAnalysis = analyzeSMC(coin.sparkline || []);
    
    // Combined score
    let totalScore = 0;
    
    // Dow Theory contribution (40%)
    if (dowAnalysis.trend === 'bullish') totalScore += 40 * dowAnalysis.strength;
    else if (dowAnalysis.trend === 'bearish') totalScore -= 40 * dowAnalysis.strength;
    
    // SMC contribution (60%)
    totalScore += smcAnalysis.score * 0.6;
    
    // Volume factor
    const volumeScore = Math.min(coin.volume24h / coin.marketCap * 100, 20);
    totalScore += volumeScore;
    
    // 24h momentum
    if (coin.change24h > 0) totalScore += Math.min(coin.change24h * 2, 15);
    else totalScore += Math.max(coin.change24h * 2, -15);
    
    // 7d trend alignment
    if (coin.change7d > 0 && dowAnalysis.trend === 'bullish') totalScore += 10;
    
    // Normalize score to 0-100
    const normalizedScore = Math.max(0, Math.min(100, 50 + totalScore));
    
    // Calculate target and stop loss
    const atr = calculateATR(coin.sparkline || []);
    const targetPrice = coin.price * (1 + (normalizedScore - 50) / 200);
    const stopLoss = coin.price * (1 - atr / coin.price * 2);
    
    // Generate reason
    const reasons: string[] = [];
    if (dowAnalysis.trend === 'bullish') reasons.push('روند صعودی داو');
    if (smcAnalysis.breakOfStructure?.type === 'bullish') reasons.push('شکست ساختار صعودی');
    if (smcAnalysis.orderBlock?.type === 'bullish') reasons.push('اوردر بلاک صعودی');
    if (smcAnalysis.fairValueGap?.type === 'bullish') reasons.push('FVG صعودی');
    if (smcAnalysis.liquidityZone?.type === 'buy') reasons.push('منطقه نقدینگی خرید');
    if (coin.change24h > 3) reasons.push('مومنتوم مثبت ۲۴ ساعته');
    if (coin.change7d > 5) reasons.push('روند هفتگی قوی');
    
    return {
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      score: normalizedScore,
      dowTrend: dowAnalysis.trend,
      smcSignal: smcAnalysis.signal,
      orderBlock: smcAnalysis.orderBlock,
      fairValueGap: smcAnalysis.fairValueGap,
      breakOfStructure: smcAnalysis.breakOfStructure,
      liquidityZone: smcAnalysis.liquidityZone,
      reason: reasons.join(' | ') || 'سیگنال خنثی',
      targetPrice,
      stopLoss,
      confidence: Math.min(95, Math.max(20, normalizedScore)),
    };
  });

  // Sort by score descending and return top 10
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function calculateATR(sparkline: number[], period: number = 14): number {
  if (sparkline.length < period + 1) return 0;
  
  const trueRanges: number[] = [];
  for (let i = 1; i < sparkline.length; i++) {
    const high = Math.max(sparkline[i], sparkline[i - 1]);
    const low = Math.min(sparkline[i], sparkline[i - 1]);
    trueRanges.push(high - low);
  }
  
  const recentTR = trueRanges.slice(-period);
  return recentTR.reduce((a, b) => a + b, 0) / recentTR.length;
}
