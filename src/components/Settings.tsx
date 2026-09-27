import { NotificationSettings } from '../types';
import { 
  Bell, Mail, Send, MessageCircle, Twitter, 
  Save, ToggleLeft, ToggleRight, Shield
} from 'lucide-react';
import { useState } from 'react';

interface SettingsProps {
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => void;
  onRequestNotification: () => void;
}

export default function Settings({ settings, onUpdate, onRequestNotification }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateBrowserNotif = () => {
    if (!localSettings.browserNotification) {
      onRequestNotification();
    }
    setLocalSettings(prev => ({
      ...prev,
      browserNotification: !prev.browserNotification,
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent2" />
            تنظیمات نوتیفیکیشن
          </h2>
          <p className="text-sm text-gray-dark mt-1">
            تنظیم روش‌های اطلاع‌رسانی و APIهای خارجی
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
            saved 
              ? 'bg-green-100 text-green-700' 
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'ذخیره شد ✓' : 'ذخیره تنظیمات'}
        </button>
      </div>

      {/* Browser Notifications */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent3/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent3" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text">نوتیفیکیشن مرورگر</h3>
              <p className="text-xs text-gray-dark">دریافت اعلان مستقیم در مرورگر</p>
            </div>
          </div>
          <button onClick={updateBrowserNotif} className="text-primary">
            {localSettings.browserNotification ? (
              <ToggleRight className="w-10 h-10" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-gray-mid" />
            )}
          </button>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text">اطلاع‌رسانی ایمیل</h3>
              <p className="text-xs text-gray-dark">ارسال آلارم به ایمیل</p>
            </div>
          </div>
          <button 
            onClick={() => setLocalSettings(prev => ({
              ...prev,
              email: { ...prev.email, enabled: !prev.email.enabled }
            }))}
            className="text-primary"
          >
            {localSettings.email.enabled ? (
              <ToggleRight className="w-10 h-10" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-gray-mid" />
            )}
          </button>
        </div>
        
        {localSettings.email.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
            <InputField 
              label="آدرس ایمیل" 
              value={localSettings.email.address}
              onChange={(v) => setLocalSettings(prev => ({...prev, email: {...prev.email, address: v}}))}
              placeholder="example@email.com"
            />
            <InputField 
              label="سرور SMTP" 
              value={localSettings.email.smtpServer}
              onChange={(v) => setLocalSettings(prev => ({...prev, email: {...prev.email, smtpServer: v}}))}
              placeholder="smtp.gmail.com"
            />
            <InputField 
              label="پورت SMTP" 
              value={localSettings.email.smtpPort.toString()}
              onChange={(v) => setLocalSettings(prev => ({...prev, email: {...prev.email, smtpPort: parseInt(v) || 587}}))}
              placeholder="587"
              type="number"
            />
            <InputField 
              label="نام کاربری SMTP" 
              value={localSettings.email.smtpUser}
              onChange={(v) => setLocalSettings(prev => ({...prev, email: {...prev.email, smtpUser: v}}))}
              placeholder="user@gmail.com"
            />
            <InputField 
              label="رمز عبور SMTP" 
              value={localSettings.email.smtpPass}
              onChange={(v) => setLocalSettings(prev => ({...prev, email: {...prev.email, smtpPass: v}}))}
              placeholder="••••••••"
              type="password"
            />
          </div>
        )}
      </div>

      {/* Telegram Settings */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent2/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-accent2" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text">تلگرام</h3>
              <p className="text-xs text-gray-dark">ارسال پیام به کانال/گروه تلگرام</p>
            </div>
          </div>
          <button 
            onClick={() => setLocalSettings(prev => ({
              ...prev,
              telegram: { ...prev.telegram, enabled: !prev.telegram.enabled }
            }))}
            className="text-accent2"
          >
            {localSettings.telegram.enabled ? (
              <ToggleRight className="w-10 h-10" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-gray-mid" />
            )}
          </button>
        </div>
        
        {localSettings.telegram.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
            <InputField 
              label="Bot Token" 
              value={localSettings.telegram.botToken}
              onChange={(v) => setLocalSettings(prev => ({...prev, telegram: {...prev.telegram, botToken: v}}))}
              placeholder="123456:ABC-DEF..."
            />
            <InputField 
              label="Chat ID" 
              value={localSettings.telegram.chatId}
              onChange={(v) => setLocalSettings(prev => ({...prev, telegram: {...prev.telegram, chatId: v}}))}
              placeholder="-1001234567890"
            />
          </div>
        )}
      </div>

      {/* Discord Settings */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text">دیسکورد</h3>
              <p className="text-xs text-gray-dark">ارسال به وبهوک دیسکورد</p>
            </div>
          </div>
          <button 
            onClick={() => setLocalSettings(prev => ({
              ...prev,
              discord: { ...prev.discord, enabled: !prev.discord.enabled }
            }))}
            className="text-purple-600"
          >
            {localSettings.discord.enabled ? (
              <ToggleRight className="w-10 h-10" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-gray-mid" />
            )}
          </button>
        </div>
        
        {localSettings.discord.enabled && (
          <div className="animate-fade-in">
            <InputField 
              label="Webhook URL" 
              value={localSettings.discord.webhookUrl}
              onChange={(v) => setLocalSettings(prev => ({...prev, discord: {...prev.discord, webhookUrl: v}}))}
              placeholder="https://discord.com/api/webhooks/..."
            />
          </div>
        )}
      </div>

      {/* Twitter Settings */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Twitter className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text">توییتر / X</h3>
              <p className="text-xs text-gray-dark">انتشار خودکار توییت</p>
            </div>
          </div>
          <button 
            onClick={() => setLocalSettings(prev => ({
              ...prev,
              twitter: { ...prev.twitter, enabled: !prev.twitter.enabled }
            }))}
            className="text-blue-500"
          >
            {localSettings.twitter.enabled ? (
              <ToggleRight className="w-10 h-10" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-gray-mid" />
            )}
          </button>
        </div>
        
        {localSettings.twitter.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
            <InputField 
              label="API Key" 
              value={localSettings.twitter.apiKey}
              onChange={(v) => setLocalSettings(prev => ({...prev, twitter: {...prev.twitter, apiKey: v}}))}
              placeholder="API Key"
            />
            <InputField 
              label="API Secret" 
              value={localSettings.twitter.apiSecret}
              onChange={(v) => setLocalSettings(prev => ({...prev, twitter: {...prev.twitter, apiSecret: v}}))}
              placeholder="API Secret"
              type="password"
            />
            <InputField 
              label="Access Token" 
              value={localSettings.twitter.accessToken}
              onChange={(v) => setLocalSettings(prev => ({...prev, twitter: {...prev.twitter, accessToken: v}}))}
              placeholder="Access Token"
            />
            <InputField 
              label="Access Secret" 
              value={localSettings.twitter.accessSecret}
              onChange={(v) => setLocalSettings(prev => ({...prev, twitter: {...prev.twitter, accessSecret: v}}))}
              placeholder="Access Secret"
              type="password"
            />
          </div>
        )}
      </div>

      {/* Extension Bridge Info */}
      <div className="bg-gradient-to-l from-accent2/5 to-accent3/5 rounded-2xl p-5 border border-accent2/20">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-accent2 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm text-text mb-1">Extension Bridge</h3>
            <p className="text-xs text-gray-dark leading-6">
              تمامی درخواست‌ها به APIهای خارجی از طریق اکستنشن مرورگر Extension Bridge ارسال می‌شود.
              این روش مشکل CORS را حل کرده و از فیلتر IP ایران جلوگیری می‌کند.
              مطمئن شوید اکستنشن نصب و فعال باشد.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-dark block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        placeholder={placeholder}
      />
    </div>
  );
}
