<h1 align="center"> 📊 Academic ERP Nexus </h1>
<p align="center"> A Comprehensive, Role-Based Management Ecosystem for Modern Educational Institutions </p>

<p align="center">
  <img alt="Build" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge">
  <img alt="Issues" src="https://img.shields.io/badge/Issues-0%20Open-blue?style=for-the-badge">
  <img alt="Contributions" src="https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>
<!-- 
  **Note:** These are static placeholder badges. Replace them with your project's actual badges.
  You can generate your own at https://shields.io
-->

## 📑 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Academic ERP Nexus** is a sophisticated, full-stack enterprise resource planning solution designed specifically to bridge the gap between administrators, educators, and students. By centralizing institutional data and providing role-specific interfaces, the system transforms complex academic workflows—such as batch scheduling, room allocation, and attendance tracking—into streamlined, digital processes.

> Educational institutions often struggle with fragmented data management. Schedules are kept in spreadsheets, attendance in paper registers, and student records in siloed databases. This fragmentation leads to administrative overhead, scheduling conflicts, and a lack of real-time visibility into institutional health. **Academic ERP Nexus** provides a "single source of truth" that harmonizes these disparate elements into a cohesive digital ecosystem.

The solution empowers institutions by automating the heavy lifting of academic management. From an administrator orchestrating the entire facility's resources to a teacher marking attendance in seconds, the platform focuses on reducing "busy work" so that the focus remains on what truly matters: **Education.** Built with a robust **Component-based Architecture** using **React** and **Express**, the system ensures high performance, real-time synchronization via **Socket.io**, and a highly intuitive user experience.

---

## ✨ Key Features

### 🏛️ Administrative Command Center
Administrators serve as the backbone of the institution. The ERP provides them with comprehensive tools to manage the lifecycle of every entity within the system.
- **Resource Management:** Add and manage physical rooms and facilities to prevent scheduling conflicts.
- **Faculty Oversight:** Centralized management of teacher profiles, credentials, and assignments.
- **Student Lifecycle:** Complete control over student registrations and data management.
- **Academic Structuring:** Dynamically create batches, define subjects, and link them to the appropriate teachers and rooms.

### 👩‍🏫 Teacher Empowerment Suite
The system provides educators with a focused interface to manage their daily academic responsibilities without administrative friction.
- **Digital Attendance:** A streamlined interface to mark and track student attendance in real-time.
- **Batch Management:** Access to detailed batch information, ongoing schedules, and student rosters.
- **Student Monitoring:** Detailed views of students enrolled in specific subjects to monitor progress and engagement.
- **Syllabus Control:** Edit and update batch syllabi to keep students informed of academic progress.

### 🎓 Student Engagement Portal
Students benefit from a personalized dashboard that provides clarity on their academic journey.
- **Course Enrollment:** An intuitive subject enrollment system allowing students to register for their required curriculum.
- **Academic Tracking:** View current batches, enrolled subjects, and personal progress through a dedicated dashboard.
- **Real-time Notifications:** Stay updated with institutional changes via integrated socket listeners.

### 🛠️ Core System Capabilities
- **Role-Based Access Control (RBAC):** Secure, protected routes ensure that users only access data pertinent to their role (Admin, Teacher, or Student).
- **Interactive UI/UX:** A polished interface featuring custom modals for data entry, success/error status updates, and dynamic loading states.
- **Real-time Sync:** Powered by Socket.io, the system ensures that updates to schedules or attendance are reflected across the platform without manual refreshes.

---

## 🛠️ Tech Stack & Architecture

Academic ERP Nexus utilizes a modern, decoupled architecture to ensure scalability and maintainability.

| Technology | Purpose | Why it was Chosen |
| :--- | :--- | :--- |
| **React** | Frontend UI | Component-based structure allows for reusable UI elements across Student, Teacher, and Admin portals. |
| **Express** | Backend Logic | Provides a lightweight, high-performance environment for handling API requests and business logic. |
| **TypeScript** | Primary Language | Ensures type safety across the entire stack, reducing runtime errors and improving developer productivity. |
| **Mongoose** | Data Modeling | Offers a schema-based solution to model application data, ensuring data integrity within MongoDB. |
| **Socket.io** | Real-time Events | Enables bi-directional, event-based communication for instant updates across the network. |
| **Vite** | Build Tooling | Provides an extremely fast development environment and optimized production builds for the frontend. |

### Architecture Overview
The system follows a **Service-Oriented Architecture** pattern within the backend and a **Context-API driven state management** on the frontend. This ensures that user authentication and theme preferences are globally accessible while keeping individual components decoupled and easy to test.

---

## 📁 Project Structure

```
Anshuman-sharma2006-ERP-System/
├── 📁 frontend/                   # React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 assets/             # Images, SVGs, and brand assets
│   │   ├── 📁 components/         # Reusable UI components (Modals, Layout, Loaders)
│   │   ├── 📁 context/            # AppProvider, ThemeProvider, UserContext
│   │   ├── 📁 pages/              # Role-specific views (Admin, Teacher, Student, Common)
│   │   ├── 📁 routes/             # Protected and Public route definitions
│   │   ├── 📁 services/           # API call definitions and Socket setup
│   │   └── 📁 utils/              # Application constants and helpers
│   ├── 📄 vite.config.ts          # Vite configuration
│   └── 📄 tsconfig.json           # TypeScript configuration
├── 📁 backend/                    # Express Backend API
│   ├── 📁 src/
│   │   ├── 📁 configs/            # Database and Socket connection setups
│   │   ├── 📁 middleware/         # Routing and security middleware
│   │   ├── 📁 models/             # Mongoose DB schemas (Batch, Room, Subject, User)
│   │   ├── 📁 routes/             # API endpoints grouped by role (Admin, Teacher, Student)
│   │   ├── 📁 utils/              # ID generation and helper utilities
│   │   ├── 📄 app.ts              # Express application configuration
│   │   └── 📄 server.ts           # Server entry point
│   ├── 📄 nodemon.json            # Development server configuration
│   └── 📄 package.json            # Backend dependencies
└── 📄 .gitignore                  # Git exclusion rules
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** Ensure you have the latest LTS version installed.
- **TypeScript:** The project uses TS for both frontend and backend.
- **Package Manager:** `npm` or `yarn` is required.

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Anshuman-sharma2006/ERP-System.git
   cd ERP-System
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file based on the configurations required (DB Connection)
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

---

## 🔧 Usage

### 🔐 Authentication
- Users must first **Sign Up** and select their appropriate role.
- Existing users can **Sign In** to access their role-specific dashboard.
- Secure **Logout** functionality is available in the common settings.

### 🛠️ Administrative Tasks
- **Creating Rooms:** Navigate to the "Rooms" section to register physical classroom spaces.
- **Faculty Management:** Use the "Teachers" page to add new faculty members to the system.
- **Batch Orchestration:** Create batches by linking a teacher, a room, and a set of subjects.

### 📝 Academic Workflow
- **Attendance:** Teachers can select their "Ongoing Batches" and mark attendance for the students present.
- **Subject Enrollment:** Students can browse available subjects and enroll themselves into specific modules.
- **Profile Customization:** All users can access "Settings" to manage their profile and appearance (Theme).

---

## 🤝 Contributing

We welcome contributions to improve the Academic ERP Nexus! Whether you're fixing a bug or adding a new module, your help is appreciated.

### How to Contribute

1. **Fork the repository** - Click the 'Fork' button at the top right of this page
2. **Create a feature branch** 
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** - Ensure code quality and type safety
4. **Test thoroughly** - Verify that your changes don't break role-based routing
5. **Commit your changes** 
   ```bash
   git commit -m 'Add: New feature implementation'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** - Describe your changes in detail

### Development Guidelines
- ✅ Follow the established TypeScript patterns.
- 📝 Document any new API endpoints in the services folder.
- 🧪 Use the existing `Clockloader` or `Cliploader` for async operations.
- 🎯 Keep components atomic and reusable.

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### What this means:
- ✅ **Commercial use:** You can use this project commercially.
- ✅ **Modification:** You can modify the code.
- ✅ **Distribution:** You can distribute this software.
- ✅ **Private use:** You can use this project privately.
- ⚠️ **Liability:** The software is provided "as is", without warranty.

---

<p align="center">Made with ❤️ for Better Education Management</p>
<p align="center">
  <a href="#">⬆️ Back to Top</a>
</p>
