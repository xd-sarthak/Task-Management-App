# Task Management Application

A comprehensive full-stack task management application built with modern web technologies. This application enables teams to manage workspaces, projects, and tasks with role-based access control and Google OAuth authentication.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Installation](#-installation)
- [Folder Structure](#-folder-structure)
- [API Endpoints](#-api-endpoints)
- [Project Statistics](#-project-statistics)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** Passport.js (Google OAuth 2.0, Local Strategy)
- **Session Management:** Cookie Session
- **Validation:** Zod
- **Security:** Bcrypt (password hashing), CORS
- **Development Tools:** ts-node-dev, TypeScript

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query
- **Routing:** React Router DOM
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Date Handling:** date-fns, react-day-picker
- **HTTP Client:** Axios
- **Additional Libraries:**
  - Emoji Mart (emoji picker)
  - Immer (immutable state updates)
  - nuqs (URL state management)
  - TanStack Table (data tables)

## ✨ Features

- 🔐 **Authentication:** Google OAuth 2.0 and Local (email/password) authentication
- 👥 **Workspace Management:** Create, update, and manage workspaces
- 📁 **Project Management:** Organize projects within workspaces
- ✅ **Task Management:** Create, update, delete, and track tasks
- 👤 **Member Management:** Invite members and manage roles
- 🔒 **Role-Based Access Control:** Permission-based access to features
- 📊 **Analytics:** Workspace and project analytics
- 🎨 **Modern UI:** Responsive design with Tailwind CSS and Radix UI components

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database (local or cloud instance like MongoDB Atlas)
- Google OAuth credentials (for Google authentication)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd taskapp
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

### Step 4: Set Up Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
BASE_PATH=/api

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# Session Configuration
SESSION_SECRET=your_session_secret_here
SESSION_EXPIRES_IN=24h

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend Configuration
FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:5173/auth/google/callback
```

#### Frontend Environment Variables

Create a `.env.local` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Step 5: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for development)
   - Your production URL + `/api/auth/google/callback` (for production)
7. Copy the Client ID and Client Secret to your environment variables

### Step 6: Set Up MongoDB

1. Create a MongoDB database (local or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
2. Get your connection string
3. Update `MONGO_URI` in your backend `.env` file

### Step 7: Seed Database (Optional)

```bash
cd backend
npm run seed
```

This will seed the database with initial role data.

## 📁 Folder Structure

```
taskapp/
├── backend/
│   ├── src/
│   │   ├── @types/              # TypeScript type definitions
│   │   ├── config/              # Configuration files
│   │   │   ├── app.config.ts    # Application configuration
│   │   │   ├── database.config.ts # Database connection
│   │   │   ├── http.config.ts   # HTTP status codes
│   │   │   └── passport.config.ts # Passport authentication config
│   │   ├── controllers/         # Route controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── member.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── workspace.controller.ts
│   │   ├── enums/               # TypeScript enums
│   │   │   ├── account-provider.enum.ts
│   │   │   ├── error-code.enum.ts
│   │   │   ├── role.enum.ts
│   │   │   └── task.enum.ts
│   │   ├── middlewares/         # Express middlewares
│   │   │   ├── asyncHandler.middleware.ts
│   │   │   ├── errorHandler.middleware.ts
│   │   │   └── isAuthenticated.middleware.ts
│   │   ├── models/              # Mongoose models
│   │   │   ├── account.model.ts
│   │   │   ├── member.model.ts
│   │   │   ├── project.model.ts
│   │   │   ├── roles-permission.model.ts
│   │   │   ├── task.model.ts
│   │   │   ├── user.model.ts
│   │   │   └── workspace.model.ts
│   │   ├── routes/              # API routes
│   │   │   ├── auth.route.ts
│   │   │   ├── member.route.ts
│   │   │   ├── project.route.ts
│   │   │   ├── task.route.ts
│   │   │   ├── user.route.ts
│   │   │   └── workspace.route.ts
│   │   ├── seeders/             # Database seeders
│   │   │   └── role.seeder.ts
│   │   ├── services/            # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── member.service.ts
│   │   │   ├── project.service.ts
│   │   │   ├── task.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── workspace.service.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── appError.ts
│   │   │   ├── bcrypt.ts
│   │   │   ├── get-env.ts
│   │   │   ├── role-permission.ts
│   │   │   ├── roleGuard.ts
│   │   │   └── uuid.ts
│   │   ├── validation/          # Zod validation schemas
│   │   │   ├── auth.validation.ts
│   │   │   ├── project.validation.ts
│   │   │   ├── task.validation.ts
│   │   │   └── workspace.validation.ts
│   │   └── index.ts             # Application entry point
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── asidebar/        # Sidebar components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── confirm-dialog/  # Confirmation dialogs
│   │   │   ├── emoji-picker/    # Emoji picker component
│   │   │   ├── logo/            # Logo component
│   │   │   ├── resuable/        # Reusable components
│   │   │   ├── skeleton-loaders/ # Loading skeletons
│   │   │   ├── ui/              # UI components (Radix UI)
│   │   │   └── workspace/       # Workspace-related components
│   │   │       ├── common/      # Common workspace components
│   │   │       ├── member/      # Member management
│   │   │       ├── project/     # Project management
│   │   │       ├── settings/    # Workspace settings
│   │   │       └── task/        # Task management
│   │   ├── constant/            # Constants
│   │   ├── context/             # React contexts
│   │   │   ├── auth-provider.tsx
│   │   │   └── query-provider.tsx
│   │   ├── hoc/                 # Higher-order components
│   │   │   └── with-permission.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── api/             # API hooks
│   │   │   └── ...
│   │   ├── layout/              # Layout components
│   │   │   ├── app.layout.tsx
│   │   │   └── base.layout.tsx
│   │   ├── lib/                 # Utility libraries
│   │   │   ├── api.ts
│   │   │   ├── axios-client.ts
│   │   │   ├── base-url.ts
│   │   │   ├── helper.ts
│   │   │   └── utils.ts
│   │   ├── page/                # Page components
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── errors/          # Error pages
│   │   │   ├── invite/          # Invite page
│   │   │   └── workspace/       # Workspace pages
│   │   ├── routes/              # Routing configuration
│   │   │   ├── auth.route.tsx
│   │   │   ├── common/
│   │   │   ├── index.tsx
│   │   │   └── protected.route.tsx
│   │   ├── types/               # TypeScript types
│   │   │   ├── api.type.ts
│   │   │   └── custom-error.type.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── README.md
```

## 🔌 API Endpoints

All API endpoints are prefixed with `/api` (configurable via `BASE_PATH`).

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login with email/password | No |
| POST | `/api/auth/logout` | Logout current user | Yes |
| GET | `/api/auth/google` | Initiate Google OAuth login | No |
| GET | `/api/auth/google/callback` | Google OAuth callback | No |

### User Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/current` | Get current authenticated user | Yes |

### Workspace Routes (`/api/workspace`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/workspace/create/new` | Create a new workspace | Yes |
| PUT | `/api/workspace/update/:id` | Update workspace by ID | Yes |
| DELETE | `/api/workspace/delete/:id` | Delete workspace by ID | Yes |
| GET | `/api/workspace/all` | Get all workspaces user is a member of | Yes |
| GET | `/api/workspace/:id` | Get workspace by ID | Yes |
| GET | `/api/workspace/members/:id` | Get all members of a workspace | Yes |
| GET | `/api/workspace/analytics/:id` | Get workspace analytics | Yes |
| PUT | `/api/workspace/change/member/role/:id` | Change member role in workspace | Yes |

### Project Routes (`/api/project`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/project/workspace/:workspaceId/create` | Create a new project in workspace | Yes |
| PUT | `/api/project/:id/workspace/:workspaceId/update` | Update project by ID | Yes |
| DELETE | `/api/project/:id/workspace/:workspaceId/delete` | Delete project by ID | Yes |
| GET | `/api/project/workspace/:workspaceId/all` | Get all projects in workspace | Yes |
| GET | `/api/project/:id/workspace/:workspaceId` | Get project by ID and workspace ID | Yes |
| GET | `/api/project/:id/workspace/:workspaceId/analytics` | Get project analytics | Yes |

### Task Routes (`/api/task`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/task/project/:projectId/workspace/:workspaceId/create` | Create a new task | Yes |
| PUT | `/api/task/:id/project/:projectId/workspace/:workspaceId/update` | Update task by ID | Yes |
| DELETE | `/api/task/:id/workspace/:workspaceId/delete` | Delete task by ID | Yes |
| GET | `/api/task/workspace/:workspaceId/all` | Get all tasks in workspace | Yes |
| GET | `/api/task/:id/project/:projectId/workspace/:workspaceId` | Get task by ID | Yes |

### Member Routes (`/api/member`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/member/workspace/:inviteCode/join` | Join workspace using invite code | Yes |

## 📊 Project Statistics

- **Total Lines of Code:** ~12,668 lines
- **Backend TypeScript Files:** 49 files
- **Frontend TypeScript/TSX Files:** 116 files
- **Total Source Files:** 165+ files

### Breakdown by Component

- **Backend:**
  - Controllers: 6 files
  - Services: 6 files
  - Models: 7 files
  - Routes: 6 files
  - Middlewares: 3 files
  - Utils: 6 files
  - Validation: 4 files
  - Config: 4 files

- **Frontend:**
  - Components: 50+ files
  - Pages: 10+ files
  - Hooks: 15+ files
  - Utilities: 5+ files

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server:**

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000` (or the port specified in your `.env` file).

2. **Start the Frontend Development Server:**

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173` (default Vite port).

### Production Build

1. **Build the Backend:**

```bash
cd backend
npm run build
npm start
```

2. **Build the Frontend:**

```bash
cd client
npm run build
npm run preview
```

## 🔐 Environment Variables

### Backend Required Variables

- `MONGO_URI` - MongoDB connection string
- `SESSION_SECRET` - Secret key for session encryption
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL
- `FRONTEND_ORIGIN` - Frontend application origin
- `FRONTEND_GOOGLE_CALLBACK_URL` - Frontend Google OAuth callback URL

### Frontend Required Variables

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID (for frontend)

## 📝 Notes

- All protected routes require authentication via session cookies
- The application uses cookie-based sessions for authentication
- Google OAuth requires proper callback URL configuration
- MongoDB connection string should include authentication credentials
- Session secret should be a strong, randomly generated string

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ using modern web technologies**
