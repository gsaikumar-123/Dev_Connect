
---

# Dev\_Connect

## 🌐 Overview

**Dev\_Connect** is a full-stack social networking application designed for developers and professionals to connect. It enables users to create and manage profiles, send and review connection requests, explore a feed of unconnected users, and maintain a network of accepted connections.

The backend delivers a robust REST API, while the frontend—built with **React** and **Tailwind CSS**—offers a responsive and intuitive user interface.

---

## 🚀 Features

* **User Authentication**: Secure signup, login, and logout with JWT-based authentication.
* **Profile Management**: Create, view, and edit profiles including name, photo, age, gender, about, and skills.
* **Connection Requests**: Send “interested” or “ignored” requests, and review incoming requests with “accept” or “reject” options.
* **User Feed**: Dynamic feed showing users not yet connected to the logged-in user.
* **Connections View**: Display accepted connections with detailed user info.
* **Responsive UI**: Mobile-friendly and styled using Tailwind CSS for a modern look.

---

## 🧰 Tech Stack

### 🔧 Backend

* **Node.js** – JavaScript runtime
* **Express.js** – Web framework
* **MongoDB** – NoSQL database
* **Mongoose** – MongoDB object modeling
* **JWT** – JSON Web Token for secure auth
* **bcrypt** – Password hashing
* **validator** – Input validation
* **cookie-parser** – For managing auth cookies
* **cors** – Cross-origin requests

### 🎨 Frontend

* **React** – Component-based UI
* **Redux Toolkit** – Global state management
* **React Router** – Client-side routing
* **Tailwind CSS** – Utility-first styling
* **Vite** – Lightweight dev server & build tool
* **Axios** – API request handling

---

## 📦 Prerequisites

* **Node.js**: v16 or higher
* **MongoDB**: Atlas cluster or local instance
* **npm**: Node package manager

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/gsaikumar-123/Dev_Connect.git
cd Dev_Connect
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

> Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@mycluster.zten6.mongodb.net/Dev_Connect
```

```bash
npm start
```

Server will run at: `http://localhost:1234`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

App will run at: `http://localhost:5173`

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

### 📡 Key API Endpoints

* `POST /signup` – Register new user
* `POST /login` – Authenticate user
* `POST /logout` – Logout and clear cookie
* `GET /profile/view` – Get profile data
* `PATCH /profile/edit` – Update profile
* `POST /request/send/:status/:toUserId` – Send request
* `POST /request/review/:status/:requestId` – Review request
* `GET /user/requests` – Incoming requests
* `GET /user/connections` – List of connections
* `GET /user/feed` – Unconnected user feed

---

## 🧠 How It Works

1. **Login/Signup**: Start at `/login`, log in or register, and get redirected to `/user/feed`.
2. **Feed**: Explore users and send "interested"/"ignored" requests via `UserCard`.
3. **Profile**: View and edit your profile on `/profile`.
4. **Connections**: See all accepted users on `/connections`.
5. **Requests**: Accept/reject incoming requests at `/requests`.

---

## 📁 Folder Structure

```
dev_connect/
├── backend/
│   ├── config/               # MongoDB config
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── utils/                # Validation utilities
│   ├── middlewares/          # Auth middleware
│   ├── app.js                # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Body.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── UserCard.jsx
│   │   │   ├── Connections.jsx
│   │   │   ├── Requests.jsx
│   │   │   └── ConnectionCard.jsx
│   │   ├── utils/
│   │   │   ├── appStore.js
│   │   │   ├── userSlice.js
│   │   │   ├── feedSlice.js
│   │   │   ├── connectionsSlice.js
│   │   │   ├── requestsSlice.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── package.json
└── README.md
```

---


## 📬 Contact

GitHub: [@gsaikumar-123](https://github.com/gsaikumar-123)
Feel free to connect or reach out for collaboration or feedback!

---
