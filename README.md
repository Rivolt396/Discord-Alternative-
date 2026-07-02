# Discord Alternative 🚀

A modern, real-time communication platform built with React, Node.js, and WebSockets - offering an open-source alternative to Discord.

## ✨ Features

- ✅ **Real-time Chat** - Instant messaging with WebSocket support
- ✅ **Server/Channel System** - Organize conversations by servers and channels  
- ✅ **User Authentication** - Secure JWT-based authentication with bcrypt
- ✅ **Typing Indicators** - See when users are typing in real-time
- ✅ **Voice Ready** - Architecture prepared for WebRTC voice/video calls
- ✅ **Dark Theme UI** - Discord-inspired beautiful dark interface
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Docker Support** - Easy deployment with Docker Compose
- ✅ **CI/CD Pipeline** - GitHub Actions automated testing and builds

## 🛠 Tech Stack

### Backend
- **Node.js 18+** with Express.js
- **Socket.io** for real-time bidirectional communication
- **MongoDB** for data persistence
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **TypeScript** for type safety
- **Pino** for structured logging

### Frontend
- **React 18** with TypeScript
- **Zustand** for lightweight state management
- **Socket.io Client** for real-time updates
- **Vite** for lightning-fast development
- **Lucide Icons** for beautiful UI icons
- **React Router** for client-side navigation
- **Axios** for API requests

## 📋 Prerequisites

- Node.js 18+
- npm 8+ or yarn
- Docker & Docker Compose (optional)
- MongoDB (included in docker-compose)

## 🚀 Quick Start

### Development Setup (Local)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rivolt396/Discord-Alternative-.git
   cd Discord-Alternative-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   Opens:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Docker Deployment

1. **Build and run**
   ```bash
   docker-compose up --build
   ```

2. **Access**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

## 📁 Project Structure

```
Discord-Alternative-/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── index.ts              # Server entry point
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts           # Authentication routes
│   │   │   │   ├── users.ts          # User profile routes
│   │   │   │   └── servers.ts        # Server management routes
│   │   │   ├── websocket/
│   │   │   │   └── handlers.ts       # Socket.io event handlers
│   │   │   └── utils/
│   │   │       ├── jwt.ts            # JWT utilities
│   │   │       └── logger.ts         # Logging setup
│   │   ├── .env.example
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── main.tsx              # React entry point
│       │   ├── App.tsx               # Main app component
│       │   ├── index.css             # Global styles
│       │   ├── pages/
│       │   │   ├── Login.tsx
│       │   │   ├── Register.tsx
│       │   │   └── Dashboard.tsx
│       │   ├── components/
│       │   │   ├── ChatWindow.tsx
│       │   │   ├── MessageInput.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── PrivateRoute.tsx
│       │   └── store/
│       │       ├── authStore.ts
│       │       └── chatStore.ts
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json
├── .github/workflows/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
```

### Users
```
GET    /api/users/:userId
PUT    /api/users/:userId
```

### Servers
```
GET    /api/servers
POST   /api/servers
GET    /api/servers/:serverId
```

## 🗺 Roadmap

- [ ] Voice Chat (WebRTC)
- [ ] Video Calling
- [ ] Message History
- [ ] File Sharing
- [ ] User Mentions & Notifications
- [ ] Message Reactions
- [ ] Admin Panel
- [ ] Role-based Permissions
- [ ] Message Encryption
- [ ] Mobile App

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/discord-alternative
JWT_SECRET=your-secret-key
LOG_LEVEL=info
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License

## 🙌 Support

- 📖 [Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/Rivolt396/Discord-Alternative-/issues)

---

**Built with ❤️ by Rivolt396**

⭐ **If you find this helpful, please star this repository!**
