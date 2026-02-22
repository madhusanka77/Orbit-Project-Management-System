<img width="1892" height="872" alt="Screenshot 2026-02-22 232828" src="https://github.com/user-attachments/assets/88686967-c660-4ae5-bedd-559bf4c5f2f3" /># Orbit 🛰️

📄 **Overview**

This project management platform streamlines the process of organizing tasks and managing team workspaces. The application features a modern Glassmorphism UI with interactive particle animations, ensuring a seamless workflow from user registration to real-time task tracking and collaboration.

📸 **Screenshots**
<img width="1918" height="867" alt="Screenshot 2026-02-22 232734" src="https://github.com/user-attachments/assets/546406a2-bab4-4d71-9040-896f64d50548" />
<img width="1892" height="872" alt="Screenshot 2026-02-22 232828" src="https://github.com/user-attachments/assets/540a4c5b-8aa1-46f4-90f0-5eb9405c17d8" />
<img width="1920" height="867" alt="Screenshot 2026-02-22 232924" src="https://github.com/user-attachments/assets/7ce20e0c-1b36-42b6-9eb1-b21670f62a93" />
<img width="1920" height="851" alt="Screenshot 2026-02-22 233000" src="https://github.com/user-attachments/assets/78127af7-7d5c-4162-932b-5a0a0d7d87ce" />
<img width="1895" height="857" alt="Screenshot 2026-02-22 233123" src="https://github.com/user-attachments/assets/dceb159e-ee17-4c44-9b43-c06a34292733" />

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
