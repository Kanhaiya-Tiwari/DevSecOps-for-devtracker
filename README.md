# DevTrackr

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/PostgreSQL_16-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis_7-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/k3s-FF63AC?style=for-the-badge&logo=kubernetes&logoColor=white" />
  <img src="https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/Ansible-EE0000?style=for-the-badge&logo=ansible&logoColor=white" />
  <img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" />
  <img src="https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white" />
</p>

**Intelligent Skill Execution System** — Track skills, log practice sessions, earn XP, maintain streaks, get AI coaching, and visualize your learning journey.

DevTrackr is a full-stack application with an AI-powered coaching engine, gamification system, and a complete DevOps pipeline deploying to AWS EC2 with k3s, Ansible, Prometheus + Grafana monitoring.

---

## Features

- **Skill Tracking** — Create skills with target hours, deadlines, difficulty levels, and phases
- **Session Logging** — Log practice sessions with hours, quality rating, and notes
- **Date-wise History** — Browse what you studied on any specific date
- **Progress Visualization** — Charts, heatmaps, weekly/monthly trends, consistency scores

### AI Engine (OpenRouter)

- **AI Chat Coach** — Conversational AI for learning tips and guidance
- **Daily Tips** — Auto-generated motivational and strategic tips
- **Skill Suggestions** — AI recommends what to learn next
- **AI Insights** — Per-skill analysis with behavioral pattern detection
- **Skill Planner** — Weekly plan generation with intensity levels
- **Completion Predictor** — Probability estimation for meeting deadlines
- **Burnout Detection** — Behavioral engine flags overwork patterns

### Gamification

- **XP System** — Earn XP per session: `hours × 10 × streak_multiplier × quality_bonus`
- **Streak Tracking** — Daily streaks with 7-day (1.5×), 14-day (2×), 30-day (3×) multipliers
- **Leveling** — Level up based on accumulated XP (sqrt curve)
- **Leaderboard** — Ranked by XP, level, streak, and longest streak
- **XP Audit Log** — Full history of every XP transaction

### Profile & Analytics

- **User Settings** — Avatar, bio, location, GitHub URL, public/private toggle
- **Analytics Dashboard** — Peak hours, consistency score, study patterns

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · Vite 5 · Tailwind CSS 4 |
| Backend | FastAPI · SQLAlchemy Async · Pydantic v2 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| AI | OpenRouter API · nvidia/nemotron-nano-9b-v2:free |
| Auth | JWT (python-jose · passlib/bcrypt) |
| Containers | Docker · Docker Compose |
| Orchestration | k3s (lightweight Kubernetes) |
| Infrastructure | Terraform — AWS EC2, VPC, Security Groups |
| Deployment | Ansible — Automated setup & deployment |
| Monitoring | Prometheus · Grafana (20-panel dashboard) |
| Security Scans | Trivy · Gitleaks · Snyk · Docker Scout · tfsec · Bandit |

---

## Project Structure

```
devtrackr/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app entry
│   │   ├── config.py               # Pydantic settings
│   │   ├── database.py             # SQLAlchemy async engine
│   │   ├── dependencies.py         # Auth & DB deps
│   │   ├── agent/                  # AI engine
│   │   │   ├── agent.py            #   Reasoning engine (OpenRouter)
│   │   │   ├── behavioral.py       #   Consistency + burnout detection
│   │   │   ├── coach.py            #   Coaching response builder
│   │   │   ├── memory.py           #   Context from user data
│   │   │   ├── planner.py          #   Weekly plan generator
│   │   │   └── predictor.py        #   Completion probability
│   │   ├── models/                 # SQLAlchemy models
│   │   │   ├── user.py             #   User: xp, level, streak, profile
│   │   │   ├── skill.py            #   Skill: hours, phases, roadmap
│   │   │   ├── log.py              #   Session logs
│   │   │   ├── insight.py          #   AI-generated insights
│   │   │   └── xp.py              #   XP audit log
│   │   ├── routers/                # API endpoints
│   │   │   ├── auth.py             #   Register, login, me
│   │   │   ├── skills.py           #   CRUD skills
│   │   │   ├── logs.py             #   Session logging + XP/streak
│   │   │   ├── chat.py             #   AI chat, tips, suggestions
│   │   │   ├── insights.py         #   AI skill analysis
│   │   │   ├── analytics.py        #   User analytics
│   │   │   ├── leaderboard.py      #   XP rankings
│   │   │   └── settings.py         #   Profile management
│   │   ├── schemas/                # Pydantic request/response
│   │   ├── repositories/           # Database query layer
│   │   └── services/
│   │       ├── gamification.py     #   XP calculation + leveling
│   │       ├── streak_service.py   #   Streak calculation
│   │       ├── auth_service.py     #   JWT + password hashing
│   │       ├── skill_service.py    #   Skill operations
│   │       └── progress_engine.py  #   Progress tracking
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx / AppShell.jsx
│   │   ├── components/
│   │   │   ├── Navbar, Sidebar, SkillCard, StatCard
│   │   │   ├── ChartCard, HeatmapGrid, ProgressBar
│   │   │   ├── StudyTimer, AIInsightCard
│   │   │   └── SkillHistoryPanel
│   │   ├── pages/
│   │   │   ├── DashboardPage       # Main hub
│   │   │   ├── SkillDetailPage     # Skill detail + date history
│   │   │   ├── AIChatPage          # AI chat interface
│   │   │   ├── AnalyticsPage       # Charts & trends
│   │   │   ├── LeaderboardPage     # XP rankings
│   │   │   ├── SettingsPage        # Profile settings
│   │   │   ├── LoginPage
│   │   │   └── RegisterPage
│   │   ├── hooks/
│   │   ├── services/api.js
│   │   └── utils/
│   ├── Dockerfile                   # Dev (Node 20)
│   ├── Dockerfile.prod              # Production (multi-stage + nginx)
│   ├── nginx.conf
│   └── package.json
├── infra/
│   ├── docker-compose.yml
│   ├── .env
│   ├── kubernetes/
│   │   ├── namespace.yml
│   │   ├── configmap.yml
│   │   ├── secrets.yml
│   │   ├── backend-deployment.yml
│   │   ├── backend-service.yml
│   │   ├── frontend-deployment.yml
│   │   ├── frontend-service.yml
│   │   ├── postgres-statefulset.yml
│   │   ├── postgres-service.yml
│   │   ├── redis-statefulset.yml
│   │   ├── redis-service.yml
│   │   ├── nginx-configmap.yml
│   │   ├── ingress-domain.yml
│   │   ├── pv.yml                 # Optional for k3s
│   │   └── pvc.yml                # Optional for k3s
│   ├── terraform/
│   │   ├── EC2/
│   │   │   ├── main.tf           # AWS VPC, EC2, Security Groups
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   └── userdata.sh       # EC2 bootstrap script
│   │   └── backend_lock/
│   │       ├── main.tf           # S3 bucket + DynamoDB for state
│   │       └── terraform.tfstate
│   ├── ansible/
│   │   └── playbook-ec2.yml      # Automated deployment playbook
│   ├── scripts/
│   
│   └── monitoring/
│       ├── namespace.yaml
│       ├── prometheus/
│       │   ├── config.yaml       # Scrape configs + alerts
│       │   ├── deployment.yaml   # Prometheus + RBAC
│       │   └── exporters.yaml    # kube-state-metrics + node-exporter
│       └── grafana/
│           ├── deployment.yaml
│           ├── secret.yaml
│           └── dashboards-configmap.yaml  # 20-panel dashboard
```

---

## Quick Start (Docker Compose)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Run
[devtracker_architecture_diagram.docx](https://github.com/user-attachments/files/26961194/devtracker_architecture_diagram.docx)

```bash
cd infra
docker compose up --build -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

### Stop

```bash
cd infra
docker compose down        # Keep data
docker compose down -v     # Delete everything
```

### Logs

```bash
docker compose logs -f             # All services
docker compose logs -f backend     # Backend only
```

### Rebuild Single Service

```bash
docker compose up --build -d backend
```

---

## Local Dev (Without Docker)

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

export DATABASE_URL=postgresql+asyncpg://devtrackr:devtrackr@localhost:5432/devtrackr
export REDIS_URL=redis://localhost:6379/0
export JWT_SECRET=devtrackr_secret
export OPENROUTER_API_KEY=your_key_here

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Tests

```bash
cd backend && pytest tests/ -v
```

---

## Environment Variables

| Variable | Required | Description |
|----------|:--------:|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL async connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `OPENROUTER_API_KEY` | ✅ | OpenRouter API key for AI features |
| `OPENROUTER_MODEL` | — | AI model (default: `nvidia/nemotron-nano-9b-v2:free`) |
| `POSTGRES_PASSWORD` | ✅ | PostgreSQL password (Docker Compose) |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/token` | Login → JWT |
| `GET` | `/auth/me` | Current user |

### Skills

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/skills/` | List all skills |
| `POST` | `/skills/` | Create skill |
| `GET` | `/skills/{id}` | Skill details |
| `PATCH` | `/skills/{id}` | Update skill |

### Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/logs/` | Log session → auto XP + streak update |
| `GET` | `/logs/skill/{id}` | All logs for a skill |
| `GET` | `/logs/skill/{id}/dates` | Distinct log dates |
| `GET` | `/logs/skill/{id}/by-date?d=YYYY-MM-DD` | Logs by specific date |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat/` | Chat with AI coach |
| `POST` | `/chat/daily-tip` | Get daily tip |
| `POST` | `/chat/skill-suggestions` | Get AI skill recommendations |
| `GET` | `/insights/{skill_id}` | AI-generated skill analysis |

### Analytics & Social

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analytics/overview` | User stats & patterns |
| `GET` | `/leaderboard/` | XP rankings |
| `GET` | `/settings/` | Get profile settings |
| `PUT` | `/settings/` | Update profile |

Full interactive docs: http://localhost:8000/docs

---

## AWS Infrastructure (Terraform)

Provisions AWS EC2 instance with k3s for production deployment:

| Resource | Details |
|----------|---------|
| VPC | 10.0.0.0/16 CIDR block |
| Subnet | 10.0.1.0/24, public with internet gateway |
| EC2 Instance | Ubuntu with k3s pre-installed via userdata |
| Security Group | Ports: 22 (SSH), 80 (HTTP), 3000 (Frontend), 8000 (Backend), 5432 (PostgreSQL), 6379 (Redis) |
| S3 Backend | Remote state with DynamoDB locking |

### First-Time Setup (Backend State)

```bash
cd infra/terraform/backend_lock
terraform init
terraform apply
```

This creates:
- S3 bucket for Terraform state
- DynamoDB table for state locking

### Deploy EC2 Instance

```bash
cd infra/terraform/EC2
terraform init
terraform plan
terraform apply
```

**Required Terraform Variables:**
- `instance_type` - EC2 instance type (default: t3.medium)
- `key_name` - AWS key pair name for SSH access


---

## Deployment (Ansible + k3s)

The EC2 instance automatically runs the Ansible playbook via userdata script. The playbook handles:

### Automated Deployment Flow

1. **System Setup** - Update packages, install dependencies
2. **k3s Installation** - Lightweight Kubernetes with TLS SAN for public IP
3. **kubectl & Helm** - Install Kubernetes tools
4. **NGINX Ingress** - Install ingress controller
5. **Application Deploy** - Apply all Kubernetes manifests
6. **Monitoring Stack** - Deploy Prometheus & Grafana

### Manual Deployment (if needed)

If you need to manually deploy after SSH into EC2:

```bash
cd /home/ubuntu/DevTracker-mega-project/infra/ansible
ansible-playbook playbook-ec2.yml
```

### Kubernetes Namespace

All resources are deployed in the `devtracker` namespace.

### Key Features

| Feature | Details |
|---------|---------|
| Replicas | Backend: 2 · Frontend: 2 |
| Rolling Updates | Zero-downtime deployments |
| Health Checks | Liveness + readiness probes on all services |
| StatefulSet | PostgreSQL with 10Gi persistent volume (dynamic provisioning) |
| Redis | StatefulSet with 2Gi persistent volume |
| Ingress | Domain-based routing via NGINX Ingress Controller |

---

## Monitoring (Prometheus + Grafana)

### Prometheus

Scrapes metrics from:

- **DevTrackr Backend** — FastAPI request/response metrics (namespace: devtracker)
- **DevTrackr Frontend** — Nginx status (namespace: devtracker)
- **Node Exporter** — Host CPU, memory, disk
- **kube-state-metrics** — Pod, deployment, HPA states
- **cAdvisor** — Container resource usage

**Alert Rules:** BackendDown · HighErrorRate (>5%) · HighLatency (P95 >2s) · PodCrashLooping · HighMemory (>90%) · HighCPU (>80%) · PostgresDown · RedisDown

<style>
@keyframes flowRight { 0%{stroke-dashoffset:40} 100%{stroke-dashoffset:0} }
@keyframes flowDown { 0%{stroke-dashoffset:40} 100%{stroke-dashoffset:0} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
@keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-3px)} }
.flow-h { stroke-dasharray:8 4; animation: flowRight 1.2s linear infinite; }
.flow-v { stroke-dasharray:8 4; animation: flowDown 1.2s linear infinite; }
.flow-h2 { stroke-dasharray:8 4; animation: flowRight 1.6s linear infinite; }
.flow-v2 { stroke-dasharray:8 4; animation: flowDown 1.8s linear infinite; }
.flow-h3 { stroke-dasharray:8 4; animation: flowRight 2s linear infinite; }
.node-g:hover { filter: brightness(1.1); cursor: pointer; }
.phase-label { font-family: var(--font-sans); font-size: 11px; font-weight: 500; letter-spacing: 0.5px; }
</style>

<svg width="100%" viewBox="0 0 900 1100" role="img" xmlns="http://www.w3.org/2000/svg">
<title>DevTracker Full Architecture Diagram</title>
<desc>Complete DevTracker project architecture showing Coding, Infrastructure, Deployment, GitOps, and Monitoring phases with animated data flow arrows</desc>
<defs>
<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
  <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
<filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
  <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.12)"/>
</filter>
</defs>

<!-- ═══════════════════════════════════════════════ PHASE BANNERS ═══ -->
<!-- CODING phase -->
<rect x="20" y="20" width="860" height="200" rx="16" fill="none" stroke="#534AB7" stroke-width="1" stroke-dasharray="6 3" opacity="0.5"/>
<text class="phase-label" x="38" y="42" fill="#534AB7">CODING PHASE</text>

<!-- INFRASTRUCTURE phase -->
<rect x="20" y="240" width="860" height="200" rx="16" fill="none" stroke="#0F6E56" stroke-width="1" stroke-dasharray="6 3" opacity="0.5"/>
<text class="phase-label" x="38" y="262" fill="#0F6E56">INFRASTRUCTURE PHASE</text>

<!-- DEPLOYMENT phase -->
<rect x="20" y="460" width="860" height="200" rx="16" fill="none" stroke="#993C1D" stroke-width="1" stroke-dasharray="6 3" opacity="0.5"/>
<text class="phase-label" x="38" y="482" fill="#993C1D">DEPLOYMENT PHASE</text>

<!-- GITOPS phase -->
<rect x="20" y="680" width="860" height="180" rx="16" fill="none" stroke="#185FA5" stroke-width="1" stroke-dasharray="6 3" opacity="0.5"/>
<text class="phase-label" x="38" y="702" fill="#185FA5">GITOPS PHASE</text>

<!-- MONITORING phase -->
<rect x="20" y="880" width="860" height="200" rx="16" fill="none" stroke="#BA7517" stroke-width="1" stroke-dasharray="6 3" opacity="0.5"/>
<text class="phase-label" x="38" y="902" fill="#BA7517">MONITORING PHASE</text>

<!-- ═══════════════════════════════════════════════ CODING NODES ═══ -->
<!-- Python / FastAPI -->
<g class="node-g" filter="url(#shadow)">
  <rect x="55" y="55" width="120" height="100" rx="12" fill="#EEEDFE" stroke="#534AB7" stroke-width="1.5"/>
  <rect x="55" y="55" width="120" height="8" rx="12" fill="#534AB7"/>
  <rect x="55" y="59" width="120" height="4" fill="#534AB7"/>
  <text x="115" y="90" text-anchor="middle" font-family="var(--font-sans)" font-size="28" fill="#4B3CA7">🐍</text>
  <text x="115" y="118" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#3C3489">Python</text>
  <text x="115" y="133" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#534AB7">FastAPI</text>
</g>

<!-- React -->
<g class="node-g" filter="url(#shadow)">
  <rect x="235" y="55" width="120" height="100" rx="12" fill="#E6F1FB" stroke="#185FA5" stroke-width="1.5"/>
  <rect x="235" y="55" width="120" height="8" rx="12" fill="#185FA5"/>
  <rect x="235" y="59" width="120" height="4" fill="#185FA5"/>
  <text x="295" y="90" text-anchor="middle" font-family="var(--font-sans)" font-size="28" fill="#185FA5">⚛</text>
  <text x="295" y="118" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#0C447C">React</text>
  <text x="295" y="133" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#185FA5">Frontend UI</text>
</g>

<!-- Docker -->
<g class="node-g" filter="url(#shadow)">
  <rect x="415" y="55" width="120" height="100" rx="12" fill="#E6F1FB" stroke="#378ADD" stroke-width="1.5"/>
  <rect x="415" y="55" width="120" height="8" rx="12" fill="#378ADD"/>
  <rect x="415" y="59" width="120" height="4" fill="#378ADD"/>
  <text x="475" y="90" text-anchor="middle" font-family="var(--font-sans)" font-size="28">🐳</text>
  <text x="475" y="118" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#0C447C">Docker</text>
  <text x="475" y="133" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#185FA5">Containerization</text>
</g>

<!-- GitHub -->
<g class="node-g" filter="url(#shadow)">
  <rect x="595" y="55" width="120" height="100" rx="12" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.5"/>
  <rect x="595" y="55" width="120" height="8" rx="12" fill="#5F5E5A"/>
  <rect x="595" y="59" width="120" height="4" fill="#5F5E5A"/>
  <text x="655" y="90" text-anchor="middle" font-family="var(--font-sans)" font-size="28">🐙</text>
  <text x="655" y="118" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#2C2C2A">GitHub</text>
  <text x="655" y="133" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#5F5E5A">Code Repository</text>
</g>

<!-- Animated arrows: Python→React, React→Docker, Docker→GitHub -->
<line x1="175" y1="105" x2="233" y2="105" class="flow-h" stroke="#534AB7" stroke-width="2" marker-end="url(#arrow)"/>
<line x1="355" y1="105" x2="413" y2="105" class="flow-h" stroke="#185FA5" stroke-width="2" marker-end="url(#arrow)"/>
<line x1="535" y1="105" x2="593" y2="105" class="flow-h" stroke="#378ADD" stroke-width="2" marker-end="url(#arrow)"/>

<!-- Arrow labels -->
<rect x="176" y="90" width="56" height="16" rx="4" fill="white" opacity="0.85"/>
<text x="204" y="101" text-anchor="middle" font-family="var(--font-sans)" font-size="9" fill="#534AB7">backend</text>
<rect x="356" y="90" width="56" height="16" rx="4" fill="white" opacity="0.85"/>
<text x="384" y="101" text-anchor="middle" font-family="var(--font-sans)" font-size="9" fill="#185FA5">build image</text>
<rect x="536" y="90" width="56" height="16" rx="4" fill="white" opacity="0.85"/>
<text x="564" y="101" text-anchor="middle" font-family="var(--font-sans)" font-size="9" fill="#378ADD">push code</text>

<!-- ═══════════════════════════════════════════ INFRASTRUCTURE NODES ═══ -->
<!-- Terraform -->
<g class="node-g" filter="url(#shadow)">
  <rect x="55" y="275" width="120" height="100" rx="12" fill="#EAF3DE" stroke="#3B6D11" stroke-width="1.5"/>
  <rect x="55" y="275" width="120" height="8" rx="12" fill="#3B6D11"/>
  <rect x="55" y="279" width="120" height="4" fill="#3B6D11"/>
  <text x="115" y="310" text-anchor="middle" font-family="var(--font-sans)" font-size="28">🏗️</text>
  <text x="115" y="338" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#27500A">Terraform</text>
  <text x="115" y="353" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#3B6D11">AWS EC2</text>
</g>

<!-- k3s -->
<g class="node-g" filter="url(#shadow)">
  <rect x="235" y="275" width="120" height="100" rx="12" fill="#E6F1FB" stroke="#185FA5" stroke-width="1.5"/>
  <rect x="235" y="275" width="120" height="8" rx="12" fill="#185FA5"/>
  <rect x="235" y="279" width="120" height="4" fill="#185FA5"/>
  <text x="295" y="310" text-anchor="middle" font-family="var(--font-sans)" font-size="24" fill="#185FA5">☸️</text>
  <text x="295" y="338" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#0C447C">k3s</text>
  <text x="295" y="353" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#185FA5">Lightweight K8s</text>
</g>

<!-- Kubernetes -->
<g class="node-g" filter="url(#shadow)">
  <rect x="415" y="275" width="120" height="100" rx="12" fill="#E6F1FB" stroke="#378ADD" stroke-width="1.5"/>
  <rect x="415" y="275" width="120" height="8" rx="12" fill="#378ADD"/>
  <rect x="415" y="279" width="120" height="4" fill="#378ADD"/>
  <text x="475" y="310" text-anchor="middle" font-family="var(--font-sans)" font-size="24" fill="#185FA5">☸️</text>
  <text x="475" y="338" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#0C447C">Kubernetes</text>
  <text x="475" y="353" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#185FA5">Orchestration</text>
</g>

<!-- Infra arrows -->
<line x1="175" y1="325" x2="233" y2="325" class="flow-h2" stroke="#3B6D11" stroke-width="2" marker-end="url(#arrow)"/>
<line x1="355" y1="325" x2="413" y2="325" class="flow-h2" stroke="#185FA5" stroke-width="2" marker-end="url(#arrow)"/>

<rect x="176" y="310" width="56" height="16" rx="4" fill="white" opacity="0.85"/>
<text x="204" y="321" text-anchor="middle" font-family="var(--font-sans)" font-size="9" fill="#3B6D11">provision</text>
<rect x="356" y="310" width="56" height="16" rx="4" fill="white" opacity="0.85"/>
<text x="384" y="321" text-anchor="middle" font-family="var(--font-sans)" font-size="9" fill="#185FA5">runs on</text>

<!-- ═══════════════════════════════════════════ DEPLOYMENT NODES ═══ -->
<!-- Ansible -->
<g class="node-g" filter="url(#shadow)">
  <rect x="55" y="495" width="120" height="100" rx="12" fill="#FCEBEB" stroke="#A32D2D" stroke-width="1.5"/>
  <rect x="55" y="495" width="120" height="8" rx="12" fill="#A32D2D"/>
  <rect x="55" y="499" width="120" height="4" fill="#A32D2D"/>
  <text x="115" y="530" text-anchor="middle" font-family="var(--font-sans)" font-size="28">⚙️</text>
  <text x="115" y="558" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#791F1F">Ansible</text>
  <text x="115" y="573" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#A32D2D">Auto Deploy</text>
</g>

<!-- Arrow label box group for data flow 1 -->
<g>
  <rect x="400" y="138" width="200" height="80" rx="10" fill="#FAEEDA" stroke="#EF9F27" stroke-width="1"/>
  <text x="500" y="160" text-anchor="middle" font-family="var(--font-sans)" font-size="11" font-weight="500" fill="#633806">Data Flow 1</text>
  <text x="500" y="178" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#854F0B">Code → Docker Images</text>
  <text x="500" y="193" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#854F0B">→ Ansible → k3s/K8s</text>
</g>

<!-- Ansible → k3s vertical arrow -->
<line x1="295" y1="375" x2="295" y2="493" class="flow-v" stroke="#3B6D11" stroke-width="2" marker-end="url(#arrow)"/>
<rect x="270" y="415" width="50" height="16" rx="4" fill="white" opacity="0.85"/>
<text x="295" y="426" text-anchor="middle" font-family="var(--font-sans)" font-size="9" fill="#3B6D11">deploy</text>

<!-- Ansible → k3s horiz -->
<line x1="175" y1="545" x2="233" y2="545" class="flow-h3" stroke="#A32D2D" stroke-width="2" marker-end="url(#arrow)"/>
<rect x="176" y="530" width="56" height="16" rx="4" fill="white" opacity="0.85"/>
<text x="204" y="541" text-anchor="middle" font-family="var(--font-sans)" font-size="9" fill="#A32D2D">configure</text>

<!-- k3s deploy box in deploy phase -->
<g class="node-g" filter="url(#shadow)">
  <rect x="235" y="495" width="120" height="100" rx="12" fill="#E6F1FB" stroke="#185FA5" stroke-width="1.5"/>
  <rect x="235" y="495" width="120" height="8" rx="12" fill="#185FA5"/>
  <rect x="235" y="499" width="120" height="4" fill="#185FA5"/>
  <text x="295" y="530" text-anchor="middle" font-family="var(--font-sans)" font-size="24">☸️</text>
  <text x="295" y="558" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#0C447C">k3s Cluster</text>
  <text x="295" y="573" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#185FA5">Running Pods</text>
</g>

<!-- ═══════════════════════════════════════════════ GITOPS NODES ═══ -->
<!-- GitHub in GitOps phase -->
<g class="node-g" filter="url(#shadow)">
  <rect x="55" y="715" width="120" height="100" rx="12" fill="#F1EFE8" stroke="#5F5E5A" stroke-width="1.5"/>
  <rect x="55" y="715" width="120" height="8" rx="12" fill="#5F5E5A"/>
  <rect x="55" y="719" width="120" height="4" fill="#5F5E5A"/>
  <text x="115" y="751" text-anchor="middle" font-family="var(--font-sans)" font-size="28">🐙</text>
  <text x="115" y="779" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#2C2C2A">GitHub</text>
  <text x="115" y="794" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#5F5E5A">Source of Truth</text>
</g>

<!-- ArgoCD -->
<g class="node-g" filter="url(#shadow)">
  <rect x="295" y="715" width="120" height="100" rx="12" fill="#FBEAF0" stroke="#993556" stroke-width="1.5"/>
  <rect x="295" y="715" width="120" height="8" rx="12" fill="#993556"/>
  <rect x="295" y="719" width="120" height="4" fill="#993556"/>
  <text x="355" y="751" text-anchor="middle" font-family="var(--font-sans)" font-size="26">🔄</text>
  <text x="355" y="779" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#72243E">ArgoCD</text>
  <text x="355" y="794" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#993556">Continuous Delivery</text>
</g>

<!-- k3s in GitOps -->
<g class="node-g" filter="url(#shadow)">
  <rect x="535" y="715" width="120" height="100" rx="12" fill="#E6F1FB" stroke="#185FA5" stroke-width="1.5"/>
  <rect x="535" y="715" width="120" height="8" rx="12" fill="#185FA5"/>
  <rect x="535" y="719" width="120" height="4" fill="#185FA5"/>
  <text x="595" y="751" text-anchor="middle" font-family="var(--font-sans)" font-size="24">☸️</text>
  <text x="595" y="779" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#0C447C">k3s Cluster</text>
  <text x="595" y="794" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#185FA5">Synced State</text>
</g>

<!-- GitOps arrows -->
<line x1="175" y1="765" x2="293" y2="765" class="flow-h" stroke="#5F5E5A" stroke-width="2" marker-end="url(#arrow)"/>
<line x1="415" y1="765" x2="533" y2="765" class="flow-h" stroke="#993556" stroke-width="2" marker-end="url(#arrow)"/>

<rect x="184" y="750" width="48" height="16" rx="4" fill="white" opacity="0.85"/>
<text x="208" y="761" text-anchor="middle" font-family="var(--font-sans)" font-size="9" fill="#5F5E5A">watches</text>
<rect x="424" y="750" width="48" height="16" rx="4" fill="white" opacity="0.85"/>
<text x="448" y="761" text-anchor="middle" font-family="var(--font-sans)" font-size="9" fill="#993556">syncs</text>

<!-- Data Flow 2 badge -->
<g>
  <rect x="660" y="700" width="210" height="68" rx="10" fill="#E6F1FB" stroke="#185FA5" stroke-width="1"/>
  <text x="765" y="720" text-anchor="middle" font-family="var(--font-sans)" font-size="11" font-weight="500" fill="#0C447C">Data Flow 2</text>
  <text x="765" y="738" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#185FA5">GitHub → ArgoCD</text>
  <text x="765" y="753" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#185FA5">→ Sync → k3s Cluster</text>
</g>

<!-- ═══════════════════════════════════════════ MONITORING NODES ═══ -->
<!-- Apps -->
<g class="node-g" filter="url(#shadow)">
  <rect x="55" y="915" width="110" height="100" rx="12" fill="#EAF3DE" stroke="#3B6D11" stroke-width="1.5"/>
  <rect x="55" y="915" width="110" height="8" rx="12" fill="#3B6D11"/>
  <rect x="55" y="919" width="110" height="4" fill="#3B6D11"/>
  <text x="110" y="950" text-anchor="middle" font-family="var(--font-sans)" font-size="24">📦</text>
  <text x="110" y="978" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#27500A">Applications</text>
  <text x="110" y="993" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#3B6D11">/metrics</text>
</g>

<!-- Node Exporter -->
<g class="node-g" filter="url(#shadow)">
  <rect x="185" y="915" width="110" height="100" rx="12" fill="#FAEEDA" stroke="#EF9F27" stroke-width="1.5"/>
  <rect x="185" y="915" width="110" height="8" rx="12" fill="#EF9F27"/>
  <rect x="185" y="919" width="110" height="4" fill="#EF9F27"/>
  <text x="240" y="950" text-anchor="middle" font-family="var(--font-sans)" font-size="22">📊</text>
  <text x="240" y="978" text-anchor="middle" font-family="var(--font-sans)" font-size="11" font-weight="500" fill="#412402">Node Exporter</text>
  <text x="240" y="993" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#633806">System Metrics</text>
</g>

<!-- kube-state-metrics -->
<g class="node-g" filter="url(#shadow)">
  <rect x="315" y="915" width="130" height="100" rx="12" fill="#E6F1FB" stroke="#185FA5" stroke-width="1.5"/>
  <rect x="315" y="915" width="130" height="8" rx="12" fill="#185FA5"/>
  <rect x="315" y="919" width="130" height="4" fill="#185FA5"/>
  <text x="380" y="950" text-anchor="middle" font-family="var(--font-sans)" font-size="22">🔢</text>
  <text x="380" y="973" text-anchor="middle" font-family="var(--font-sans)" font-size="10" font-weight="500" fill="#0C447C">kube-state</text>
  <text x="380" y="986" text-anchor="middle" font-family="var(--font-sans)" font-size="10" font-weight="500" fill="#0C447C">-metrics</text>
  <text x="380" y="1001" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#185FA5">Cluster Metrics</text>
</g>

<!-- Prometheus -->
<g class="node-g" filter="url(#shadow)">
  <rect x="465" y="915" width="120" height="100" rx="12" fill="#FCEBEB" stroke="#A32D2D" stroke-width="1.5"/>
  <rect x="465" y="915" width="120" height="8" rx="12" fill="#A32D2D"/>
  <rect x="465" y="919" width="120" height="4" fill="#A32D2D"/>
  <text x="525" y="950" text-anchor="middle" font-family="var(--font-sans)" font-size="26">🔥</text>
  <text x="525" y="978" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#501313">Prometheus</text>
  <text x="525" y="993" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#A32D2D">Metrics Store</text>
</g>

<!-- Grafana -->
<g class="node-g" filter="url(#shadow)">
  <rect x="605" y="915" width="120" height="100" rx="12" fill="#FAEEDA" stroke="#BA7517" stroke-width="1.5"/>
  <rect x="605" y="915" width="120" height="8" rx="12" fill="#BA7517"/>
  <rect x="605" y="919" width="120" height="4" fill="#BA7517"/>
  <text x="665" y="950" text-anchor="middle" font-family="var(--font-sans)" font-size="26">📈</text>
  <text x="665" y="978" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="#412402">Grafana</text>
  <text x="665" y="993" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#633806">Dashboards</text>
</g>

<!-- Monitoring flow arrows -->
<line x1="165" y1="965" x2="183" y2="965" class="flow-h2" stroke="#3B6D11" stroke-width="2" marker-end="url(#arrow)"/>
<line x1="295" y1="965" x2="313" y2="965" class="flow-h2" stroke="#EF9F27" stroke-width="2" marker-end="url(#arrow)"/>
<line x1="445" y1="965" x2="463" y2="965" class="flow-h2" stroke="#185FA5" stroke-width="2" marker-end="url(#arrow)"/>
<line x1="585" y1="965" x2="603" y2="965" class="flow-h2" stroke="#A32D2D" stroke-width="2" marker-end="url(#arrow)"/>

<!-- Data Flow 3 badge -->
<g>
  <rect x="730" y="880" width="150" height="68" rx="10" fill="#FCEBEB" stroke="#A32D2D" stroke-width="1"/>
  <text x="805" y="900" text-anchor="middle" font-family="var(--font-sans)" font-size="11" font-weight="500" fill="#791F1F">Data Flow 3</text>
  <text x="805" y="918" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#A32D2D">Apps → /metrics</text>
  <text x="805" y="933" text-anchor="middle" font-family="var(--font-sans)" font-size="10" fill="#A32D2D">→ Prometheus → Grafana</text>
</g>

<!-- Cross-phase vertical connector: Coding→Infra (Docker→k3s) -->
<path d="M475 155 L475 220 Q475 240 455 240 L295 240 Q275 240 275 260" class="flow-v2" fill="none" stroke="#378ADD" stroke-width="1.5" marker-end="url(#arrow)"/>

<!-- Cross-phase connector: GitHub→ArgoCD from coding to gitops -->
<path d="M655 155 L655 680 Q655 700 635 700 L355 700 Q335 700 335 715" class="flow-v2" fill="none" stroke="#5F5E5A" stroke-width="1.5" marker-end="url(#arrow)" stroke-dasharray="6 4"/>

<!-- Docker images → Ansible flow -->
<path d="M475 375 L475 440 Q475 460 455 460 L115 460 Q95 460 95 495" class="flow-v" fill="none" stroke="#378ADD" stroke-width="1.5" marker-end="url(#arrow)"/>

</svg>

### Grafana Dashboard (20 Panels)

| Row | Panels |
|-----|--------|
| Health | Backend up/down · Frontend up/down · Pod count · Active alerts · Node count · Uptime % |
| Traffic | HTTP req/s by method · Error rate (4xx/5xx) |
| Latency | P50/P95/P99 response time · Requests by endpoint |
| Backend Resources | CPU · Memory · Pod restarts |
| Frontend Resources | CPU · Memory |
| Node Resources | Node CPU · Node memory · Node disk |
| Autoscaling | HPA desired vs current (backend + frontend) |

### Deploy Monitoring

Monitoring is automatically deployed by the Ansible playbook. Manual deployment:

```bash
kubectl apply -f infra/monitoring/namespace.yaml
kubectl apply -f infra/monitoring/prometheus/
kubectl apply -f infra/monitoring/grafana/
```

Access: Port-forward to access Grafana locally or configure ingress for domain access. Default login: `admin` / (set in `grafana-secret.yaml`)
