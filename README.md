# To the Next Version (TTNV)

A time capsule web application where users write letters to their future selves, set unlock dates, and share their emotional journeys on a public wall.

**Live:** https://tothenextversion-xyjc.vercel.app

---

## Features

- **Write Time Capsules** - Create letters to your future self with title, message, age, mood, song, and hobby
- **Scheduled Unlocking** - Set an unlock date and receive email notifications when ready to open
- **Share & Connect** - Share opened capsules on the Emotional Wall anonymously or publicly
- **React with Hearts** - Like others' shared letters and see engagement
- **User Profile** - View your stats (capsules created, opened, hearts received) and edit profile
- **Onboarding Tour** - 10-step guided tour for new users (first login only)
- **Persistent Auth** - Stay logged in across page refreshes

---

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- React Router v6
- Context API (Auth, Tour)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication with bcryptjs
- Resend (Email notifications)
- node-cron (Scheduled email jobs)

**Deployment:**
- Frontend: Vercel
- Backend: Render

---

## Project Structure
tothenextversion/

├── frontend/

│   └── src/

│       ├── api/

│       │   └── index.ts (API utilities)

│       ├── components/

│       │   ├── Navbar.tsx

│       │   ├── NavIcons.tsx

│       │   ├── ProtectedRoute.tsx

│       │   ├── TourModal.tsx

│       │   └── WallCard.tsx

│       ├── context/

│       │   ├── AuthContext.tsx

│       │   └── TourContext.tsx

│       ├── pages/

│       │   ├── Landing.tsx

│       │   ├── Login.tsx

│       │   ├── Register.tsx

│       │   ├── Dashboard.tsx

│       │   ├── CreateCapsule.tsx

│       │   ├── OpenCapsule.tsx

│       │   ├── Wall.tsx

│       │   └── Profile.tsx

│       ├── styles/

│       │   ├── index.css

│       │   ├── Landing.css

│       │   ├── Login.css

│       │   ├── Dashboard.css

│       │   ├── CreateCapsule.css

│       │   ├── OpenCapsule.css

│       │   ├── Wall.css

│       │   ├── Navbar.css

│       │   └── Profile.css

│       ├── types/

│       │   └── index.ts (TypeScript interfaces)

│       ├── App.tsx

│       └── main.tsx

│

└── backend/

└── src/

├── controllers/

│   ├── auth.controller.js

│   ├── capsule.controller.js

│   └── wall.controller.js

├── middleware/

│   └── auth.middleware.js

├── models/

│   ├── user.model.js

│   ├── capsule.model.js

│   └── wall.model.js

├── routes/

│   ├── auth.routes.js

│   └── capsule.routes.js

├── jobs/

│   └── capsule.unlock.js (Cron job for email notifications)

├── server.js

└── .env
---

## Setup & Installation

### Frontend

```bash
cd frontend
npm install
npm run dev  # Local development (http://localhost:5173)
```

Create `.env`:
VITE_API_URL=http://localhost:5000

### Backend

```bash
cd backend
npm install
npm start  # Runs on http://localhost:5000
```

Create `.env`:
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key

FRONTEND_URL=http://localhost:5173

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import repo to Vercel
3. Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variable: `VITE_API_URL=https://tothenextversion.onrender.com`

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Runtime: Node
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `RESEND_API_KEY`
   - `FRONTEND_URL=https://tothenextversion-xyjc.vercel.app`

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `PUT /api/auth/profile` - Update profile

### Capsules
- `POST /api/capsules` - Create capsule
- `GET /api/capsules` - Get user's capsules
- `GET /api/capsules/:id` - Get single capsule
- `DELETE /api/capsules/:id` - Delete capsule
- `POST /api/capsules/:id/share` - Share to wall

### Wall
- `GET /api/wall` - Get shared capsules
- `PATCH /api/capsules/wall/:id/like` - Like a post

---

## How to Use

1. **Sign Up** - Register with email and create an account
2. **Create Capsule** - Write a letter in 3 steps: title/message, about you, unlock date
3. **Dashboard** - See all your capsules, filter by locked/ready
4. **Open Capsule** - Read unlocked letters, optionally share to wall
5. **Wall** - Browse shared letters from others, like them
6. **Profile** - View stats, edit username/tagline, sign out

---

## Key Technologies

- **Authentication:** JWT + bcryptjs
- **State Management:** React Context
- **Styling:** Vanilla CSS with CSS variables
- **Email Service:** Resend
- **Job Scheduling:** node-cron (email notifications at unlock time)
- **Database:** MongoDB with Mongoose ODM

---

## License

MIT