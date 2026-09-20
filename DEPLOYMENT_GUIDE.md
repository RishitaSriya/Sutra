# 🚀 SUTRA — Full-Stack Deployment Guide

This guide details how to deploy both the **Frontend** (React + Vite) and **Backend** (FastAPI + SQLite/PostgreSQL + Gemini AI) so everything works seamlessly in production.

---

## 🌟 Quick Overview: Architecture in Production

- **Frontend**: Single Page Application (SPA) deployed on **Vercel** or **Netlify**.
- **Backend**: Python Web Service deployed on **Render**, **Railway**, or **Fly.io**.
- **AI Engine**: Google Gemini API configured via environment variable `GEMINI_API_KEY`.
- **Database**: `sutra.db` (auto-seeded SQLite) or managed PostgreSQL via `DATABASE_URL`.

---

## ⚡ Option 1: Deploy Backend on Render + Frontend on Vercel (Recommended & 100% Free)

### Step 1: Deploy the Backend (Render)

1. Push this repository to **GitHub**.
2. Go to **[render.com](https://dashboard.render.com)** and sign in.
3. Click **"New +"** &rarr; **"Web Service"**.
4. Connect your GitHub repository.
5. Configure the service settings:
   - **Name**: `sutra-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Paste your Google AI Studio Gemini API key)*
   - `JWT_SECRET`: (e.g. `sutra_production_secret_key_2026`)
7. Click **"Deploy Web Service"**.
8. Once deployed, copy your Render backend URL (e.g., `https://sutra-backend.onrender.com`).

---

### Step 2: Deploy the Frontend (Vercel)

1. Go to **[vercel.com](https://vercel.com)** and sign in.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://sutra-backend.onrender.com/api` *(replace with your actual Render URL from Step 1)*
6. Click **"Deploy"**.
7. In ~40 seconds, your site will be live at `https://your-sutra-app.vercel.app`!

---

## 📦 Option 2: 1-Click Full Stack Blueprint (Render)

We have included a complete `render.yaml` file in the root directory.

1. In Render, click **"New +"** &rarr; **"Blueprint"**.
2. Connect your GitHub repository.
3. Render will read `render.yaml` and automatically provision both the **FastAPI Web Service** and the **Vite Static Site** with the environment variables connected!

---

## 🐳 Option 3: Dockerized Deployment (Single Command)

If you have a VPS (DigitalOcean, AWS EC2, Linode, GCP) or use Docker:

```bash
# 1. Clone repository
git clone <your-repo-url>
cd <repo-name>

# 2. Build and start full stack in background
docker compose up -d --build
```

- Frontend will be live on `http://YOUR_SERVER_IP:5173` (or port 80 via NGINX).
- Backend will be live on `http://YOUR_SERVER_IP:8000`.

---

## 🔑 Environment Variables Reference

| Variable Name | Layer | Purpose | Sample Production Value |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Frontend | Connects frontend client to backend | `https://sutra-backend.onrender.com/api` |
| `GEMINI_API_KEY` | Backend | Powers Socratic Mentor & Mock Interviewer | `YOUR_GEMINI_API_KEY` |
| `JWT_SECRET` | Backend | Signs student auth tokens | Any secure 32+ character random string |
| `DATABASE_URL` | Backend | Database connection string (Optional) | `sqlite:///sutra.db` or `postgresql://user:pass@host/db` |

---

## ✅ Post-Deployment Verification Checklist

Once deployed:
1. Open your frontend URL (`https://your-app.vercel.app`).
2. Click **"🚀 Demo: Aarav"** or **"⚡ Demo: Ananya"** &rarr; confirm instant login and dashboard load.
3. Open **"🎯 Mock Interview"** in the top bar &rarr; select **Razorpay** &rarr; verify live Gemini response.
4. Open **"Weekly Boss Battles"** &rarr; click **"Run in Sandbox"** &rarr; verify live Python / JS execution.
