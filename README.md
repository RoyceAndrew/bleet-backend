# Bleet Backend

🔗 Repo: https://github.com/RoyceAndrew/bleet-backend  

---

## Overview
Express + Prisma API for Bleet (Twitter clone).  
Key features:
- User registration (email verification)  
- Email/password login + Google OAuth (via Supabase → custom JWT)  
- JWT-based authentication (HttpOnly cookie)  
- CRUD for posts, likes, comments, reports  
- Follow/unfollow users  
- Profile photo/banner upload (Multer → cloud storage)  
- Real-time “Recent Posts” via Server-Sent Events (SSE)

---

## Tech Stack
- **Node.js** & **Express.js**  
- **Prisma ORM** → PostgreSQL (Supabase)  
- **JWT** (jsonwebtoken)  
- **Multer** (file uploads)  
- **Nodemailer** (email)  
- **uuid** (verification tokens)  
- **validator** (input validation)

---
