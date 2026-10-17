# 📅 BookEasy – Online Appointment Booking System
### Barber, Clinic & Private Tutor Scheduling Web Application
**Subject:** Web Design and Internet Programming  
**Author / Developer:** Muhammad Huzaifa  
**Architecture:** MERN Stack (MongoDB, Express.js, React.js, Node.js + Tailwind CSS)

---

> 🚀 **Live Production Deployment:** Hosted on Vercel  
> 🔑 **1-Click Demo Accounts:**  
> • **Admin Account:** `admin@appointment.com` / `admin123` (Full Management Console)  
> • **Client User:** `user@appointment.com` / `user123` (Booking & Appointments Dashboard)

---

## 🌟 Project Overview
**BookEasy** is a complete, modern, responsive full-stack web application developed for online appointment scheduling across three everyday service domains:
1. **💈 Barbershop** (Haircuts, Hot Towel Shaving, Beard Styling, Hair Treatments)
2. **🩺 Medical Clinic** (Doctor Consultation, Dental Checkups, Pediatric Appointments)
3. **🎓 Private Tutors** (Mathematics, Science & Physics, Programming & Coding, Languages)

The platform empowers clients to browse certified providers, view real-time open time slots, schedule appointments without double-booking risk, receive instant confirmation receipts, and manage bookings through a client dashboard. It also features a full-featured **Admin Dashboard** for complete business control.

---

## 🚀 Key Features

### 👤 For Clients / Users
- **Explore & Filter:** Search and filter services and providers by category (Barber, Clinic, Tutor).
- **Provider Profiles:** In-depth provider cards with specialties, ratings, locations, hours, and bios.
- **Interactive Multi-Step Booking:** Select Provider → Service → Modality (In-Person / Virtual) → Date → Open Slot → Confirm.
- **Double-Booking Prevention:** Real-time database slot verification that locks taken slots.
- **Booking Confirmation Voucher:** Downloadable / printable receipt with unique reference code.
- **User Dashboard:** Track upcoming, completed, and cancelled appointments with 1-click cancellation.
- **JWT Authentication:** Secure user registration, password hashing (bcrypt), and session handling.

### 👑 For Administrators
- **Executive Analytics:** Live counters for Total Users, Providers, Services, Total Bookings, Today's Bookings, Pending Reviews, and Total Revenue.
- **Appointment Management:** Live table with status updater (Pending → Confirmed → Completed → Cancelled) and deletion.
- **Provider Management:** Complete CRUD (Add, Edit, Delete, View) with category, hours, and image assignment.
- **Service Management:** Complete CRUD with price, duration, category, and provider assignment.
- **User Role Management:** View all accounts and toggle permissions (User ↔ Admin).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons, React Router v6 |
| **Backend** | Node.js, Express.js, REST API Architecture |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT) & bcrypt.js password hashing |
| **Security** | Protected Route Gates, Admin Role Middleware, Input Sanitization |

---

## 🔑 Demo Login Credentials

For quick evaluation and presentation demonstrations, 1-click fill buttons are provided on the Login page:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **👑 Administrator** | `admin@appointment.com` | `admin123` | Full Admin Console (`/admin`) + User Features |
| **👤 Client User** | `user@appointment.com` | `user123` | Booking + User Dashboard (`/dashboard`) |

*(You can also register any new customer account with instant authentication).*

---

## 💻 How to Run the Project Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port `27017` (or provide a remote MongoDB Atlas URI in `backend/.env`)

---

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Populate sample data into MongoDB (barbers, clinics, tutors, services, users):
   ```bash
   npm run seed
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(Or `npm start`). Server starts on `http://localhost:5000`*.

---

### 3. Frontend Setup
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📂 Project Structure

```
uni project/
│
├── backend/
│   ├── config/
│   │   ├── db.js             # Mongoose MongoDB connection
│   │   └── seed.js           # Realistic university demonstration seed data
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, Me endpoints
│   │   ├── bookingController.js    # Slots, booking CRUD & double-booking logic
│   │   ├── providerController.js   # Provider CRUD operations
│   │   ├── serviceController.js    # Services CRUD operations
│   │   ├── userController.js       # User management & role toggling
│   │   └── adminStatsController.js # Analytics & revenue metrics
│   ├── middleware/
│   │   └── auth.js           # JWT verification & adminOnly gatekeeper
│   ├── models/
│   │   ├── User.js           # User schema (client/admin)
│   │   ├── Provider.js       # Provider schema (category, hours, rating)
│   │   ├── Service.js        # Service schema (pricing, duration, relation)
│   │   └── Booking.js        # Booking schema (composite date/time slot lock)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── providerRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── .env                  # Port, Mongo URI, JWT secret
│   ├── package.json
│   └── server.js             # Express app entry & route mounting
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Navbar.jsx          # Dynamic header (client / admin switch)
│   │   │       ├── Footer.jsx          # Comprehensive footer with quick links
│   │   │       └── ProtectedRoute.jsx  # Route guards for Auth & Admin roles
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global auth state & token persistence
│   │   ├── pages/
│   │   │   ├── HomePage.jsx                # Landing page with hero & categories
│   │   │   ├── ServicesPage.jsx            # Service catalog with category filter
│   │   │   ├── ProvidersPage.jsx           # Providers directory with specialty search
│   │   │   ├── ProviderDetailsPage.jsx     # Detailed profile, hours & services
│   │   │   ├── BookingPage.jsx             # 5-step booking wizard with slot chips
│   │   │   ├── BookingConfirmationPage.jsx # Printable voucher pass
│   │   │   ├── LoginPage.jsx               # Login with 1-click demo buttons
│   │   │   ├── RegisterPage.jsx            # Validated registration
│   │   │   ├── UserDashboard.jsx           # Client booking management & cancel
│   │   │   ├── AdminDashboard.jsx          # Full administrative console
│   │   │   ├── AboutPage.jsx               # University project introduction
│   │   │   └── ContactPage.jsx             # Support & inquiry form
│   │   ├── services/
│   │   │   └── api.js                # Centralized Fetch API client
│   │   ├── App.jsx                   # React Router route registry
│   │   ├── main.jsx                  # React DOM root mounting
│   │   └── index.css                 # Custom scrollbars & Tailwind base
│   ├── index.html                    # HTML5 template with Google Fonts
│   ├── tailwind.config.js
│   ├── vite.config.js                # Vite server with proxy to backend :5000
│   └── package.json
│
├── README.md                         # Quick start guide
└── DOCUMENTATION.md                  # Comprehensive University Academic Project Report
```

---

## 📡 REST API Reference

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register client account |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile |
| `GET` | `/api/providers` | Public | List providers (optional `?category=`) |
| `GET` | `/api/providers/:id` | Public | Get single provider details |
| `POST` | `/api/providers` | Admin | Create new service provider |
| `PUT` | `/api/providers/:id` | Admin | Update provider information |
| `DELETE` | `/api/providers/:id` | Admin | Delete provider |
| `GET` | `/api/services` | Public | List services (optional filters) |
| `POST` | `/api/services` | Admin | Create new service |
| `PUT` | `/api/services/:id` | Admin | Update service |
| `DELETE` | `/api/services/:id` | Admin | Delete service |
| `GET` | `/api/bookings/available-slots` | Public | Query open/taken time slots |
| `POST` | `/api/bookings` | Private | Reserve slot (prevents double-booking) |
| `GET` | `/api/bookings/my-bookings` | Private | Retrieve logged-in user's bookings |
| `GET` | `/api/bookings` | Admin | List all system bookings |
| `PUT` | `/api/bookings/:id/status` | Private/Admin | Change status (Pending/Confirmed/etc.) |
| `DELETE` | `/api/bookings/:id` | Admin | Delete booking |
| `GET` | `/api/admin/stats` | Admin | KPI metrics, counts, and revenue |

---

## 🎓 University Evaluation Notes
- **Clean Architecture:** Strict separation between presentation (`frontend/src/pages`), services (`frontend/src/services`), controllers (`backend/controllers`), and data models (`backend/models`).
- **Interactive UI:** Smooth transitions, responsive tables, badge status chips, and intuitive modal forms.
- **Demo Readiness:** Pre-seeded with 9 providers (Ahmed Barber, Dr. Ahmed, Muhammad Tutor, etc.), 15 services, and realistic bookings.
