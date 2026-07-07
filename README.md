# 💎 DecisionHub

DecisionHub is a premium, modern web application designed to help individuals and teams navigate complex choices, gather consensus through interactive polls, and track the outcomes of their decisions.

Built with a stunning **dark-mode, glassmorphism, and neon aesthetic**, DecisionHub makes the process of making tough choices visually engaging, structured, and collaborative.

---

## ✨ Key Features

- 📊 **Smart Decision Boards:** Organize, track, and filter your decisions. Use the global search bar to instantly find decisions by title, tag, or status.
- 🗳️ **Interactive Polls:** Democratize your decision-making! Create dynamic polls, gather votes from your team or community, and analyze the consensus.
- 👥 **Community Hubs:** Join tailored discussion groups, collaborate with peers on shared challenges, and tap into collective intelligence.
- ⚙️ **Dynamic Preferences:** A fully functional, state-driven Settings dashboard allowing users to customize their Account, Privacy, Notifications, and Appearance.
- 🎨 **Premium UI/UX:** Features a fully custom 3D isometric "data core" logo, a sleek collapsible sidebar, smooth page transitions, and beautiful hover micro-animations.

---

## 🛠️ Technology Stack

**Frontend**
- **Framework:** React 18 (built with Vite for lightning-fast HMR)
- **Routing:** React Router DOM v6
- **Styling:** Pure vanilla CSS utilizing CSS Variables for dynamic theming, glassmorphism (`backdrop-filter`), and complex SVGs.
- **Icons:** Lucide React

**Backend**
- Located in the `/backend` directory (infrastructure in development).

---

## 📂 Repository Structure

This repository is set up as a monorepo containing both the client and server code:

```text
DecisionHub/
├── frontend/       # The React application (UI, routing, state)
│   ├── src/        # Pages, Components, Layouts, and Contexts
│   ├── public/     # Static assets including the custom 3D isometric SVG logo
│   └── index.css   # Core design system and global aesthetic tokens
├── backend/        # Server-side logic and database models
└── README.md       # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to run the DecisionHub frontend locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd DecisionHub
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **View the App:**
   Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

---

## 🎨 Design Philosophy

DecisionHub was designed with the principle that **utility shouldn't be boring**. We moved away from generic corporate dashboards and instead implemented a highly customized, cyber-inspired aesthetic. From the custom-drawn SVG logos to the glowing interactive buttons, every element was crafted to provide a "wow" factor while remaining completely functional and accessible.

---

*Built with ❤️ for better decision making.*
