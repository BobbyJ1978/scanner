import { RefreshCw, Clock } from 'lucide-react';

interface HeaderProps {
  lastUpdate: number | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function Header({ lastUpdate, onRefresh, isLoading }: HeaderProps) {
  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return '...';
    return new Date(timestamp).toLocaleTimeString('fa-IR');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-text">
          داشبورد تحلیل هوشمند
        </h2>
        <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent3/10 text-accent2 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          آنلاین
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-dark">
          <Clock className="w-4 h-4" />
          <span>آخرین بروزرسانی: {formatTime(lastUpdate)}</span>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">بروزرسانی</span>
        </button>
      </div>
    </header>
  );
}
