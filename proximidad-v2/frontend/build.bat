@echo off
REM Build script for ProXimidad Frontend (Windows)

echo 🚀 Building ProXimidad Frontend...

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build for production
echo 🔨 Building for production...
npm run build

echo ✅ Frontend build completed!
echo 🔗 Production files in /dist folder
echo 🔗 Run dev: npm run dev
pause
