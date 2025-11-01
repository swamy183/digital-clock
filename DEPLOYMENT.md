# Deployment Guide

This guide provides end-to-end instructions to run and deploy this project locally and to popular cloud platforms. It includes MongoDB setup (local and Atlas), environment variables, deployment to Render and Railway, troubleshooting, and API testing examples.

## Prerequisites
- Node.js 18+ and npm
- Git
- A MongoDB database (local or MongoDB Atlas)

## 1) Local Development Setup (with local MongoDB)

### Step 1: Install MongoDB Community Edition
- macOS (Homebrew):
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community@7.0
  brew services start mongodb-community@7.0
  ```
- Ubuntu/Debian:
  ```bash
  # Import the public key and add repo per https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
  sudo apt-get update
  sudo apt-get install -y mongodb-org
  sudo systemctl enable mongod
  sudo systemctl start mongod
  sudo systemctl status mongod
  ```
- Windows:
  - Download “MongoDB Community Server” from https://www.mongodb.com/try/download/community
  - Install using the wizard and ensure “Install MongoDB as a Service” is checked.
  - Start the service from Services app or the MongoDB Compass.

Default local URI: `mongodb://127.0.0.1:27017/your-db-name`

### Step 2: Clone and install dependencies
```bash
git clone https://github.com/swamy183/digital-clock.git
cd digital-clock
npm install
```

### Step 3: Create .env
Create a `.env` file at the project root:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/digital_clock
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```
Adjust values as needed.

### Step 4: Start the app
```bash
npm run dev   # if available, or
npm start
```
Visit http://localhost:3000 (or the port you configured).

---

## 2) MongoDB Atlas (Cloud) Setup

1. Go to https://www.mongodb.com/cloud/atlas and create/login to your account.
2. Create a new “ Project ” and then “ Build a Database ”.
3. Choose Free tier (M0), pick a cloud provider/region, and create the cluster.
4. Create a database user:
   - Security > Database Access > Add New Database User
   - Username/password (save them)
5. Network access:
   - Security > Network Access > Add IP Address
   - Add your current IP or “0.0.0.0/0” (allows all; only for development/testing)
6. Get the connection string:
   - Go to your Cluster > Connect > Drivers
   - Copy the URI like:
     `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/digital_clock?retryWrites=true&w=majority&appName=<appName>`
7. Update your `.env`:
```env
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/digital_clock?retryWrites=true&w=majority&appName=<appName>"
```

---

## 3) Deployment to Render.com (Free Tier)

### A. Create a Web Service
1. Push your code to GitHub (this repo).
2. Go to https://render.com and sign in.
3. New > Web Service.
4. Connect your GitHub and select this repository.
5. Select a region close to your users.
6. Build & Start Command:
   - Build Command: `npm install`
   - Start Command: `npm start`
7. Environment: Node.

### B. Environment Variables
Set the following in Render Dashboard > Your Service > Environment:
- `PORT` = 10000 (Render provides PORT; you can leave it blank if your code reads process.env.PORT)
- `MONGODB_URI` = your MongoDB Atlas URI (recommended for Render free tier)
- `NODE_ENV` = production
- `CORS_ORIGIN` = your frontend origin or `*` for testing

If using local Mongo on Render: not supported. Use Atlas.

### C. Free Tier Notes
- Render free web services spin down on inactivity; first request may be cold.
- Ensure your server listens on `process.env.PORT`.

### D. Verify Deployment
- After deploy, open the Render URL and check logs.
- If health checks fail, verify start command and port.

---

## 4) Deployment to Railway.app

### A. Create a Project
1. Go to https://railway.app and sign in.
2. New Project > Deploy from GitHub Repo > select this repo.
3. Railway will auto-detect Node.js and run `npm install`.

### B. Add MongoDB
Option 1: Use MongoDB Atlas
- Create a MongoDB Atlas cluster (see section 2) and copy URI.
- In Railway project > Variables, add:
  - `MONGODB_URI` = your Atlas URI

Option 2: Use Railway MongoDB Plugin (if available in your account)
- Add Plugin > MongoDB and copy the provided connection URL.
- Set `MONGODB_URI` to that URL.

### C. Environment Variables
In Railway > Variables, set:
- `PORT` = 8080 (or leave blank; Railway sets PORT. Ensure your app uses process.env.PORT)
- `MONGODB_URI` = from Atlas or Plugin
- `NODE_ENV` = production
- `CORS_ORIGIN` = your frontend origin or `*` for testing

### D. Deploy and Verify
- Trigger a deploy (on push) or manual.
- Open the generated domain and monitor logs.

---

## 5) Environment Variables Summary

Local (.env):
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/digital_clock
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Render:
```env
PORT=10000            # or use provided PORT
MONGODB_URI=<atlas-uri>
NODE_ENV=production
CORS_ORIGIN=<your-frontend-origin-or-*>
```

Railway:
```env
PORT=8080             # or use provided PORT
MONGODB_URI=<atlas-uri-or-railway-plugin-uri>
NODE_ENV=production
CORS_ORIGIN=<your-frontend-origin-or-*>
```

---

## 6) Troubleshooting

- MongoDB connection errors:
  - Check `MONGODB_URI` for typos and proper URL encoding of username/password.
  - For Atlas, ensure IP Whitelist includes your server’s egress IP or `0.0.0.0/0` for testing.
  - Confirm your database user has readWrite on your DB.
  - Verify that your app attempts reconnect with proper drivers.

- CORS issues:
  - Ensure server sets `Access-Control-Allow-Origin` to your frontend origin or `*` for testing.
  - Allow required headers and methods; handle preflight (OPTIONS).

- Port conflicts / binding:
  - Locally: change `PORT` in `.env` if already in use.
  - On Render/Railway: your app must listen on `process.env.PORT`.

- Env variables not applied:
  - Restart/redeploy the service after changes.
  - Log `process.env` keys (never secrets) to verify presence.

- Cold starts / timeouts:
  - Free tiers sleep; first request may be slow. Add a health endpoint.

---

## 7) Testing API Endpoints

Use curl:
```bash
# Example: GET health
curl -i https://your-deployed-domain/health

# Example: POST create (adjust route/body to your API)
curl -i -X POST https://your-deployed-domain/api/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","value":123}'
```

Using Postman:
- Import your endpoints as a collection or create requests manually.
- Set the base URL to `http://localhost:3000` for local testing or your deployed domain in cloud.
- Add headers (Content-Type: application/json) and auth if required.

---

## Notes
- Ensure your application uses `process.env.MONGODB_URI` and `process.env.PORT`.
- If this repository exposes additional env vars, declare them similarly in each platform.
