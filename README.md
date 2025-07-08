# **SubTrack - Subscription Management API**  


**SubTrack** is a simple yet powerful Express.js API for tracking user subscriptions (e.g., Netflix, Spotify, SaaS). It helps users monitor recurring payments, avoid forgotten charges, and manage budgets effectively.  

*(Since this is your first Express project, I kept the structure clean and beginner-friendly!)*  

---

## **🚀 Key Features**  
✅ **User Authentication** – Secure signup/login (JWT)  
✅ **CRUD Subscriptions** – Add, edit, delete, and track subscriptions  
✅ **Payment Alerts** – Notify users of upcoming renewals  
✅ **Basic Analytics** – Monthly spending insights  
✅ **Rate-Limited API** – Tested with **HTTPie** & **Arject**  

---

## **🛠️ Tech Stack**  
- **Backend**: Node.js (Express)  
- **Database**: MongoDB (Mongoose)  
- **Authentication**: JWT  
- **Rate Limiting**: `express-rate-limit`  
- **Testing**: HTTPie (manual), Postman (optional)  
- **Project Structure**: MVC-like (beginner-friendly)  

---

## **📂 Project Structure**  
```plaintext
SubTrack/
├── config/           # DB & environment setup
├── controllers/      # Logic (users, subscriptions)
├── models/           # MongoDB schemas (User, Subscription)
├── routes/           # API endpoints
├── middleware/       # Auth & rate-limiting
├── utils/            # Helpers (error handling, emails)
└── app.js            # Main entry point
```

---

## **🔌 Core API Endpoints**  
| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| POST   | `/api/auth/signup`        | Register new user                    |
| POST   | `/api/auth/login`         | Login (returns JWT)                  |
| POST   | `/api/subscriptions`      | Add a new subscription               |
| GET    | `/api/subscriptions`      | List all user’s subscriptions        |
| PUT    | `/api/subscriptions/:id`  | Update a subscription                |
| DELETE | `/api/subscriptions/:id`  | Cancel a subscription                |

*(Full API docs in `API_DOCS.md`—customize later!)*  

---

## **⚙️ Setup Guide**  

### **1. Clone & Install**  
```bash
git clone https://github.com/yourusername/SubTrack.git
cd SubTrack
npm install express mongoose jsonwebtoken express-rate-limit dotenv
```

### **2. Configure Environment**  
Create `.env` (use `.env.example` template):  
```env
MONGODB_URI=mongodb://localhost:27017/subtrack
JWT_SECRET=your_secret_key_here
RATE_LIMIT_WINDOW_MS=15*60*1000  // 15 minutes
RATE_LIMIT_MAX=100               // 100 requests/window
```

### **3. Run the Server**  
```bash
node app.js
```
→ Access API at `http://localhost:3000`  

---

## **🧪 Testing the API**  
- **Manual Testing with HTTPie**:  
  ```bash
  # Signup
  http POST :3000/api/auth/signup name=Alice email=alice@test.com password=123456

  # Add subscription
  http POST :3000/api/subscriptions name=Netflix price=15.99 category=entertainment \
    Authorization:"Bearer <your_jwt_token>"
  ```

- **Rate-Limit Testing**:  
  Use **Arject** or bombard endpoints with HTTPie to test throttling.  

---

## **📜 License**  
MIT License (free to modify/use).  

---

## **💡 Tips for Your First Express Project**  
1. **Error Handling**: Add `express-async-errors` to avoid try/catch hell.  
2. **Validation**: Use `express-validator` for robust input checks.  
3. **Logging**: Add `morgan` for HTTP request logging.  

---

## **📬 Need Help?**  
- **Issues?** Open a GitHub ticket.  
- **Want to contribute?** PRs welcome!  

---

🌟 **Happy coding!** 🌟  
