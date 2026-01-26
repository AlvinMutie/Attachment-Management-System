# How to View AttachPro (Demo Mode)

Since we are leaving XAMPP alone for now, you can still view all the finished designs and pages by running just the "Frontend" (the website part).

---

## 🚀 Fast Track (See the Designs)
1. Open a terminal (PowerShell or Command Prompt).
2. Navigate to the `client` directory:
   ```powershell
   cd c:\Users\blueberyy\Documents\AMS\client
   ```
3. Start the preview server:
   ```powershell
   npm run dev
   ```
4. Click the link in the terminal (usually **`http://localhost:5173`**).

### What to check:
*   **Landing Page**: The very first thing you see. It matches your "AttachPro" image!
*   **Login**: Click "Login" in the top menu to see the premium glassmorphism form.
*   **Dashboards**: Because XAMPP is offline, real logging in won't work yet. However, you can jump directly to any dashboard by typing these addresses into your browser bar after it opens:
    *   `http://localhost:5173/student/dashboard`
    *   `http://localhost:5173/industry/dashboard`
    *   `http://localhost:5173/university/dashboard`
    *   `http://localhost:5173/school_admin/dashboard`
    *   `http://localhost:5173/super_admin/dashboard`

---

## Database Setup (Optional - For later)
1. Open your MySQL tool (e.g., PHPMyAdmin or MySQL Workbench).
2. Create a new database named **`ams_db`**.
   ```sql
   CREATE DATABASE ams_db;
   ```
3. Open the file **`server/.env`** in your code editor.
4. Update the `DB_USER` and `DB_PASS` to match your MySQL credentials.
   - For XAMPP: User is usually `root` and Password is empty.
   ```env
   DB_USER=root
   DB_PASS=
   ```

---

## Step 2: Initialize the Backend
1. Open a terminal (PowerShell or Command Prompt).
2. Navigate to the `server` directory:
   ```powershell
   cd c:\Users\blueberyy\Documents\AMS\server
   ```
3. Run the database sync script to create tables and sample data:
   ```powershell
   node sync.js
   ```
   *You should see "Database synced successfully" and "Super admin created".*
4. Start the backend server:
   ```powershell
   npm run dev
   ```
   *Your backend is now running on `http://localhost:5000`.*

---

## Step 3: Run the Frontend
1. Keep the first terminal running (for the backend).
2. Open a **second terminal** window.
3. Navigate to the `client` directory:
   ```powershell
   cd c:\Users\blueberyy\Documents\AMS\client
   ```
4. Start the Vite development server:
   ```powershell
   npm run dev
   ```
5. Look at the terminal output. It will give you a link, usually **`http://localhost:5173`**.
6. Open that link in your browser!

---

## Step 4: Sign In
Use the credentials created by the sync script to log in:

**Super Admin:**
- **Email:** `superadmin@ams.com`
- **Password:** `password123`

**School Admin:**
- **Email:** `schooladmin@mut.edu`
- **Password:** `password123`

---

## Common Issues
- **"Port 5000 already in use"**: Change the `PORT` in `server/.env` to something else like 5001.
- **"Unknown Database"**: Ensure you created the database in MySQL first as shown in Step 1.
