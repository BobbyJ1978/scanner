import { NotificationSettings } from '../types';
import { 
  Bell, Mail, Send, MessageCircle, Twitter, 
  Save, ToggleLeft, ToggleRight, Shield, Download, Loader2
} from 'lucide-react';
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface SettingsProps {
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => void;
  onRequestNotification: () => void;
}

export default function Settings({ settings, onUpdate, onRequestNotification }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const downloadProject = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const project = zip.folder('SMC-Analyzer')!;

      // Fetch all project files (public files)
      const publicFiles = [
        { path: 'config.json', url: '/config.json' },
        { path: 'Run.bat', url: '/Run.bat' },
        { path: 'requirements.txt', url: '/requirements.txt' },
        { path: 'README.md', url: '/README.md' },
        { path: 'server/server.js', url: '/server/server.js' },
        { path: 'server/package.json', url: '/server/package.json' },
      ];

      // Fetch source code files
      const sourceFiles = [
        { path: 'src/App.tsx', url: '/source/App.tsx' },
        { path: 'src/main.tsx', url: '/source/main.tsx' },
        { path: 'src/types.ts', url: '/source/types.ts' },
        { path: 'src/index.css', url: '/source/index.css' },
        { path: 'src/utils/api.ts', url: '/source/utils/api.ts' },
        { path: 'src/utils/analysis.ts', url: '/source/utils/analysis.ts' },
        { path: 'src/components/Sidebar.tsx', url: '/source/components/Sidebar.tsx' },
        { path: 'src/components/Header.tsx', url: '/source/components/Header.tsx' },
        { path: 'src/components/Watchlist.tsx', url: '/source/components/Watchlist.tsx' },
        { path: 'src/components/Alerts.tsx', url: '/source/components/Alerts.tsx' },
        { path: 'src/components/Settings.tsx', url: '/source/components/Settings.tsx' },
        { path: 'src/components/AnalysisPanel.tsx', url: '/source/components/AnalysisPanel.tsx' },
      ];

      const allFiles = [...publicFiles, ...sourceFiles];

      for (const file of allFiles) {
        try {
          const response = await fetch(file.url);
          if (response.ok) {
            const content = await response.text();
            project.file(file.path, content);
          } else {
            console.warn(`File not found: ${file.path}`);
          }
        } catch (e) {
          console.warn(`Failed to fetch ${file.path}:`, e);
        }
      }

      // Add package.json for frontend
      const frontendPackageJson = {
        name: "smc-analyzer",
        version: "1.0.0",
        private: true,
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview"
        },
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          recharts: "^2.10.0",
          "lucide-react": "^0.294.0",
          jszip: "^3.10.1",
          "file-saver": "^2.0.5"
        },
        devDependencies: {
          "@vitejs/plugin-react": "^4.3.4",
          vite: "^6.3.5",
          tailwindcss: "^4.1.7",
          "@tailwindcss/vite": "^4.1.7",
          typescript: "^5.7.0"
        }
      };
      project.file('package.json', JSON.stringify(frontendPackageJson, null, 2));

      // Add vite.config.js
      const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});
`;
      project.file('vite.config.js', viteConfig);

      // Add tsconfig.json
      const tsConfig = {
        compilerOptions: {
          target: "ES2020",
          useDefineForClassFields: true,
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true
        },
        include: ["src"],
        references: [{ path: "./tsconfig.node.json" }]
      };
      project.file('tsconfig.json', JSON.stringify(tsConfig, null, 2));

      // Add index.html
      const indexHtml = `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>داشبورد تحلیل هوشمند ارز دیجیتال - SMC & Dow Theory</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <style>
      * { font-family: 'Vazirmatn', sans-serif !important; }
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
      project.file('index.html', indexHtml);

      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'SMC-Analyzer.zip');
    } catch (error) {
      console.error('Download error:', error);
      alert('خطا در دانلود فایل‌ها. لطفاً دوباره تلاش کنید.');
    } finally {
      setDownloading(false);
    }
  };

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
      {/* Download Button */}
      <div className="bg-gradient-to-l from-accent2/10 to-accent3/10 rounded-2xl p-5 border border-accent2/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent2 to-accent3 flex items-center justify-center shadow-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-text">دانلود کامل برنامه</h3>
              <p className="text-xs text-gray-dark mt-0.5">
                تمام فایل‌های پروژه شامل سرور، تنظیمات و اسکریپت اجرا
              </p>
            </div>
          </div>
          <button
            onClick={downloadProject}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent2 text-white text-sm font-medium hover:bg-accent2/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال آماده‌سازی...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                دانلود ZIP
              </>
            )}
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-accent2/10">
          <p className="text-xs text-gray-dark leading-6">
            📦 فایل ZIP شامل: <code className="bg-white px-1.5 py-0.5 rounded text-[10px]">Run.bat</code> (اجرای خودکار)، 
            <code className="bg-white px-1.5 py-0.5 rounded text-[10px] mr-1">config.json</code> (تنظیمات)، 
            <code className="bg-white px-1.5 py-0.5 rounded text-[10px] mr-1">server/</code> (سرور بک‌اند)، 
            <code className="bg-white px-1.5 py-0.5 rounded text-[10px] mr-1">requirements.txt</code> (ملزومات)
          </p>
        </div>
      </div>

      {/* Settings Header */}
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
