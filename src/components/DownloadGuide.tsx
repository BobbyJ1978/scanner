import { Download, FolderOpen, Terminal, Globe, CheckCircle2, AlertTriangle, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function DownloadGuide() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const steps = [
    {
      title: 'دانلود Node.js',
      icon: <Download className="w-5 h-5" />,
      color: 'bg-green-100 text-green-700',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-dark leading-7">
            ابتدا باید Node.js را روی سیستم خود نصب کنید. این نرم‌افزار رایگان است.
          </p>
          <a 
            href="https://nodejs.org/en/download" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            دانلود Node.js از سایت رسمی
          </a>
          <div className="bg-gray-light/50 rounded-xl p-3">
            <p className="text-xs text-gray-dark">
              💡 نسخه <strong>LTS</strong> (پایدار) را دانلود کنید. نسخه ۱۸ یا بالاتر مناسب است.
            </p>
          </div>
          <p className="text-sm text-gray-dark">
            پس از دانلود، فایل نصب را اجرا کنید و مراحل را طی کنید (همه گزینه‌ها پیش‌فرض بمانند).
          </p>
        </div>
      ),
    },
    {
      title: 'دانلود فایل‌های پروژه',
      icon: <FolderOpen className="w-5 h-5" />,
      color: 'bg-primary/10 text-primary',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-dark leading-7">
            فایل‌های پروژه را از این صفحه دانلود کنید. روی دکمه <strong>"Download"</strong> در بالای صفحه کلیک کنید تا یک فایل ZIP دریافت کنید.
          </p>
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-primary font-medium mb-2">📦 ساختار فایل‌های دانلودی:</p>
            <pre className="text-xs text-gray-dark font-mono leading-6 bg-white rounded-lg p-3 overflow-x-auto" dir="ltr">{`project/
├── dist/              ← فایل‌های ساخته‌شده (آماده اجرا)
│   ├── index.html
│   └── assets/
├── public/
│   ├── config.json    ← تنظیمات API
│   ├── Run.bat        ← فایل اجرای خودکار
│   ├── requirements.txt
│   ├── README.md
│   └── server/
│       ├── server.js  ← سرور بک‌اند
│       └── package.json
├── src/               ← کد منبع (اختیاری)
├── package.json
└── index.html`}</pre>
          </div>
          <p className="text-sm text-gray-dark">
            فایل ZIP را در محل دلخواه (مثلاً Desktop) اکسترکت (Extract) کنید.
          </p>
        </div>
      ),
    },
    {
      title: 'اجرای برنامه با Run.bat',
      icon: <Terminal className="w-5 h-5" />,
      color: 'bg-accent2/10 text-accent2',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-dark leading-7">
            ساده‌ترین روش اجرا، استفاده از فایل <strong>Run.bat</strong> است:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-gray-light/30 rounded-xl p-3">
              <span className="w-7 h-7 rounded-full bg-accent2 text-white flex items-center justify-center text-xs font-bold">1</span>
              <p className="text-sm text-text">به پوشه <code className="bg-gray-light px-2 py-0.5 rounded text-xs">public</code> بروید</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-light/30 rounded-xl p-3">
              <span className="w-7 h-7 rounded-full bg-accent2 text-white flex items-center justify-center text-xs font-bold">2</span>
              <p className="text-sm text-text">روی فایل <code className="bg-gray-light px-2 py-0.5 rounded text-xs">Run.bat</code> دابل‌کلیک کنید</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-light/30 rounded-xl p-3">
              <span className="w-7 h-7 rounded-full bg-accent2 text-white flex items-center justify-center text-xs font-bold">3</span>
              <p className="text-sm text-text">صبر کنید تا نصب و بیلد انجام شود (بار اول چند دقیقه طول می‌کشد)</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-light/30 rounded-xl p-3">
              <span className="w-7 h-7 rounded-full bg-accent2 text-white flex items-center justify-center text-xs font-bold">4</span>
              <p className="text-sm text-text">مرورگر به صورت خودکار باز می‌شود: <code className="bg-gray-light px-2 py-0.5 rounded text-xs">http://localhost:3000</code></p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
            <p className="text-xs text-yellow-800 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              اگر Run.bat کار نکرد، از روش دستی زیر استفاده کنید.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'روش دستی (Command Prompt)',
      icon: <Terminal className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-dark leading-7">
            اگر Run.bat کار نکرد، این دستورات را در Command Prompt اجرا کنید:
          </p>
          <div className="space-y-2">
            {[
              { cmd: 'cd مسیر\\پوشه\\پروژه', id: 'cmd1', desc: 'رفتن به پوشه پروژه' },
              { cmd: 'npm install', id: 'cmd2', desc: 'نصب پکیج‌های فرانت‌اند' },
              { cmd: 'npm run build', id: 'cmd3', desc: 'بیلد فرانت‌اند' },
              { cmd: 'cd public\\server', id: 'cmd4', desc: 'رفتن به پوشه سرور' },
              { cmd: 'npm install', id: 'cmd5', desc: 'نصب پکیج‌های سرور' },
              { cmd: 'node server.js', id: 'cmd6', desc: 'اجرای سرور' },
            ].map((item, i) => (
              <div key={item.id} className="bg-gray-900 rounded-xl p-3 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-xs font-mono">$</span>
                  <code className="text-green-300 text-sm font-mono" dir="ltr">{item.cmd}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs hidden md:inline">{item.desc}</span>
                  <button
                    onClick={() => copyToClipboard(item.cmd, item.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedCmd === item.id ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'نصب Extension Bridge (اختیاری)',
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-accent3/10 text-accent2',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-dark leading-7">
            برای اتصال بدون مشکل به APIها (مخصوصاً اگر IP ایران هستید)، اکستنشن Extension Bridge را نصب کنید:
          </p>
          <div className="bg-accent3/5 rounded-xl p-4 border border-accent3/20">
            <p className="text-sm text-text font-medium mb-2">🔧 Extension Bridge چیست؟</p>
            <p className="text-xs text-gray-dark leading-6">
              یک اکستنشن مرورگر است که درخواست‌های API را از طریق پروکسی امن ارسال می‌کند.
              این کار مشکل CORS را حل کرده و از فیلتر IP جلوگیری می‌کند.
            </p>
          </div>
          <div className="bg-gray-light/30 rounded-xl p-3">
            <p className="text-xs text-gray-dark">
              💡 <strong>نکته:</strong> اگر از سرور بک‌اند استفاده می‌کنید، نیازی به اکستنشن نیست چون سرور خودش درخواست‌ها را پروکسی می‌کند.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-l from-primary/10 to-accent1/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent1 flex items-center justify-center shadow-lg">
            <Download className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-text mb-1">راهنمای دانلود و نصب</h2>
            <p className="text-sm text-gray-dark leading-7">
              با دنبال کردن مراحل زیر، برنامه را روی سیستم خود نصب و اجرا کنید.
              کل فرآیند حدود ۵ دقیقه طول می‌کشد.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-sm text-text mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          شروع سریع (۳ مرحله)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-green-700 font-bold">1</span>
            </div>
            <p className="text-sm font-medium text-text">Node.js نصب کنید</p>
            <p className="text-xs text-gray-dark mt-1">از nodejs.org</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-700 font-bold">2</span>
            </div>
            <p className="text-sm font-medium text-text">فایل‌ها را دانلود کنید</p>
            <p className="text-xs text-gray-dark mt-1">دکمه Download بالا</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-700 font-bold">3</span>
            </div>
            <p className="text-sm font-medium text-text">Run.bat را اجرا کنید</p>
            <p className="text-xs text-gray-dark mt-1">در پوشه public</p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-light/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center`}>
                  {step.icon}
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-mid">مرحله {index + 1}</span>
                  <h3 className="font-bold text-sm text-text">{step.title}</h3>
                </div>
              </div>
              {expandedStep === index ? (
                <ChevronUp className="w-5 h-5 text-gray-mid" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-mid" />
              )}
            </button>
            
            {expandedStep === index && (
              <div className="px-4 pb-4 border-t border-gray-50 pt-4 animate-fade-in">
                {step.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Troubleshooting */}
      <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200">
        <h3 className="font-bold text-sm text-yellow-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          رفع مشکلات رایج
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-3">
            <p className="text-sm font-medium text-text">❌ خطای "node not found"</p>
            <p className="text-xs text-gray-dark mt-1">Node.js نصب نیست. از مرحله ۱ شروع کنید.</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-sm font-medium text-text">❌ خطای CORS در مرورگر</p>
            <p className="text-xs text-gray-dark mt-1">سرور بک‌اند را اجرا کنید یا Extension Bridge نصب کنید.</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-sm font-medium text-text">❌ پورت 3000 اشغال است</p>
            <p className="text-xs text-gray-dark mt-1">در فایل config.json پورت را تغییر دهید.</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-sm font-medium text-text">❌ داده‌ها نمایش داده نمی‌شوند</p>
            <p className="text-xs text-gray-dark mt-1">اتصال اینترنت را بررسی کنید. برنامه از داده‌های نمونه هم استفاده می‌کند.</p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-accent2/5 rounded-2xl p-5 border border-accent2/20 text-center">
        <p className="text-sm text-accent2 font-medium">
          💬 در صورت بروز مشکل، فایل <code className="bg-white px-2 py-0.5 rounded text-xs">requirements.txt</code> را بررسی کنید.
        </p>
      </div>
    </div>
  );
}
