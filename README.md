# ReviewX

A comprehensive full-stack rating and review management system that enables users to rate stores, store owners to manage their establishments, and administrators to oversee the entire platform.

## 📋 Overview

ReviewX is a role-based platform designed to facilitate transparent and organized store rating management. The application provides different dashboards and capabilities based on user roles (User, Store Owner, Admin), ensuring secure and appropriate access to features.

## ✨ Features

### For Users
- **Store Rating**: Rate stores on a scale of 1-5 stars
- **View Ratings**: Browse and view ratings for all stores
- **Manage Ratings**: Update or delete your own ratings
- **User Dashboard**: Personal dashboard to track your rating activity

### For Store Owners
- **Store Management**: View and manage store information
- **Rating Analytics**: See ratings received for your store
- **Store Dashboard**: Dedicated dashboard for store insights

### For Administrators
- **User Management**: Create, read, update, and delete user accounts
- **Store Management**: Full CRUD operations on stores
- **Store Owner Assignment**: Assign store owners to stores
- **Admin Dashboard**: Comprehensive view of all platform activities

### General Features
- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Real-time Notifications**: Toast notifications for user actions
- **Modern UI/UX**: Clean and intuitive interface with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Vashishta-Mithra-Reddy/reviewx.git
cd reviewx
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
PG_HOST=localhost
PG_USER=your_postgres_user
PG_PASSWORD=your_postgres_password
PG_DATABASE=reviewx_db
JWT_SECRET=your_jwt_secret_key
```

#### Database Setup
Ensure PostgreSQL is running and create the database:
```sql
CREATE DATABASE reviewx_db;
```

The application will automatically sync database tables on startup.

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

## 🏃 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Backend
```bash
cd backend
npm start
```

## 👥 User Roles & Permissions

### User Role
- Can view all stores
- Can rate stores (1-5 stars)
- Can view, update, and delete their own ratings
- Access to user dashboard

### Store Owner Role
- Can view their assigned store
- Can view all ratings for their store
- Access to store owner dashboard
- Cannot modify ratings

### Admin Role
- Full access to user management (CRUD operations)
- Full access to store management (CRUD operations)
- Can assign store owners to stores
- Can view all ratings
- Access to admin dashboard

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

### Users (Admin Only)
- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/store-owners` - Get all store owners
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Stores
- `POST /stores` - Create a store (Admin only)
- `GET /stores` - Get all stores (Authenticated users)
- `GET /stores/owner` - Get store by owner ID (Store Owner only)
- `GET /stores/:id` - Get store by ID
- `PUT /stores/:id` - Update store (Admin only)
- `DELETE /stores/:id` - Delete store (Admin only)

### Ratings
- `POST /ratings` - Create a rating
- `GET /ratings/total` - Get total ratings
- `GET /ratings/user` - Get user's ratings
- `GET /ratings/:storeId` - Get ratings by store ID
- `PUT /ratings/:id` - Update rating
- `DELETE /ratings/:id` - Delete rating

## 📁 Project Structure

```
reviewx/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Database configuration
│   │   ├── controllers/
│   │   │   ├── authController.js  # Authentication logic
│   │   │   ├── userController.js  # User management
│   │   │   ├── storeController.js # Store management
│   │   │   └── ratingController.js # Rating management
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification
│   │   │   └── roleCheck.js       # Role-based access control
│   │   ├── models/
│   │   │   ├── User.js            # User model
│   │   │   ├── Store.js           # Store model
│   │   │   └── Rating.js          # Rating model
│   │   ├── routes/
│   │   │   ├── auth.js            # Auth routes
│   │   │   ├── users.js           # User routes
│   │   │   ├── stores.js          # Store routes
│   │   │   └── ratings.js         # Rating routes
│   │   └── index.js               # Server entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── Login.tsx          # Login component
│   │   │   ├── Register.tsx       # Registration component
│   │   │   ├── UserDashboard.tsx  # User dashboard
│   │   │   ├── StoreOwnerDashboard.tsx # Store owner dashboard
│   │   │   ├── AdminDashboard.tsx # Admin dashboard
│   │   │   ├── StoreList.tsx      # Store listing
│   │   │   ├── UserList.tsx       # User listing
│   │   │   ├── StarRating.tsx     # Star rating component
│   │   │   └── ...                # Other components
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Authentication context
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env
└── README.md
```

## 🗄️ Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (String, max 60 chars)
- `email` (String, unique)
- `password` (String, hashed)
- `address` (String, max 400 chars)
- `role` (Enum: 'admin', 'user', 'store_owner')

### Stores Table
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, unique)
- `address` (String, max 400 chars)
- `owner_id` (UUID, Foreign Key → Users)

### Ratings Table
- `id` (UUID, Primary Key)
- `rating` (Integer, 1-5)
- `userId` (UUID, Foreign Key → Users)
- `storeId` (UUID, Foreign Key → Stores)

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Tokens stored in secure cookies
- **Role-Based Access Control**: Middleware ensures proper authorization
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Sequelize validations on all models

## 🎨 UI Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Animations**: Smooth transitions using Framer Motion
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Spinner component for async operations
- **Icon Library**: React Icons for consistent iconography

## 🧪 Development

### Dev (Frontend)
```bash
cd frontend
npm run dev
```
### Dev (Backend)
```bash
cd backend
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Vashishta Mithra Reddy**

---

