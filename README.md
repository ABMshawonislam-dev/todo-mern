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

---

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

---

## AWS EC2 Hosting Guide

Follow these steps one by one. Do not skip any step.

### Step 1: Push Project to GitHub

On your local machine:

```bash
cd todo-mern
git init
git add .
git commit -m "Initial commit - Todo MERN App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/todo-mern.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

### Step 2: Create EC2 Instance

1. Go to [AWS Console](https://console.aws.amazon.com) → **EC2** → **Launch Instance**
2. Use these settings:

| Setting              | Value                                      |
|----------------------|--------------------------------------------|
| Name                 | `todo-mern-app`                            |
| OS Image             | **Ubuntu Server 24.04 LTS**                |
| Instance type        | **t2.micro** or **t3.micro**               |
| Key pair             | Create new → download `todo-key.pem`       |
| Storage              | 20 GB                                      |

3. Under **Network settings → Edit**, add these Inbound rules:

| Type       | Port | Source     | Description    |
|------------|------|------------|----------------|
| SSH        | 22   | My IP      | SSH access     |
| Custom TCP | 5000 | 0.0.0.0/0  | Backend API    |
| Custom TCP | 5173 | 0.0.0.0/0  | Frontend (dev) |

4. Click **Launch Instance**.
5. Wait until Status becomes **Running**, then copy the **Public IPv4 address**.

---

### Step 3: Connect via SSH

```bash
chmod 400 todo-key.pem
ssh -i todo-key.pem ubuntu@YOUR_PUBLIC_IP
```

Type `yes` when asked the first time.

---

### Step 4: Install Node.js + MongoDB

Run these commands one by one on the EC2 instance:

```bash
# System update
sudo apt update && sudo apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node -v
npm -v

# MongoDB 8.0
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

You should see `active (running)`. Press `q` to exit.

---

### Step 5: Clone Project from GitHub

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/todo-mern.git
cd todo-mern
```

If the repo is private, use a Personal Access Token.

---

### Step 6: Set Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
nano backend/.env
```

Paste this (replace `YOUR_PUBLIC_IP`):

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_mern
JWT_SECRET=change_this_to_a_strong_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://YOUR_PUBLIC_IP:5173
```

Save: `Ctrl + O` → Enter → `Ctrl + X`

```bash
# Frontend
cp frontend/.env.example frontend/.env
nano frontend/.env
```

```
VITE_API_URL=http://YOUR_PUBLIC_IP:5000/api
```

Save and exit.

---

### Step 7: Install Dependencies + Seed + Run

```bash
npm install
npm run install:all

npm run seed

npm run dev
```

Open in browser:

```
http://YOUR_PUBLIC_IP:5173
```

**Login:**
- Email: `demo@todo.com`
- Password: `hello123`

---

### Optional: Production Setup (PM2 + Nginx)

For a more permanent setup:

```bash
# Install PM2
sudo npm install -g pm2

# Start backend with PM2
cd ~/todo-mern/backend
pm2 start src/server.js --name todo-api
pm2 save
pm2 startup

# Build frontend
cd ~/todo-mern/frontend
npm run build

# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/todo
```

Paste this config (replace `YOUR_PUBLIC_IP`):

```nginx
server {
    listen 80;
    server_name YOUR_PUBLIC_IP;

    location / {
        root /home/ubuntu/todo-mern/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/todo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Also open **Port 80** in the EC2 Security Group.

Now access the app at:

```
http://YOUR_PUBLIC_IP
```

---

## Troubleshooting

| Problem                        | Solution                                      |
|--------------------------------|-----------------------------------------------|
| Cannot SSH                     | Check Security Group Port 22 + My IP          |
| Frontend loads but API fails   | Check `frontend/.env` has correct Public IP   |
| MongoDB connection error       | Run `sudo systemctl status mongod`            |
| Port 5173 / 5000 not opening   | Check Security Group Inbound rules            |
| Login fails                    | Run `npm run seed` again                      |

---

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me` (protected)

### Todos (all protected)
- `GET    /api/todos`
- `POST   /api/todos`
- `PUT    /api/todos/:id`
- `DELETE /api/todos/:id`
- `PATCH  /api/todos/:id/toggle`
