# Digital Clock - MEAN Stack Application

A full-stack digital clock application built with MongoDB, Express, Angular, and Node.js for an internal exam project. This app demonstrates a simple REST API with configurable clock settings and an Angular front-end rendering a live digital clock.

## Features
- Live digital clock display with hours, minutes, seconds
- Toggle 12-hour / 24-hour time formats
- Timezone selection and persistence
- Server-side API to get and update clock settings
- Environment-based configuration via `.env`
- Node/Express backend with MongoDB for persistence
- Angular front-end (can be served statically or via Express)

## Tech Stack
- MongoDB
- Express.js
- Angular
- Node.js

## Installation
1. Clone the repository
   ```bash
   git clone https://github.com/swamy183/digital-clock.git
   cd digital-clock
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Setup MongoDB
   - Ensure MongoDB is running locally or provide a cloud connection string
4. Create an `.env` file (see `.env.example`)
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/digitalclock
   NODE_ENV=development
   ```
5. Run the server
   ```bash
   # Development (with nodemon if configured)
   npm run dev

   # Production
   npm start
   ```

## API Endpoints
Base URL: `http://localhost:3000`

- GET `/api/clock/settings`
  - Description: Fetch current clock settings
  - Response example:
    ```json
    {
      "format": "24h",
      "timezone": "Asia/Kolkata"
    }
    ```

- POST `/api/clock/settings`
  - Description: Update clock settings
  - Request body:
    ```json
    {
      "format": "12h",
      "timezone": "UTC"
    }
    ```
  - Response: Updated settings object

## Project Structure
```
.
├── index.html             # Angular build output or static UI entry
├── server.js              # Express server and API routes
├── package.json           # Scripts and dependencies
├── .env.example           # Example environment variables
└── README.md              # Project docs (this file)
```

## How to Run
- Development: `npm run dev`
- Production: `npm start`

## Live Demo
- GitHub Pages: https://swamy183.github.io/digital-clock/
  - Note: API features require the server running; GH Pages hosts only static front-end.

## Author
- Name: Swamy (swamy183)
- GitHub: https://github.com/swamy183
- Purpose: Internal exam project demo
