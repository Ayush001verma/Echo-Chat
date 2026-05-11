# Echo Chat ⚡

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

Echo Chat is a premium, full-stack real-time messaging application featuring a modern midnight-indigo aesthetic, glassmorphism, and AI-powered writing assistance.

---

## ✨ Features

- **🎨 Premium Dark UI**: Modern midnight aesthetic with vibrant violet accents and glassmorphism.
- **⚡ AI Writing Assistant**: Integrated Gemini-powered assistant to help you craft perfect messages in various tones and languages.
- **🎥 Video Calls**: High-quality peer-to-peer video and audio calls using WebRTC.
- **👥 Group Chats**: Create groups, manage members, and chat in real-time.
- **🟢 Online Status**: Real-time presence tracking with Socket.io.
- **🖼️ Media Sharing**: Seamless image uploads powered by Cloudinary.
- **🔒 Secure Architecture**: Protected by Arcjet, Helmet, and secure JWT-based authentication.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Zustand, TailwindCSS, Lucide Icons.
- **Backend**: Node.js (Express), MongoDB (Mongoose), Socket.io.
- **AI**: Google Gemini 1.5 Flash.
- **Security**: Arcjet (Bot protection), Helmet (Security headers).
- **Communication**: WebRTC (Video signaling).

---

## 🚀 Deployment Guide (Separate Hosting)

Echo Chat is optimized for separate hosting (e.g., Vercel for Frontend and Render for Backend).

### 1. Backend Deployment (e.g., Render/Railway)

1. Connect your repository and set the Root Directory to `backend`.
2. Set the Build Command to `npm install`.
3. Set the Start Command to `npm start`.
4. Configure the following environment variables:
   - `DB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A long, random string.
   - `CLIENT_URL`: The URL of your **Frontend** (e.g., `https://echo-chat.vercel.app`).
   - `CLOUDINARY_*`: Your Cloudinary credentials.
   - `RESEND_API_KEY`: Your Resend API key.
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `ARCJET_KEY`: Your Arcjet key.

### 2. Frontend Deployment (e.g., Vercel/Netlify)

1. Connect your repository and set the Root Directory to `frontend`.
2. Set the Build Command to `npm run build`.
3. Set the Output Directory to `dist`.
4. Configure the following environment variables:
   - `VITE_API_URL`: The URL of your **Backend API** (e.g., `https://echo-api.onrender.com/api`).
   - `VITE_TURN_USERNAME`: (Optional) For WebRTC.
   - `VITE_TURN_CREDENTIAL`: (Optional) For WebRTC.

---

## 💻 Local Development

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd Echo-Chat
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env based on .env.example
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   # Create .env based on .env.example
   npm run dev
   ```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is available under the [MIT License](LICENSE).