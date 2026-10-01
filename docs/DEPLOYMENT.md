# BHARAT — BUILD THE CIVILIZATION
## Deployment Guide (Render, Cloud Run & Aiven)

### 1. Preparing for Production Deployment
The full-stack application is packaged so it can be deployed as a single web service or split into separate frontend and backend services.

#### Recommended: Single-Service Render Deployment
1. **Push Code to GitHub**:
   Ensure `.env` and `node_modules` are ignored (pre-configured in `.gitignore`).
2. **Create a Render Web Service**:
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start` (or `NODE_ENV=production tsx server.ts`)
3. **Configure Environment Variables in Render**:
   - `PORT`: (Render injects this automatically; `process.env.PORT` is respected)
   - `NODE_ENV`: `production`
   - `DB_HOST`: Your Aiven MySQL service host
   - `DB_PORT`: `3306` (or your Aiven port)
   - `DB_USER`: `avnadmin`
   - `DB_PASSWORD`: Your Aiven MySQL password
   - `DB_NAME`: `bharat_db` (or `defaultdb`)
   - `DB_SSL`: `true`
   - `JWT_SECRET`: A secure random secret string
   - `GEMINI_API_KEY`: Your Google Gemini API key

### 2. Testing the Deployed Application
1. **Health Check**:
   ```bash
   curl -s https://your-app.onrender.com/api/health
   ```
2. **Access Web App**:
   Navigate to `https://your-app.onrender.com` in your browser.
