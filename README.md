# Vintage Car Forum

A full-stack forum app (MERN): users can register/login, browse categories, ask questions (must end with `?`), and answer via a modal. Includes category filtering and pagination (“Load more”).

---

## 🚀 Demo Account

After seeding (see instructions below), you can log in with:

```
Email: demo@example.com  
Password: Passw0rd!
```

Or register your own account.

---

## 🛠 Tech Stack

- **Frontend:** React, React Router  
- **Backend:** Node.js, Express  
- **Database:** MongoDB Atlas  
- **Auth:** JWT (with bcrypt password hashing)  

---

## 📂 Repository Structure

```
vintage_car_forum/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   │   └── resetDemo.js
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js (LTS recommended)  
- MongoDB Atlas cluster (or a local MongoDB instance)  

---

## 🔧 1. Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<db-name>?retryWrites=true&w=majority
JWT_SECRET=changeme
```

### 3. (Optional) Seed demo data
```bash
node seed.js
```

You should see logs like:
```
[seed] Mongo connected
[seed] created demo user: demo@example.com
[seed] complete.
```

To force-reset the demo user at any time:
```bash
node scripts/resetDemo.js
```

### 4. Run the API
```bash
npx nodemon server.js
```
Backend runs at: [http://localhost:5000](http://localhost:5000)

---

## 🎨 2. Frontend Setup

### 1. Install dependencies
```bash
cd ../frontend
npm install
```

### 2. Run the app
```bash
npm start
```

Frontend runs at: [http://localhost:3000](http://localhost:3000)  

The frontend talks to the backend at `http://localhost:5000/api`.

---

## 🧪 Usage Flow

1. **Login** with the demo credentials above or register a new account.  
2. **Dashboard** shows:
   - Username and Logout (top-right)  
   - Scrollable list of categories (left)  
   - Questions feed with pagination (right)  
3. **Filter by category** by clicking a category.  
4. **Add a question**:
   - Must end with `?` (client + server validation)  
   - Appears at the top of the list for that category  
5. **Open a question** → **Answer** button opens a modal:
   - Empty answers are blocked  
   - Valid answers close the modal and appear in the list with username + timestamp  
6. **Logout** returns to the login screen.  

---

## 🧹 Code Quality

This project uses **ESLint + Prettier** to keep the codebase consistent.

- Check lint errors:
  ```bash
  cd frontend
  npm run lint
  ```

- Auto-fix issues:
  ```bash
  npm run lint:fix
  ```

- Format code:
  ```bash
  npm run format
  ```
  

---

## 🐛 Troubleshooting

- **MongoDB “not whitelisted”**  
  Add your current IP in MongoDB Atlas → *Network Access*.  
  For quick dev, you can allow `0.0.0.0/0` (all IPs).  

- **Ports busy**  
  - Backend uses `5000`  
  - Frontend uses `3000`  
  Stop conflicting processes or allow CRA to choose another port.  

- **Invalid credentials**  
  - Use demo creds (`demo@example.com / Passw0rd!`)  
  - Or register a new account  
  - If demo creds don’t work, run:  
    ```bash
    cd backend
    node scripts/resetDemo.js
    ```  

- **CORS issues**  
  Backend has CORS enabled for `http://localhost:3000`.  
  If you change frontend port/origin, update backend CORS settings.  

---

## 🔒 Notes

- Passwords are hashed with **bcrypt** before storing.  
- JWT is stored in **localStorage** for simplicity.  
- In production, httpOnly cookies are recommended for security.  
- Backend mirrors frontend validation (e.g., question must end with `?`).  

---
