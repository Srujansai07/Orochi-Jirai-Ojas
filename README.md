# Jirai - AI-Powered Mind Mapping Tool

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Flow-11-purple?style=for-the-badge" alt="React Flow" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-cyan?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
</div>

---

## 🎯 Overview

**Jirai** is a modern, AI-powered mind mapping and workflow management tool. Built with Next.js 14, it offers a beautiful, responsive interface for organizing thoughts, managing tasks, and visualizing ideas.

---

## ✨ Features

### 🗺️ Mind Mapping Canvas
- **7 Node Types**: Text, Task, Person, Link, YouTube, File, Group
- **Drag & Drop**: Intuitive node placement and connection
- **Custom Styling**: Gradient colors, animations, and shadow effects
- **Mini Map**: Navigate large canvases easily

### 📅 Timeline View
- **Multiple Zoom Levels**: Day, Week, Month views
- **Task Scheduling**: Visual task timeline management
- **Combined View**: Side-by-side canvas and timeline

### 🤖 AI Chat (Mock)
- **Built-in AI Assistant**: Get suggestions for your mind maps
- **Context-Aware**: Understands your workspace content

### 🔐 Authentication
- **Simple Auth**: localStorage-based (no email verification needed)
- **Instant Signup**: Create account and start immediately

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| State | Zustand |
| Canvas | React Flow |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Srujansai07/Orochi-Jirai-Ojas.git

# Navigate to project
cd Orochi-Jirai-Ojas

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Login & Signup pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── components/
│   ├── canvas/            # React Flow canvas
│   ├── chat/              # AI chat panel
│   ├── command/           # Command palette (Ctrl+K)
│   ├── editor/            # Node editor dialog
│   ├── layout/            # App layout, sidebar, header
│   ├── nodes/             # 7 custom node types
│   ├── timeline/          # Timeline view
│   ├── ui/                # shadcn/ui components
│   └── views/             # Combined view
├── lib/                   # Utilities
│   ├── mock-auth.ts       # Mock authentication
│   └── utils.ts           # Helper functions
├── store/                 # Zustand stores
└── types/                 # TypeScript types
```

---

## 🎨 Screenshots

### Login Page
Beautiful gradient design with glass effects and animations.

### Mind Map Canvas
Drag-and-drop nodes with custom styling and connections.

### Timeline View
Visual task scheduling with day/week/month views.

---

## 📝 Usage

1. **Sign Up**: Create an account (no email verification)
2. **Add Nodes**: Click "Add Node" button to create nodes
3. **Connect Nodes**: Drag from node handles to create connections
4. **Edit Nodes**: Double-click any node to edit
5. **Switch Views**: Use sidebar to switch between Analysis, Workflow, and Combined


---

## 👨‍💻 Author

**Srujansai07**

---

## 📄 License

This project is for educational purposes.

---

<div align="center">
  <p>Built with ❤️ using Next.js and React Flow</p>
</div>
