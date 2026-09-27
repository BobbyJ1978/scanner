import { AnalysisResult, PriceAlert } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, Target, ShieldAlert, Bell } from 'lucide-react';
import { useState } from 'react';

interface WatchlistProps {
  watchlist: AnalysisResult[];
  isLoading: boolean;
  onAddAlert: (alert: PriceAlert) => void;
}

export default function Watchlist({ watchlist, isLoading, onAddAlert }: WatchlistProps) {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [alertModal, setAlertModal] = useState<{ coinId: string; symbol: string } | null>(null);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertDirection, setAlertDirection] = useState<'above' | 'below'>('above');

  const handleAddAlert = () => {
    if (!alertModal || !alertPrice) return;
    
    const alert: PriceAlert = {
      id: Date.now().toString(),
      coinId: alertModal.coinId,
      symbol: alertModal.symbol,
      targetPrice: parseFloat(alertPrice),
      direction: alertDirection,
      active: true,
      createdAt: Date.now(),
      triggered: false,
    };
    
    onAddAlert(alert);
    setAlertModal(null);
    setAlertPrice('');
  };

  if (isLoading && watchlist.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-dark">در حال تحلیل بازار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard 
          title="سیگنال خرید" 
          value={watchlist.filter(w => w.smcSignal === 'buy').length.toString()}
          color="text-green-600"
          bgColor="bg-green-50"
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
        />
        <SummaryCard 
          title="سیگنال فروش" 
          value={watchlist.filter(w => w.smcSignal === 'sell').length.toString()}
          color="text-red-600"
          bgColor="bg-red-50"
          icon={<TrendingDown className="w-5 h-5 text-red-600" />}
        />
        <SummaryCard 
          title="روند صعودی داو" 
          value={watchlist.filter(w => w.dowTrend === 'bullish').length.toString()}
          color="text-accent2"
          bgColor="bg-accent2/5"
          icon={<TrendingUp className="w-5 h-5 text-accent2" />}
        />
        <SummaryCard 
          title="میانگین اعتماد" 
          value={`${Math.round(watchlist.reduce((a, b) => a + b.confidence, 0) / (watchlist.length || 1))}%`}
          color="text-primary"
          bgColor="bg-primary/5"
          icon={<AlertCircle className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Watchlist Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-text flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            واچ‌لیست ۱۰ ارز مستعد رشد (۷ روز آینده)
          </h3>
          <span className="text-xs text-gray-mid">بروزرسانی هر ۵ دقیقه</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-light/50">
              <tr className="text-xs text-gray-dark">
                <th className="text-right px-5 py-3 font-medium">رتبه</th>
                <th className="text-right px-5 py-3 font-medium">ارز</th>
                <th className="text-right px-5 py-3 font-medium">امتیاز</th>
                <th className="text-right px-5 py-3 font-medium">روند داو</th>
                <th className="text-right px-5 py-3 font-medium">سیگنال SMC</th>
                <th className="text-right px-5 py-3 font-medium">هدف</th>
                <th className="text-right px-5 py-3 font-medium">حد ضرر</th>
                <th className="text-right px-5 py-3 font-medium">اعتماد</th>
                <th className="text-right px-5 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((coin, index) => (
                <tr 
                  key={coin.coinId}
                  className={`border-b border-gray-50 hover:bg-cream/50 transition-colors cursor-pointer ${
                    selectedCoin === coin.coinId ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedCoin(selectedCoin === coin.coinId ? null : coin.coinId)}
                >
                  <td className="px-5 py-4">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      index < 3 ? 'bg-primary/10 text-primary' : 'bg-gray-light text-gray-dark'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent2 to-accent3 flex items-center justify-center text-white text-xs font-bold">
                        {coin.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text">{coin.symbol}</p>
                        <p className="text-xs text-gray-mid">{coin.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-gray-light overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-l from-primary to-accent1"
                          style={{ width: `${coin.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-text">{coin.score.toFixed(0)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <TrendBadge trend={coin.dowTrend} />
                  </td>
                  <td className="px-5 py-4">
                    <SignalBadge signal={coin.smcSignal} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-green-600 font-medium">
                      ${coin.targetPrice.toFixed(coin.targetPrice < 1 ? 4 : 2)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-red-500 font-medium">
                      ${coin.stopLoss.toFixed(coin.stopLoss < 1 ? 4 : 2)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-bold ${
                      coin.confidence > 70 ? 'text-green-600' : 
                      coin.confidence > 50 ? 'text-yellow-600' : 'text-red-500'
                    }`}>
                      {coin.confidence.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlertModal({ coinId: coin.coinId, symbol: coin.symbol });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-accent2/10 text-accent2 text-xs font-medium hover:bg-accent2/20 transition-colors"
                    >
                      <Bell className="w-3 h-3 inline ml-1" />
                      آلارم
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selectedCoin && (
          <div className="p-5 border-t border-gray-100 bg-cream/30 animate-fade-in">
            {(() => {
              const coin = watchlist.find(w => w.coinId === selectedCoin);
              if (!coin) return null;
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-text flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      دلیل سیگنال
                    </h4>
                    <p className="text-sm text-gray-dark">{coin.reason}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-text">ساختار SMC</h4>
                    <div className="space-y-1 text-xs">
                      {coin.orderBlock && (
                        <p className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${coin.orderBlock.type === 'bullish' ? 'bg-green-500' : 'bg-red-500'}`} />
                          اوردر بلاک {coin.orderBlock.type === 'bullish' ? 'صعودی' : 'نزولی'}: ${coin.orderBlock.price.toFixed(2)}
                        </p>
                      )}
                      {coin.fairValueGap && (
                        <p className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${coin.fairValueGap.type === 'bullish' ? 'bg-green-500' : 'bg-red-500'}`} />
                          FVG {coin.fairValueGap.type === 'bullish' ? 'صعودی' : 'نزولی'}
                        </p>
                      )}
                      {coin.breakOfStructure && (
                        <p className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${coin.breakOfStructure.type === 'bullish' ? 'bg-green-500' : 'bg-red-500'}`} />
                          شکست ساختار {coin.breakOfStructure.type === 'bullish' ? 'صعودی' : 'نزولی'}
                        </p>
                      )}
                      {coin.liquidityZone && (
                        <p className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${coin.liquidityZone.type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`} />
                          منطقه نقدینگی: ${coin.liquidityZone.level.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-text">سطوح کلیدی</h4>
                    <div className="space-y-1 text-xs">
                      <p>هدف: <span className="text-green-600 font-bold">${coin.targetPrice.toFixed(2)}</span></p>
                      <p>حد ضرر: <span className="text-red-500 font-bold">${coin.stopLoss.toFixed(2)}</span></p>
                      <p>ریسک/ریوارد: <span className="text-primary font-bold">
                        {((coin.targetPrice - coin.stopLoss) / (coin.stopLoss || 1) * 100).toFixed(1)}%
                      </span></p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Alert Modal */}
      {alertModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl animate-fade-in">
            <h3 className="font-bold text-lg text-text mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              تنظیم آلارم {alertModal.symbol}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-dark block mb-1">قیمت هدف (دلار)</label>
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  placeholder="مثال: 68000"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-dark block mb-1">شرط فعال‌سازی</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAlertDirection('above')}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      alertDirection === 'above' 
                        ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                        : 'bg-gray-light text-gray-dark border-2 border-transparent'
                    }`}
                  >
                    بالاتر از قیمت
                  </button>
                  <button
                    onClick={() => setAlertDirection('below')}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      alertDirection === 'below' 
                        ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                        : 'bg-gray-light text-gray-dark border-2 border-transparent'
                    }`}
                  >
                    پایین‌تر از قیمت
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setAlertModal(null)}
                  className="flex-1 py-2 rounded-xl bg-gray-light text-gray-dark text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleAddAlert}
                  className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  ثبت آلارم
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, color, bgColor, icon }: {
  title: string;
  value: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`${bgColor} rounded-2xl p-4 border border-gray-100`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <p className="text-xs text-gray-dark">{title}</p>
    </div>
  );
}

function TrendBadge({ trend }: { trend: string }) {
  const config = {
    bullish: { label: 'صعودی', color: 'bg-green-100 text-green-700', icon: '↑' },
    bearish: { label: 'نزولی', color: 'bg-red-100 text-red-700', icon: '↓' },
    neutral: { label: 'خنثی', color: 'bg-gray-100 text-gray-600', icon: '→' },
  }[trend] || { label: 'نامشخص', color: 'bg-gray-100 text-gray-600', icon: '?' };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
}

function SignalBadge({ signal }: { signal: string }) {
  const config = {
    buy: { label: 'خرید', color: 'bg-green-100 text-green-700 border-green-200' },
    sell: { label: 'فروش', color: 'bg-red-100 text-red-700 border-red-200' },
    wait: { label: 'انتظار', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  }[signal] || { label: 'نامشخص', color: 'bg-gray-100 text-gray-600 border-gray-200' };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${config.color}`}>
      {config.label}
    </span>
  );
}


