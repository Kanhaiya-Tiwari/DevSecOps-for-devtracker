# DevTrackr: Intelligent Skill Execution System

---

## Introduction

DevTrackr is a full-stack application designed to help developers track their skills, log learning hours, and gain AI-powered insights to accelerate their growth. Built with modern technologies and deployed on cloud infrastructure, DevTrackr provides a comprehensive platform for skill management and analytics.

---

## Features

### 🎯 Skill Tracking
- Add and manage multiple skills
- Track daily learning hours with quality ratings
- Visual progress tracking with detailed analytics

### 📊 Analytics Dashboard
- Overview of skill development progress
- Time-based analytics and trends
- Detailed logs and insights per skill

### 🤖 AI-Powered Insights
- AI chat integration for personalized learning advice
- Daily tips and skill suggestions
- Intelligent recommendations based on your learning patterns

### 🏆 Leaderboard
- Compete with other developers
- XP-based ranking system
- Category-based leaderboards (XP, skills, hours)

### 📝 Blog System
- Share your learning journey
- Create and manage blog posts
- Community engagement

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication
- User profile management

### 🎁 Rewards System
- Earn rewards for consistent learning
- Gamification elements to keep you motivated

---

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Client-side routing

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM with async support
- **PostgreSQL** - Database
- **Redis** - Caching
- **Pydantic** - Data validation

### DevOps & Deployment
- **Railway** - Backend, Database, Redis hosting
- **Vercel** - Frontend hosting
- **GitHub** - Version control
- **Docker** - Containerization
- **Prometheus** - Monitoring

---

## Architecture

### System Design
```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │         │   Backend   │         │  Database   │
│  (Vercel)   │◄────────│  (Railway)  │◄────────│ (PostgreSQL)│
│   React     │  HTTPS   │   FastAPI   │  Async  │             │
└─────────────┘         └─────────────┘         └─────────────┘
                                │
                                ▼
                         ┌─────────────┐
                         │    Redis    │
                         │  (Caching)  │
                         └─────────────┘
```

### API Endpoints
- `/api/v1/auth` - Authentication
- `/api/v1/skills` - Skill management
- `/api/v1/logs` - Learning logs
- `/api/v1/analytics` - Analytics data
- `/api/v1/insights` - AI insights
- `/api/v1/chat` - AI chat
- `/api/v1/leaderboard` - Leaderboard
- `/api/v1/blogs` - Blog posts
- `/api/v1/proof-of-work` - Proof of work uploads

---

## Deployment Journey

### Challenges Faced

1. **Platform Selection**
   - Initially tried Vercel for full-stack (limited for backend)
   - Moved to Render (free tier limitations)
   - Finally settled on Railway for backend + Vercel for frontend

2. **Database Configuration**
   - Fixed async driver issues (psycopg2 vs asyncpg)
   - Configured DATABASE_URL with proper asyncpg driver
   - Resolved SQLAlchemy async engine setup

3. **CORS Configuration**
   - Added Vercel domains to backend CORS allowlist
   - Configured wildcard domains for flexibility
   - Enabled credentials for authenticated requests

4. **Frontend Routing**
   - Added vercel.json for SPA routing
   - Fixed 404 errors on direct route access
   - Configured proper rewrites to index.html

5. **Environment Variables**
   - Set VITE_API_BASE_URL for frontend
   - Configured DATABASE_URL and REDIS_URL for backend
   - Managed secrets across platforms

### Final Architecture

- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway (FastAPI)
- **Database**: Railway PostgreSQL
- **Cache**: Railway Redis
- **Custom Domain**: devtrackr.buildwithkanha.shop

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- PostgreSQL
- Redis

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/Kanhaiya-Tiwari/DevSecOps-for-devtracker.git
cd DevTracker-mega-project
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Configure DATABASE_URL and REDIS_URL in .env
uvicorn app.main:app --reload
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Configure VITE_API_BASE_URL in .env
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced AI recommendations
- [ ] Integration with GitHub/GitLab
- [ ] Certificate generation
- [ ] Social sharing features
- [ ] Multi-language support
- [ ] Dark mode improvements

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Contact

- **GitHub**: [Kanhaiya-Tiwari](https://github.com/Kanhaiya-Tiwari)
- **Website**: [devtrackr.buildwithkanha.shop](https://devtrackr.buildwithkanha.shop)

---

## Acknowledgments

- FastAPI team for the amazing framework
- Vercel and Railway for excellent deployment platforms
- The open-source community for valuable tools and libraries

---

*Built with ❤️ by Kanhaiya Tiwari*
