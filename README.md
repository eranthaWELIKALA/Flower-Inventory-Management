# Flower Inventory Management

A comprehensive flower inventory management system available as both a web application and desktop application.

## 🌸 Features

- Complete flower inventory management
- Sales tracking and reporting
- Supplier management
- User authentication
- Real-time stock updates
- Beautiful, responsive UI

## 🖥️ Desktop Application

This project now includes a desktop version built with Electron! See [DESKTOP_README.md](./DESKTOP_README.md) for desktop-specific instructions.

### Quick Start (Desktop)

```bash
# Install dependencies
npm install
cd server && npm install

# Set up database
cd server
npx prisma generate
npx prisma migrate dev --name init

# Run desktop app
cd client
npm run dev
```

## 🌐 Web Application

### Backend Setup

1. Copy `server/.env.example` to `server/.env` and update `DATABASE_URL`.
2. From `server/` run:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Frontend Setup

The frontend expects `VITE_API_BASE` environment variable (defaults to `http://localhost:4000/api`).

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + Prisma + MySQL
- **Desktop**: Electron (optional)
- **Database**: MySQL with Prisma ORM
