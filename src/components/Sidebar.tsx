import { AppState } from '../types';
import { 
  BarChart3, Bell, Settings, TrendingUp, 
  Activity, Shield, Download
} from 'lucide-react';

interface SidebarProps {
  activeTab: AppState['activeTab'];
  onTabChange: (tab: AppState['activeTab']) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'download' as const, label: 'دانلود و نصب', icon: Download },
    { id: 'watchlist' as const, label: 'واچ‌لیست', icon: TrendingUp },
    { id: 'analysis' as const, label: 'تحلیل تکنیکال', icon: BarChart3 },
    { id: 'alerts' as const, label: 'آلارم‌ها', icon: Bell },
    { id: 'settings' as const, label: 'تنظیمات', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-l border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent1 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-text text-sm">SMC Analyzer</h1>
            <p className="text-xs text-gray-mid">داو تئوری + پول هوشمند</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary shadow-sm' 
                  : 'text-gray-dark hover:bg-gray-light hover:text-text'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && (
                <div className="mr-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent2/5">
          <Shield className="w-4 h-4 text-accent2" />
          <span className="text-xs text-accent2 font-medium">Extension Bridge</span>
        </div>
        <p className="text-[10px] text-gray-mid mt-2 px-3">
          اتصال امن از طریق Extension Bridge
        </p>
      </div>
    </aside>
  );
}
