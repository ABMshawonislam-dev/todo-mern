# Todo MERN Stack App

A clean, modern Todo application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User registration & login (JWT)
- Create, read, update, delete todos
- Mark todos as complete/incomplete
- Priority levels (low / medium / high)
- Responsive dark UI
- Protected routes

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Frontend**: React (Vite), React Router, Axios
- **Database**: MongoDB

## Project Structure

```
todo-mern/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── scripts/seed.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── styles.css
├── package.json
└── README.md
```

## Default Login (after seed)

- Email: `demo@todo.com`
- Password: `hello123`

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally

### Steps

```bash
# 1. Clone / enter project
cd todo-mern

# 2. Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Install dependencies
npm install
npm run install:all

# 4. Start MongoDB (if not running)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 5. Seed sample data
npm run seed

# 6. Run the app
npm run dev
```

- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/api/health

## AWS EC2 Hosting Guide

See the detailed step-by-step guide below (or in the conversation).
