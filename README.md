# Orbit 🛰️

📄 **Overview**

This project management platform streamlines the process of organizing tasks and managing team workspaces. The application features a modern Glassmorphism UI with interactive particle animations, ensuring a seamless workflow from user registration to real-time task tracking and collaboration.

📸 **Screenshots**

*(Add screenshots of your project here by replacing these placeholders once uploaded to the repo)*
* `![Loading Screen](./assets/loading.png)`
* `![Login/Register](./assets/auth.png)`
* `![Dashboard](./assets/dashboard.png)`

✨ **Key Features**

**Workspace Portal**
* **Workspace Access** - Easy-to-use interface for creating, browsing, and managing multiple project workspaces
* **Task Management** - Real-time tracking of tasks across 'To Do', 'In Progress', and 'Done' statuses
* **Email Notifications** - Automated custom HTML email updates for account verification and registration confirmations
* **Progress Tracking** - Convenient access to dynamic progress bars calculating task completion rates

**Admin & Collaboration**
* **Member Management** - Centralized dashboard for assigning roles and managing team members
* **User Authentication** - Oversee secure access levels and manage role-based permissions (Admin vs Member)
* **System Monitoring** - Track available workspaces and manage project deletion rights exclusively for admins

🛠️ **Tech Stack**

* **Backend:** Node.js, Express.js
* **Frontend:** React.js, HTML, CSS (Glassmorphism), JavaScript, React-TSParticles
* **Database:** MongoDB (NoSQL)
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt

🔒 **Security Features**

* Enhanced database schema with secure user credential storage (Password Hashing via Bcrypt)
* Protected user authentication and authorization via JWT verification
* Secure email verification workflow to prevent unauthorized account creation
* Data validation and route protection for admin-only functionalities

🗄️ **Database Architecture**

The application utilizes a well-structured MongoDB schema featuring:
* User management collections with encrypted credentials and role-based access
* Workspace and task tracking collections with embedded references
* Verification token management for secure email confirmations

🚀 **Workflow**

1. **User Registration/Login** - Secure account creation and authentication via email verification
2. **Dashboard Access** - Users access the main portal to view and manage their workspaces
3. **Workspace Creation** - Users create new projects and automatically receive Admin privileges
4. **Task Assignment** - Direct access to add new tasks, set priorities, and update statuses
5. **Progress Monitoring** - Users check real-time progress bars for project completion
6. **Team Collaboration** - Administrators invite new members directly to the shared workspace

⚙️ **Local Setup & Installation**

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/madhusanka77/Orbit-Project-Management-System.git](https://github.com/madhusanka77/Orbit-Project-Management-System.git)

   ## 💡 Future Enhancements

* 💬 **Real-time Chat:** Chat support between workspace members for better collaboration.
* 📎 **File Management:** File upload functionality for users to attach documents to tasks.
* 📅 **Smart Reminders:** Deadline reminders and calendar integrations for coursework/projects.
* 📱 **Mobile App:** Mobile application development for Android/iOS.

---

## 👨‍💻 Author & Contact

Developed with ❤️ by **Pathum Madhusanka**.

📫 For queries or support regarding this project, please reach out through **GitHub Issues** or contact the developer directly.