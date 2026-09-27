import { PriceAlert, CoinData } from '../types';
import { Bell, Trash2, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface AlertsProps {
  alerts: PriceAlert[];
  coins: CoinData[];
  onAdd: (alert: PriceAlert) => void;
  onRemove: (id: string) => void;
}

export default function Alerts({ alerts, coins, onAdd, onRemove }: AlertsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');

  const handleAdd = () => {
    if (!selectedCoin || !targetPrice) return;
    
    const coin = coins.find(c => c.id === selectedCoin);
    if (!coin) return;

    const alert: PriceAlert = {
      id: Date.now().toString(),
      coinId: selectedCoin,
      symbol: coin.symbol,
      targetPrice: parseFloat(targetPrice),
      direction,
      active: true,
      createdAt: Date.now(),
      triggered: false,
    };

    onAdd(alert);
    setShowAddForm(false);
    setTargetPrice('');
    setSelectedCoin('');
  };

  const activeAlerts = alerts.filter(a => a.active && !a.triggered);
  const triggeredAlerts = alerts.filter(a => a.triggered);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            مدیریت آلارم‌های قیمتی
          </h2>
          <p className="text-sm text-gray-dark mt-1">
            {activeAlerts.length} آلارم فعال | {triggeredAlerts.length} آلارم فعال‌شده
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          آلارم جدید
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-fade-in">
          <h3 className="font-bold text-sm text-text mb-4">ایجاد آلارم جدید</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-dark block mb-1">انتخاب ارز</label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">انتخاب کنید...</option>
                {coins.map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.symbol} - {coin.name} (${coin.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-dark block mb-1">قیمت هدف</label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="قیمت دلاری"
              />
            </div>
            <div>
              <label className="text-xs text-gray-dark block mb-1">شرط</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as 'above' | 'below')}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="above">بالاتر از</option>
                <option value="below">پایین‌تر از</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                className="w-full py-2 rounded-xl bg-accent2 text-white text-sm font-medium hover:bg-accent2/90 transition-colors"
              >
                ثبت آلارم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-sm text-text">آلارم‌های فعال</h3>
        </div>
        
        {activeAlerts.length === 0 ? (
          <div className="p-8 text-center text-gray-mid">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">هیچ آلارم فعالی وجود ندارد</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-4 hover:bg-cream/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent2/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-accent2" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-text">{alert.symbol}</p>
                    <p className="text-xs text-gray-dark">
                      {alert.direction === 'above' ? '📈 بالاتر از' : '📉 پایین‌تر از'} {' '}
                      <span className="font-bold text-primary">${alert.targetPrice.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-mid flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                  <button
                    onClick={() => onRemove(alert.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-sm text-text">آلارم‌های فعال‌شده</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {triggeredAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-green-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-text">{alert.symbol}</p>
                    <p className="text-xs text-green-600">
                      ✅ فعال شد - {alert.direction === 'above' ? 'بالاتر' : 'پایین‌تر'} از ${alert.targetPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(alert.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
