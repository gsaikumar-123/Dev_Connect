
---

# Dev\_Connect

## 🌐 Overview

**Dev\_Connect** is a full-stack social networking application designed for developers and professionals to connect. It enables users to create and manage profiles, send and review connection requests, explore a feed of unconnected users, and maintain a network of accepted connections.

The backend delivers a robust REST API, while the frontend—built with **React** and **Tailwind CSS**—offers a responsive and intuitive user interface.

---

## 🚀 Features

### 🔐 Authentication & Security
* Secure user registration and login with JWT authentication
* Password hashing with bcrypt
* Protected routes with middleware
* Environment-based configuration for secrets

### 👤 Profile Management
* Comprehensive profile creation and editing
* Photo upload support
* Skills management (comma-separated)
* Age, gender, and bio customization

### 🤝 Connection System
* Send connection requests (interested/ignored)
* Accept/reject incoming requests
* View and manage connections
* Remove connections

### 🔍 User Discovery
* Trie-based efficient user search
* Paginated feed of unconnected users
* Advanced filtering and matching

### 💬 Real-time Chat
* WebSocket-powered messaging
* Conversation management
* Message deletion and read receipts
* Typing indicators
* File attachment support

### 🎨 User Interface
* Responsive design with Tailwind CSS
* Dark mode support
* Modern card-based layouts
* Smooth animations and transitions
* Mobile-first approach

---

## 🧰 Tech Stack

### 🔧 Backend
* **Node.js** – JavaScript runtime environment
* **Express.js** – Web application framework
* **MongoDB** – NoSQL database with Mongoose ODM
* **Socket.io** – Real-time bidirectional communication
* **JWT** – JSON Web Token for authentication
* **bcrypt** – Password hashing
* **validator** – Input validation and sanitization
* **cookie-parser** – HTTP cookie handling
* **cors** – Cross-origin resource sharing

### 🎨 Frontend
* **React** – Component-based UI library
* **Redux Toolkit** – State management with slices
* **React Router** – Client-side routing
* **Tailwind CSS** – Utility-first CSS framework
* **Vite** – Fast build tool and dev server
* **Axios** – HTTP client for API calls
* **Socket.io-client** – Real-time communication client
* **DaisyUI** – Tailwind CSS component library

---

## 📦 Prerequisites

* **Node.js**: v16 or higher
* **MongoDB**: Atlas cluster or local instance
* **npm**: Node package manager

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: v16 or higher ([Download](https://nodejs.org/))
- **MongoDB**: Atlas account or local MongoDB instance
- **Git**: For cloning the repository

### 1. Clone the Repository
```bash
git clone https://github.com/gsaikumar-123/Dev_Connect.git
cd Dev_Connect
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

**Environment Configuration:**
- Copy `.env.example` to `.env`
- Fill in your values:
```env
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_jwt_secret_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Dev_Connect
```

**Note**: Environment variables are required - no fallback defaults for security.

```bash
npm start
```
✅ Backend runs on: `http://localhost:1234`

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```

**Environment Configuration:**
- Copy `.env.example` to `.env`
```env
VITE_BASE_URL=http://localhost:1234
```

```bash
npm run dev
```
✅ Frontend runs on: `http://localhost:5173`

### 4. Database Setup
- Create a MongoDB Atlas cluster or use local MongoDB
- Update `MONGODB_URI` in backend `.env` with your connection string
- The app will automatically create required collections

### 5. Verification
1. Open `http://localhost:5173` in your browser
2. Register a new account
3. Complete your profile
4. Start exploring connections!

### Troubleshooting
- **Port conflicts**: Change ports in code if 1234/5173 are occupied
- **CORS errors**: Ensure `FRONTEND_URL` matches your frontend URL exactly
- **Database connection**: Verify MongoDB URI and network access
- **Build failures**: Ensure Node.js version ≥16 and all dependencies installed

---

## ⚙️ Usage

* **Backend API**: `http://localhost:1234`
* **Frontend**: `http://localhost:5173`

### 🔑 Frontend Routes

* `/login` – Sign up or log in
* `/user/feed` – Browse unconnected users
* `/profile` – View/edit your profile
* `/connections` – List accepted connections
* `/requests` – Manage incoming connection requests

### 📡 API Endpoints

#### Authentication
- `POST /signup` - Register new user
  - Body: `{firstName, lastName, emailId, password}`
- `POST /login` - Authenticate user
  - Body: `{emailId, password}`
- `POST /logout` - Logout user

#### Profile Management
- `GET /profile/view` - Get current user profile
- `PATCH /profile/edit` - Update user profile
  - Body: `{firstName?, lastName?, photoUrl?, age?, gender?, about?, skills?}`
- `PATCH /profile/password` - Change password
  - Body: `{password}`

#### User Discovery
- `GET /user/feed?page=1&limit=5` - Get paginated feed of unconnected users
- `GET /user/search?q=searchTerm` - Search users by name
- `GET /user/:id` - Get specific user profile with connection status

#### Connections & Requests
- `POST /request/send/:status/:toUserId` - Send connection request
  - Status: `interested` or `ignored`
- `POST /request/review/:status/:requestId` - Review incoming request
  - Status: `accepted` or `rejected`
- `GET /user/requests` - Get pending connection requests
- `GET /user/connections` - Get accepted connections
- `DELETE /connection/remove/:userId` - Remove existing connection

#### Chat System
- `POST /chat/start` - Start a chat conversation
  - Body: `{toUserId}`
- `POST /chat/send` - Send a message
  - Body: `{toUserId, text?, attachments?}`
- `GET /chat/conversations` - Get user's conversations
- `GET /chat/messages/:conversationId?page=1&limit=30` - Get conversation messages
- `POST /chat/read` - Mark conversation as read
  - Body: `{conversationId}`
- `DELETE /chat/message/:id` - Delete a message

All endpoints except auth require JWT authentication via cookies.

---

## 💡 How It Works

### User Journey
1. **Registration**: Create account with email, password, and basic info
2. **Profile Setup**: Complete profile with photo, skills, bio, and preferences
3. **Discovery**: Browse feed of potential connections using search or pagination
4. **Connections**: Send requests, accept/reject incoming requests, build network
5. **Communication**: Start chats with connections, exchange messages in real-time

### Architecture
- **Frontend**: Single-page application with client-side routing
- **Backend**: RESTful API with WebSocket support for real-time features
- **Database**: MongoDB with optimized queries and indexing
- **Authentication**: Stateless JWT with HTTP-only cookies
- **Search**: Trie data structure for efficient prefix matching
- **Real-time**: Socket.io for instant messaging and notifications

### Data Flow
- User actions trigger Redux state updates
- API calls made via Axios with interceptors
- Real-time events handled through Socket.io listeners
- Search cache rebuilt periodically for performance

---

## 📁 Project Structure

```
Dev_Connect/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── middlewares/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── user.js              # User schema
│   │   │   ├── connectionRequest.js # Connection requests schema
│   │   │   ├── conversation.js      # Chat conversations schema
│   │   │   └── message.js           # Chat messages schema
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication endpoints
│   │   │   ├── profile.js           # Profile management
│   │   │   ├── requests.js          # Connection requests
│   │   │   ├── user.js              # User discovery & connections
│   │   │   └── chat.js              # Chat system
│   │   ├── utils/
│   │   │   ├── validation.js        # Input validation
│   │   │   └── searchCache.js       # Trie-based user search
│   │   └── app.js                   # Express app & Socket.io setup
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx              # Main app component
│   │   │   ├── Body.jsx             # Layout wrapper
│   │   │   ├── NavBar.jsx           # Navigation bar
│   │   │   ├── Login.jsx            # Authentication forms
│   │   │   ├── Profile.jsx          # Profile view
│   │   │   ├── EditProfile.jsx      # Profile editing
│   │   │   ├── Feed.jsx             # User discovery feed
│   │   │   ├── UserCard.jsx         # User profile card
│   │   │   ├── Connections.jsx      # Connections list
│   │   │   ├── Requests.jsx         # Connection requests
│   │   │   ├── ConnectionCard.jsx   # Connection display
│   │   │   ├── ChatPage.jsx         # Chat interface
│   │   │   ├── ChatWindow.jsx       # Chat conversation
│   │   │   ├── ConversationList.jsx # Chat sidebar
│   │   │   ├── UserProfilePage.jsx  # Individual user profiles
│   │   │   ├── UserProfileModal.jsx # Profile modal
│   │   │   └── Footer.jsx           # App footer
│   │   ├── utils/
│   │   │   ├── appStore.js          # Redux store
│   │   │   ├── userSlice.js         # User state
│   │   │   ├── feedSlice.js         # Feed state
│   │   │   ├── connectionsSlice.js  # Connections state
│   │   │   ├── requestsSlice.js     # Requests state
│   │   │   ├── chatSlice.js         # Chat state
│   │   │   ├── constants.js         # API constants
│   │   │   └── appStore.js          # Store configuration
│   │   ├── assets/                  # Static assets
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # App entry point
│   ├── public/                      # Public assets
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---