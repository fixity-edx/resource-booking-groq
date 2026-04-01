# Smart Resource Booking System ✅
Groq AI + JWT Auth + RBAC + Calendar Scheduling UI

✅ React (Vite) + TailwindCSS (Calendar-based scheduling UI + futuristic dashboard style)  
✅ Node.js + Express + MongoDB Atlas  
✅ AI: Groq suggests optimal booking slots based on historical usage trends  
✅ Security: JWT, bcrypt, RBAC, validation, sanitization, Helmet, rate-limit, optional CSRF  
✅ Optional emails via Resend free tier

---

## Folder Structure
```
resource-booking-groq-rbac/
  frontend/
  backend/
  README.md
```

---

# Features

## User
- View resources
- Request booking slots
- See AI suggested optimal slots

## Admin
- Add resources
- Approve / Cancel bookings
- AI suggestions auto updated on changes

---

# 1) Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```

Backend: `http://localhost:5000`

Fill `.env`:
- `MONGODB_URI`
- `JWT_SECRET`
- `GROQ_API_KEY`

---

# 2) Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`

---

# RBAC - Create Admin
All signups are created as `role=user`.

Make admin:
MongoDB Atlas → `users` collection → change role:
```json
"role": "admin"
```

Login again → admin features enabled.

---

# Groq AI Setup
From console.groq.com:
```
GROQ_API_KEY=...
GROQ_MODEL=llama-3.1-8b-instant
```

---

# Deployment (Free Tier)

## Backend → Render
- Root: `backend`
- Build: `npm install`
- Start: `npm start`

## Frontend → Vercel
- Root: `frontend`
- Env var:
```
VITE_API_BASE_URL=https://<render-backend-url>
```

---

# Security Notes (Viva)
- bcrypt hashing
- JWT + token expiry
- logout invalidation (blacklist TTL)
- helmet security headers
- rate limiter
- validation + sanitization
- optional CSRF (`ENABLE_CSRF=1`)
- HTTPS-ready

---

## Author
Final Year BTech Mini Project - Smart Resource Booking System
