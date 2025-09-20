@echo off
REM Ikigai AI Career Path Finder - Frontend Setup Script for Windows

echo 🚀 Setting up Ikigai AI Career Path Finder Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create environment file if it doesn't exist
if not exist .env.local (
    echo 📝 Creating environment configuration...
    copy env.example .env.local
    echo ✅ Environment file created at .env.local
    echo ⚠️  Please update .env.local with your Firebase configuration
) else (
    echo ✅ Environment file already exists
)

REM Create public assets if they don't exist
if not exist public\favicon.ico (
    echo 🎨 Creating default favicon...
    echo <!-- Placeholder favicon --> > public\favicon.ico
)

if not exist public\manifest.json (
    echo 📱 Creating web app manifest...
    (
        echo {
        echo   "short_name": "Ikigai AI",
        echo   "name": "Ikigai AI Career Path Finder",
        echo   "icons": [
        echo     {
        echo       "src": "favicon.ico",
        echo       "sizes": "64x64 32x32 24x24 16x16",
        echo       "type": "image/x-icon"
        echo     }
        echo   ],
        echo   "start_url": ".",
        echo   "display": "standalone",
        echo   "theme_color": "#3b82f6",
        echo   "background_color": "#ffffff"
        echo }
    ) > public\manifest.json
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update .env.local with your Firebase configuration
echo 2. Ensure your backend API is running on http://localhost:4000
echo 3. Run 'npm start' to start the development server
echo 4. Open http://localhost:3000 in your browser
echo.
echo 🔧 Configuration needed:
echo    - Firebase API keys in .env.local
echo    - Backend API running on port 4000
echo.
echo 📚 For more information, see README.md
pause
