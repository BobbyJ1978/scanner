import { AnalysisResult, CoinData } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap, Layers, Target } from 'lucide-react';

interface AnalysisPanelProps {
  watchlist: AnalysisResult[];
  coinData: CoinData[];
}

export default function AnalysisPanel({ watchlist, coinData }: AnalysisPanelProps) {
  const bullishCoins = watchlist.filter(w => w.smcSignal === 'buy');
  const bearishCoins = watchlist.filter(w => w.smcSignal === 'sell');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-text flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          تحلیل تکنیکال - داو تئوری و SMC
        </h2>
        <p className="text-sm text-gray-dark mt-1">
          تحلیل ترکیبی Dow Theory + Smart Money Concepts برای شناسایی فرصت‌های معاملاتی
        </p>
      </div>

      {/* Methodology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-text">داو تئوری (Dow Theory)</h3>
          </div>
          <div className="space-y-2 text-xs text-gray-dark leading-6">
            <p>• <strong>روند اولیه:</strong> شناسایی Higher Highs و Higher Lows</p>
            <p>• <strong>تایید حجم:</strong> بررسی تطابق حجم با جهت روند</p>
            <p>• <strong>ساختار بازار:</strong> تحلیل شکست‌ها و بازگشت‌ها</p>
            <p>• <strong>همبستگی:</strong> بررسی ارتباط بین ارزهای مختلف</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent2/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent2" />
            </div>
            <h3 className="font-bold text-text">پول هوشمند (SMC)</h3>
          </div>
          <div className="space-y-2 text-xs text-gray-dark leading-6">
            <p>• <strong>Order Block:</strong> شناسایی نواحی ورود نهادها</p>
            <p>• <strong>Fair Value Gap:</strong> شناسایی شکاف‌های قیمتی</p>
            <p>• <strong>Break of Structure:</strong> تشخیص تغییر ساختار</p>
            <p>• <strong>Liquidity Zones:</strong> شناسایی مناطق نقدینگی</p>
          </div>
        </div>
      </div>

      {/* Score Distribution Chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-sm text-text mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          توزیع امتیاز واچ‌لیست
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={watchlist.map(w => ({ name: w.symbol, score: w.score, confidence: w.confidence }))}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #eee',
                  fontFamily: 'Vazirmatn',
                  direction: 'rtl'
                }} 
              />
              <Area type="monotone" dataKey="score" stroke="#FE7A15" fill="#FE7A15" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="confidence" stroke="#0191B4" fill="#0191B4" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-gray-dark">امتیاز کلی</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent2" />
            <span className="text-xs text-gray-dark">سطح اعتماد</span>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {watchlist.slice(0, 6).map(coin => (
          <AnalysisCard key={coin.coinId} analysis={coin} coinData={coinData.find(c => c.id === coin.coinId)} />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-l from-primary/5 to-accent1/5 rounded-2xl p-5 border border-primary/20">
        <h3 className="font-bold text-sm text-text mb-3">📊 خلاصه تحلیل</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-gray-dark">
              <strong className="text-green-600">{bullishCoins.length}</strong> سیگنال خرید قوی
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-gray-dark">
              <strong className="text-red-500">{bearishCoins.length}</strong> سیگنال فروش
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-gray-dark">
              <strong className="text-primary">{watchlist.filter(w => w.confidence > 70).length}</strong> با اعتماد بالا
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisCard({ analysis, coinData }: { analysis: AnalysisResult; coinData?: CoinData }) {
  const chartData = coinData?.sparkline?.map((price, i) => ({ index: i, price })) || [];

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent2 to-accent3 flex items-center justify-center text-white text-xs font-bold">
            {analysis.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="font-bold text-sm text-text">{analysis.symbol}</p>
            <p className="text-[10px] text-gray-mid">{analysis.name}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
          analysis.smcSignal === 'buy' ? 'bg-green-100 text-green-700' :
          analysis.smcSignal === 'sell' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {analysis.smcSignal === 'buy' ? 'خرید' : analysis.smcSignal === 'sell' ? 'فروش' : 'انتظار'}
        </div>
      </div>

      {/* Mini Chart */}
      {chartData.length > 0 && (
        <div className="h-20 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={analysis.smcSignal === 'buy' ? '#16a34a' : analysis.smcSignal === 'sell' ? '#dc2626' : '#ca8a04'} 
                strokeWidth={1.5} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Analysis Details */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-mid">روند داو:</span>
          <span className={`font-medium ${
            analysis.dowTrend === 'bullish' ? 'text-green-600' : 
            analysis.dowTrend === 'bearish' ? 'text-red-500' : 'text-gray-dark'
          }`}>
            {analysis.dowTrend === 'bullish' ? '↑ صعودی' : analysis.dowTrend === 'bearish' ? '↓ نزولی' : '→ خنثی'}
          </span>
        </div>
        
        {analysis.orderBlock && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-mid">Order Block:</span>
            <span className={`font-medium ${analysis.orderBlock.type === 'bullish' ? 'text-green-600' : 'text-red-500'}`}>
              {analysis.orderBlock.type === 'bullish' ? '🟢' : '🔴'} ${analysis.orderBlock.price.toFixed(2)}
            </span>
          </div>
        )}
        
        {analysis.breakOfStructure && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-mid">BOS:</span>
            <span className={`font-medium ${analysis.breakOfStructure.type === 'bullish' ? 'text-green-600' : 'text-red-500'}`}>
              {analysis.breakOfStructure.type === 'bullish' ? '🟢 شکست صعودی' : '🔴 شکست نزولی'}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-mid">هدف:</span>
          <span className="font-medium text-green-600">${analysis.targetPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-mid">حد ضرر:</span>
          <span className="font-medium text-red-500">${analysis.stopLoss.toFixed(2)}</span>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-mid">اعتماد</span>
          <span className="text-[10px] font-bold text-primary">{analysis.confidence.toFixed(0)}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-gray-light overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-l from-primary to-accent1 transition-all duration-500"
            style={{ width: `${analysis.confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}
