# AI Assignment Organizer

A hackathon project that uses AI to organize student assignments from Gmail, categorize them, estimate time, and provide focus mode.

## Features

- Google OAuth authentication
- Automatic assignment extraction from user's Gmail, **specifically Google Classroom emails**
- AI-based categorization (field visit, report, research, coding, presentation)
- Time estimation
- Dashboard with progress tracking
- Focus mode timer
- **PDF attachment detection** for Classroom assignments

## Tech Stack

- Backend: Node.js, Express, MongoDB, Google Gemini AI, Gmail API, Passport.js
- Frontend: React, Vite, Axios

## Setup

1. Clone the repository
2. Set up MongoDB (local or Atlas)
3. Configure environment variables in backend/.env
4. Install dependencies for backend and frontend
5. Run backend: `npm run dev` in backend/
6. Run frontend: `npm run dev` in frontend/

## Environment Variables

Create backend/.env with:

```
MONGO_URI=mongodb://localhost:27017/ai-assignment-organizer
PORT=5000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GMAIL_CLIENT_ID=YOUR_GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET=YOUR_GMAIL_CLIENT_SECRET
GMAIL_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

## Google Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to .env

## Usage

- Login with Google
- Fetch assignments from Gmail
- Add assignments manually
- AI analyzes and categorizes assignments
- Start focus mode for timed work sessions</content>
<parameter name="filePath">/home/vaishnavsk/ai-assignment-organizer/README.md