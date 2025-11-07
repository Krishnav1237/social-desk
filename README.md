# SocialDesk - AI-First Creator Operating System

![SocialDesk Banner](https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=SocialDesk+-+Your+AI+Creator+OS)

## 🚀 Overview

**SocialDesk** is an AI-powered platform designed to help Gen Z creators (18-25) grow their social media presence, monetize content, and collaborate with brands. Built with cutting-edge AI technology, SocialDesk streamlines content creation, scheduling, analytics, and monetization into one seamless experience.

### Key Features

- 🤖 **AI Caption & Hook Generator** - Generate viral captions and hooks using advanced LLM technology
- 📅 **Smart Scheduler** - Schedule posts across platforms with optimal timing recommendations
- 📊 **Analytics Dashboard** - Track performance and get actionable insights
- 🛍️ **Creator Marketplace** - Buy and sell digital templates and resources
- 🤝 **Brand Collaboration Tools** - Connect with brands and manage partnerships
- 🎯 **Gamification** - Build streaks, earn rewards, and share growth achievements
- 💰 **Monetization** - Sell digital products with integrated Stripe payments
- 🔗 **Referral System** - Grow together with built-in referral rewards

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14+ (React)
- Tailwind CSS
- SWR for data fetching
- Recharts for analytics visualization
- Framer Motion for animations

**Backend:**
- Node.js with Fastify
- PostgreSQL (primary database)
- Redis (job queue & caching)
- Qdrant (vector embeddings for AI personalization)
- BullMQ (job processing)

**AI/ML:**
- OpenAI GPT-4 (configurable LLM provider)
- Vector embeddings for style learning
- Custom prompt engineering

**Integrations:**
- Instagram Graph API
- Stripe Connect
- Email (SendGrid)
- S3-compatible storage

**Infrastructure:**
- Docker & Docker Compose
- GitHub Actions CI/CD
- Kubernetes-ready manifests

## 📁 Project Structure

```
/socialdesk
├─ /docs                    # Documentation
├─ /frontend                # Next.js frontend
│  ├─ /pages               # Next.js pages
│  ├─ /components          # React components
│  ├─ /styles              # CSS and Tailwind
│  └─ /utils               # Helper utilities
├─ /backend                 # Fastify backend
│  ├─ /src
│  │  ├─ /routes           # API routes
│  │  ├─ /controllers      # Route controllers
│  │  ├─ /services         # Business logic
│  │  ├─ /models           # Data models
│  │  └─ /jobs             # Background workers
│  ├─ /migrations          # Database migrations
│  └─ /tests               # Backend tests
├─ /ai                      # AI/LLM orchestration
│  ├─ prompt_library.md    # Prompt templates
│  └─ /chains              # LLM chains
├─ /infra                   # Infrastructure configs
│  ├─ docker-compose.yml
│  ├─ Dockerfile.frontend
│  ├─ Dockerfile.backend
│  └─ /k8s                 # Kubernetes manifests
└─ /scripts                 # Utility scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Docker and Docker Compose
- PostgreSQL 14+ (or use Docker)
- Redis (or use Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/socialdesk.git
cd socialdesk
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:
- OpenAI API key
- Stripe keys
- Instagram app credentials
- Database connection strings

### 3. Start with Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Qdrant vector DB (port 6333)
- Backend API (port 4000)
- Frontend (port 3000)

### 4. Run Database Migrations

```bash
# Run migrations
cd backend
npm run migrate

# Seed test data
npm run seed
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **API Docs (Swagger):** http://localhost:4000/docs
- **Qdrant Dashboard:** http://localhost:6333/dashboard

### Manual Setup (Without Docker)

#### Backend

```bash
cd backend
npm install
npm run migrate
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:e2e        # Playwright E2E tests
```

## 📚 Documentation

- [Architecture Overview](docs/architecture.md)
- [API Reference](docs/api_reference.md)
- [Onboarding Guide](docs/onboarding.md)
- [OpenAPI Specification](openapi.yaml)

## 🔑 Environment Variables

See [`.env.example`](.env.example) for all required and optional environment variables.

Key variables:
- `OPENAI_API_KEY` - Your OpenAI API key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT signing
- `IG_APP_ID` / `IG_APP_SECRET` - Instagram API credentials

## 🛠️ Development

### Code Style

We use ESLint and Prettier for consistent code formatting:

```bash
npm run lint        # Check for issues
npm run format      # Auto-format code
```

### Database Migrations

Create a new migration:

```bash
cd backend
npm run migrate:create migration_name
```

Run migrations:

```bash
npm run migrate
```

Rollback:

```bash
npm run migrate:rollback
```

### Working with the AI Layer

The AI orchestration lives in `/ai`. To add new prompts:

1. Add templates to `ai/prompt_library.md`
2. Update `ai/llm_orchestration.js` with new functions
3. Call from backend controllers

## 📦 Deployment

### Docker Production Build

```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Kubernetes

```bash
cd infra/k8s
kubectl apply -f .
```

See [infra/README.md](infra/README.md) for detailed deployment instructions.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines (coming soon).

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Write tests
4. Submit a pull request

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 🔒 Security

- Report security vulnerabilities to security@socialdesk.com
- See [SECURITY.md](SECURITY.md) for our security policy

## 🆘 Support

- Documentation: https://docs.socialdesk.com
- Discord Community: https://discord.gg/socialdesk
- Email: support@socialdesk.com

## 🗺️ Roadmap

### MVP (Current)
- [x] User authentication
- [x] Instagram connection
- [x] AI caption/hook generator
- [x] Post composer & scheduler
- [x] Basic analytics
- [x] Creator marketplace
- [x] Stripe integration
- [x] Referral system
- [x] Gamification (streaks)

### v1.1 (Q1 2024)
- [ ] TikTok integration
- [ ] Advanced analytics & A/B testing
- [ ] Team collaboration features
- [ ] Mobile app (React Native)

### v1.2 (Q2 2024)
- [ ] YouTube integration
- [ ] Multi-account management
- [ ] Brand CRM
- [ ] Advanced AI personalization

## 🙏 Acknowledgments

Built with ❤️ for creators by creators.

Special thanks to:
- OpenAI for GPT-4 API
- The Next.js and Fastify communities
- All our beta testers and early users

---

**Made with 🚀 by the SocialDesk Team**
