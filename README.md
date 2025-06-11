# 🖌️ Real-Time Collaborative Whiteboard

A full-stack real-time collaborative whiteboard built with the MERN stack (React + Node.js + Express), powered by **Socket.IO** for live, multi-user collaboration. Features include real-time drawing, color and brush control, undo/redo, and image export.

---

## 🚀 Features

- 🧑‍🤝‍🧑 Multi-user collaboration using room IDs
- ⚡ Live drawing updates via WebSocket (Socket.IO)
- 🎨 Color picker and adjustable brush size
- ↩️ Undo and redo (local history)
- 🧹 Clear canvas for all users in room
- 📤 Export canvas to PNG with white background
- 🧾 Username + Room login

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express + Socket.IO
- **Deployment**:
  - Frontend: [Netlify](https://www.netlify.com/)
  - Backend: [Render](https://render.com/)

---

## 🔗 Live Links

> Replace the placeholders below with your actual links after deployment:

- 🌐 **Frontend**: [https://your-netlify-site.netlify.app](https://your-netlify-site.netlify.app)
- 🛠️ **Backend (Socket.IO Server)**: [https://your-backend.onrender.com](https://your-backend.onrender.com)

---

## 🧪 Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/29sujal/collab-whiteboard.git
cd collab-whiteboard

cd backend
npm install
node server.js

cd ../frontend
npm install
npm run dev

## 👨‍💻 Usage

Enter your username and room ID
Share the same room ID with others to draw together
Use toolbar for color, brush size, undo/redo, clear, and export

