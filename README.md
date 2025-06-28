# 🍽️ Recipe API - User Auth + CRUD

A secure and extensible RESTful API for recipe sharing, built with **Express.js**, **MongoDB**, and **JWT Authentication**.

## 🚀 Features

- 🔐 User registration and login with hashed passwords
- 🧾 JWT-based route protection
- 📦 CRUD operations for recipes
- 🧑‍🍳 Recipes categorized, rated, and timestamped
- ⚙️ Scalable MongoDB Atlas integration



## 🔐 Environment Variables (`.env`)

```env
DB_USER=your_db_username
DB_PASSWORD=your_db_password
SECRET_KEY=your_secret_key
PORT=5000
```

# 1. Clone the repo
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. Install dependencies
npm install

# 3. Add your .env file with proper credentials

# 4. Run the server
node server.js
🔑 Auth
POST /api/auth/register → Register user

POST /api/auth/login → Login and receive JWT

📚 Recipes (Protected)
Requires Authorization: Bearer <token> header.

POST /api/r → Create recipe

GET /api/r → Get all recipes

GET /api/r/:rId → Get recipe by ID

DELETE /api/r/:rId → Delete recipe by ID

Sample Recipe JSON

```
{
  "title": "Pasta Carbonara",
  "category": "Main Course",
  "ingredients": "Spaghetti, Eggs, Parmesan, Pancetta",
  "instructions": "Boil pasta. Fry pancetta. Mix eggs and cheese. Combine all.",
  "author": "chef@example.com",
  "rating": 4.5
}
```
