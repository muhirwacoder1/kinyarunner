@echo off
echo 🚀 KinyaRunner Deployment Script
echo ================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
pnpm install

echo 🔨 Building project...
pnpm build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🌐 Ready for deployment!
    echo.
    echo Next steps:
    echo 1. Push to GitHub:
    echo    git add .
    echo    git commit -m "Ready for deployment"
    echo    git push origin main
    echo.
    echo 2. Deploy to Vercel:
    echo    vercel --prod
    echo.
    echo Or visit https://vercel.com to deploy via dashboard
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

pause