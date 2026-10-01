# BHARAT — Build the Civilization
## Aiven MySQL Cloud Database Setup Guide

This guide walks you through connecting **Aiven MySQL** to your **BHARAT — Build the Civilization** full-stack application.

---

### Step 1: Create a Free/Trial Aiven MySQL Service
1. Go to the [Aiven Console](https://console.aiven.io/) and sign up or log in.
2. Click **Create Service**.
3. Select **MySQL** as the service type.
4. Choose your cloud provider and region (e.g. AWS or Google Cloud closest to your location, such as `asia-south1` Mumbai).
5. Choose a plan (the **Free** or **Startup** plan is ideal for student hackathon prototypes).
6. Give your service a name (e.g., `bharat-mysql-service`) and click **Create Service**.
7. Wait ~2 minutes for the service state to turn from `Rebuilding` to **Running**.

---

### Step 2: Retrieve Your Database Credentials
On the service **Overview** tab, copy the following parameters:
- **Host**: e.g., `bharat-mysql-service-yourproject.aivencloud.com`
- **Port**: e.g., `12345` (or default `3306`)
- **User**: `avnadmin`
- **Password**: Click *Show* and copy the generated password.
- **Database Name**: `defaultdb` (or create a new database named `bharat_db` under the *Databases* tab).
- **SSL Mode**: Aiven requires SSL connections. `mysql2/promise` in this project is preconfigured with `ssl: { rejectUnauthorized: false }` for instant compatibility.

---

### Step 3: Configure Environment Variables
Create a `.env` file in the project root directory (do not commit this file to Git):

```bash
# In your local .env file:
PORT=3000
DB_HOST=your-mysql-service-name.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=your_actual_password_here
DB_NAME=defaultdb
DB_SSL=true
JWT_SECRET=super_secret_jwt_key_sih2026
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### Step 4: Run the Database Schema
You can initialize the tables in one of two easy ways:

#### Option A: Using the Aiven Web Console
1. In the Aiven Console, select your MySQL service.
2. Click on the **Query Editor** tab.
3. Open `database/schema.sql` from this repository.
4. Copy and paste the SQL content into the query editor and click **Run**.

#### Option B: Using MySQL CLI
```bash
mysql -h your-mysql-service-name.aivencloud.com -P 12345 -u avnadmin -p defaultdb < database/schema.sql
```

---

### Step 5: Test the Connection
Start the server and check the backend health status:
```bash
npm run dev
```
Open your browser to:
```
http://localhost:3000/api/health
```
You should see:
```json
{
  "success": true,
  "server": "ok",
  "database": "connected",
  "ai": "ready"
}
```

*Note: If Aiven MySQL is not configured yet, the game smoothly enables a local offline mode, so you can continue playing and testing without server interruption!*
