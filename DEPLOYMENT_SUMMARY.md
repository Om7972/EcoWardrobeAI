# EcoWardrobe AI - Deployment Summary

This guide outlines the steps to deploy the frontend of your application to **Netlify** and the backend to **Render**.

---

## 1. Backend Deployment (Render)

Deploy the backend as a **Web Service** on Render.

### Configuration Settings:
* **Root Directory**: `.` (or leave empty)
* **Build Command**: `npm install && npm run build:server`
* **Start Command**: `npm start`
* **Environment Variables**:
  Go to the **Environment** tab of your Render Web Service and add the following variables:
  
  | Variable Name | Description | Example / Fallback |
  | :--- | :--- | :--- |
  | `NODE_ENV` | Environment mode | `production` |
  | `JWT_SECRET` | Secret key for JWT auth tokens | *Choose a strong random string* |
  | `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://...` |
  | `GEMINI_API_KEY` | Google Gemini API Key | *Your API Key* |
  | `GROQ_API_KEY` | Groq API Key | *Your API Key* |
  | `ANTHROPIC_API_KEY`| Anthropic Claude API Key | *Your API Key* |
  | `OPENAI_API_KEY` | OpenAI API Key | *Your API Key* |
  | `OPENWEATHER_API_KEY`| OpenWeather API Key | *Your API Key* |
  | `GOOGLE_CALENDAR_API_KEY`| Google Calendar API Key | *Your API Key* |

---

## 2. Frontend Deployment (Netlify)

Deploy the frontend as a static SPA on Netlify.

### Configuration Settings:
* **Repository**: Select your GitHub repository
* **Base Directory**: `.` (or leave empty)
* **Build Command**: `npm run build:client`
* **Publish Directory**: `dist/spa`
* **Environment Variables**:
  Add the following variable in Netlify's **Site configuration** -> **Environment variables**:

  | Variable Name | Description | Example |
  | :--- | :--- | :--- |
  | `VITE_API_URL` | The URL of your live Render backend API | `https://your-backend.onrender.com/api` |

### SPA Routing & Redirects:
The project is already pre-configured with a `netlify.toml` file in the root to handle React Router client-side routing. If you prefer to avoid CORS configuration entirely, you can uncomment the API proxy block in `netlify.toml` and direct it to your Render URL.
