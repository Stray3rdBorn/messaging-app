# Real-Time Messaging App

Full stack chat application built to practice real-time communication, authentication, and database design. Users can sign up, create or join chat rooms, and exchange messages instantly with full message history persisted to the database.

## Features

- User authentication (signup/login) with JWT
- Create and join chat rooms by ID
- Real-time messaging via WebSockets (Socket.io)
- Message history persisted in MongoDB
- Password hashing with bcrypt

## Tech Stack

**Frontend:** React (Vite), React Router, Axios, Socket.io Client
**Backend:** Node.js, Express, Socket.io
**Database:** MongoDB (Mongoose)
**Auth:** JWT, bcryptjs

## Project Structure

```
messaging-app/
├── server/              # Express backend
│   ├── models/          # Mongoose schemas (User, Room, Message)
│   ├── routes/          # REST endpoints (auth, rooms, messages)
│   ├── middleware/       # JWT auth middleware
│   └── index.js          # Entry point, Socket.io logic
├── client/              # React frontend
│   └── src/
│       ├── pages/        # Login, Signup, Rooms, Chat
│       └── App.jsx       # Routing
└── README.md
```

## How It Works

1. User signs up or logs in, receives a JWT stored in local storage.
2. User creates a room or joins an existing one by pasting its room ID.
3. Opening a room joins a Socket.io room on the backend and loads saved message history via REST.
4. Sending a message emits a Socket.io event, the backend saves it to MongoDB and broadcasts it to everyone currently in that room.

## Setup

**Backend:**
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Run:
```bash
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

Both servers need to run simultaneously, backend on port 5000, frontend on port 5173.

## Status

Core functionality complete: auth, rooms, real-time messaging, persistence. Styling (Tailwind CSS), Docker, and CI (GitHub Actions) are in progress.

## Author

Md Wahidul Islam ([Stray3rdBorn](https://github.com/Stray3rdBorn))
