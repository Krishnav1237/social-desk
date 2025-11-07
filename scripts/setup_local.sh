#!/bin/bash

# SocialDesk Local Development Setup Script

set -e

echo "🚀 SocialDesk Local Setup"
echo "========================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API keys (OpenAI, Stripe, etc.)"
    echo ""
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "🐳 Starting Docker containers..."
docker-compose up -d postgres redis qdrant

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "📊 Running database migrations..."
cd backend
npm run migrate

echo ""
echo "🌱 Seeding database with test data..."
psql $DATABASE_URL < ../scripts/seed_data.sql || echo "⚠️  Seed data may already exist"

cd ..

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start development:"
echo "  1. Backend:  cd backend && npm run dev"
echo "  2. Frontend: cd frontend && npm run dev"
echo "  3. Worker:   cd backend && npm run worker"
echo ""
echo "Or use Docker Compose:"
echo "  docker-compose up --build"
echo ""
echo "URLs:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:4000"
echo "  - API Docs: http://localhost:4000/docs"
echo "  - Qdrant:   http://localhost:6333/dashboard"
echo ""
echo "Test credentials:"
echo "  Email: emma@socialdesk.com"
echo "  Password: password123"
echo ""
