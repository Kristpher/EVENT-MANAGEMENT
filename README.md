# 🎯 Event Management System

An event management web application designed specifically for colleges or organizations to manage event creation, registration, approvals, and participant management.  
This project is built targeting my college to simplify event handling for students, organizers, and administrators.

---

## ✨ Features

- 🔸 Organizer-wise event listing
- 🔸 Event creation with participant limits
- 🔸 Event registration system with live tracking
- 🔸 Admin approval for events
- 🔸 Venue availability check before booking
- 🔸 Search and filter events by name or organizer and Students
- 🔸 Interested/Registered status tracking
- 🔸 User-friendly interface for students and organizers
- 🔸 Notification system 

---

## 💻 Tech Stack

- **Frontend:** React.js, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)


---

## 🚀 Installation & Setup

- Clone the repository
- git clone https://github.com/your-username/your-repository.git
- cd your-repository

### Install frontend dependencies
- cd frontend
- npm install

### Install backend dependencies
- cd ../backend
- npm install

- Create .env file in backend
- PORT=5000
- MONGO_URL=your_mongodb_connection
- JWT_SECRET=your_secret_key
- ADMIN_EMAIL
- ADMIN_PASSWORD

### Start backend
- cd ../backend
- node index.js

### Start frontend (open a new terminal)
- cd ../frontend
- npm start

### 📦 Backend Dependencies
- express – server framework
- mongoose – MongoDB object modeling
- cors – handle cross-origin requests
- dotenv – environment variables
- multer – file/image upload handling
- jsonwebtoken – JWT authentication
- bcryptjs – password hashing
- path – Node.js built-in (file paths)
- fs – Node.js built-in (file system)

### install all dependencies
- npm install express mongoose cors dotenv multer jsonwebtoken bcryptjs
<pre> ## 📁 Folder Structure ``` Event-Management/ ├── backend/ # Backend (Node + Express + MongoDB) │ ├── index.js # Main backend file │ ├── .env # Environment variables (not pushed to GitHub) │ └── package.json # Backend dependencies ├── frontend/ # Frontend (React) │ ├── src/ │ │ ├── components/ # Reusable UI components │ │ ├── pages/ # Different screens/pages │ │ ├── App.js # App root │ │ └── index.js # Entry point │ └── package.json # Frontend dependencies ├── .gitignore ├── README.md ``` </pre>


## 🙌 Acknowledgements
- React.js
- Node.js & Express.js
- MongoDB

## 🔗 Author
- Made with by Navaneeth DS
- GitHub: https://github.com/kristpher

