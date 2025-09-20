#!/bin/bash

# Ikigai AI Career Path Finder - Frontend Setup Script

echo "🚀 Setting up Ikigai AI Career Path Finder Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating environment configuration..."
    cp env.example .env.local
    echo "✅ Environment file created at .env.local"
    echo "⚠️  Please update .env.local with your Firebase configuration"
else
    echo "✅ Environment file already exists"
fi

# Create public assets if they don't exist
if [ ! -f public/favicon.ico ]; then
    echo "🎨 Creating default favicon..."
    # Create a simple favicon placeholder
    echo "<!-- Placeholder favicon -->" > public/favicon.ico
fi

if [ ! -f public/manifest.json ]; then
    echo "📱 Creating web app manifest..."
    cat > public/manifest.json << EOF
{
  "short_name": "Ikigai AI",
  "name": "Ikigai AI Career Path Finder",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff"
}
EOF
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Firebase configuration"
echo "2. Ensure your backend API is running on http://localhost:4000"
echo "3. Run 'npm start' to start the development server"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🔧 Configuration needed:"
echo "   - Firebase API keys in .env.local"
echo "   - Backend API running on port 4000"
echo ""
echo "📚 For more information, see README.md"
