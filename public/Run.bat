@echo off
chcp 65001 >nul
title SMC Analyzer - داشبورد تحلیل هوشمند ارز دیجیتال
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║                                                      ║
echo  ║   🚀 SMC Analyzer - داشبورد تحلیل هوشمند            ║
echo  ║   Dow Theory + Smart Money Concepts                  ║
echo  ║                                                      ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

REM Check Node.js
echo [1/4] بررسی نصب Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  ❌ خطا: Node.js نصب نیست!
    echo  لطفاً از https://nodejs.org نسخه LTS را دانلود و نصب کنید.
    echo.
    pause
    exit /b 1
)
echo  ✅ Node.js نصب است
node --version

REM Check npm
echo.
echo [2/4] بررسی نصب npm...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo  ❌ خطا: npm نصب نیست!
    pause
    exit /b 1
)
echo  ✅ npm نصب است
npm --version

REM Install server dependencies
echo.
echo [3/4] نصب ملزومات سرور...
cd server
if not exist node_modules (
    echo  در حال نصب پکیج‌های سرور...
    call npm install
    if %errorlevel% neq 0 (
        echo  ❌ خطا در نصب پکیج‌های سرور
        cd ..
        pause
        exit /b 1
    )
    echo  ✅ پکیج‌های سرور نصب شدند
) else (
    echo  ✅ پکیج‌های سرور از قبل نصب هستند
)
cd ..

REM Install frontend dependencies
echo.
echo [4/4] نصب ملزومات فرانت‌اند...
if not exist node_modules (
    echo  در حال نصب پکیج‌های فرانت‌اند...
    call npm install
    if %errorlevel% neq 0 (
        echo  ❌ خطا در نصب پکیج‌های فرانت‌اند
        pause
        exit /b 1
    )
    echo  ✅ پکیج‌های فرانت‌اند نصب شدند
) else (
    echo  ✅ پکیج‌های فرانت‌اند از قبل نصب هستند
)

REM Build frontend
echo.
echo ═══════════════════════════════════════════════════════
echo  در حال بیلد فرانت‌اند...
echo ═══════════════════════════════════════════════════════
call npm run build
if %errorlevel% neq 0 (
    echo  ❌ خطا در بیلد فرانت‌اند
    pause
    exit /b 1
)
echo  ✅ بیلد با موفقیت انجام شد

REM Start server
echo.
echo ═══════════════════════════════════════════════════════
echo  🚀 راه‌اندازی سرور...
echo ═══════════════════════════════════════════════════════
echo.
echo  📌 داشبورد در آدرس زیر در دسترس است:
echo  🌐 http://localhost:3000
echo.
echo  ⚠️  توجه: اکستنشن Extension Bridge را در مرورگر فعال کنید
echo.
echo  برای توقف سرور: Ctrl+C
echo ═══════════════════════════════════════════════════════
echo.

REM Open browser after 3 seconds
start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

REM Start server
cd server
node server.js
cd ..

pause
