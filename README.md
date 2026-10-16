# TaskFlow — To-Do List Management System

A full-stack, responsive, and modern **To-Do List Management System** built with **React.js**, **Java Spring Boot**, and **MySQL**.

---

## 📌 Project Overview & Features

TaskFlow is designed to help users organize, monitor, and streamline daily tasks through a modern productivity dashboard.

### Key Features
- **Modern Responsive Dashboard:** Clean, intuitive UI optimized for desktops, tablets, and mobile devices.
- **Task Summary Metrics:** Live statistics displaying **Total Tasks**, **Pending Tasks**, **Completed Tasks**, and **Overdue Tasks**, along with a visual **Completion Rate Progress Bar**.
- **Complete CRUD Operations:** Create, View, Update, and Delete tasks with real-time UI updates.
- **Quick Status Toggle:** Instant one-click toggle between *Pending* and *Completed* status with animated checkboxes and striking completion styling.
- **Priority Management:** Color-coded badges for **High** (Rose), **Medium** (Blue), and **Low** (Emerald) priorities.
- **Smart Due Date Alerts:** Dynamic contextual labels highlighting *"Due today"*, *"Due tomorrow"*, *"Due in X days"*, or *"Overdue by X days"*.
- **Search & Multi-Filter System:** Real-time search by task title or description, status filtering (*All*, *Pending*, *Completed*, *Overdue*), and priority filtering (*High*, *Medium*, *Low*).
- **Sorting Options:** Sort tasks by **Due Date**, **Priority Level**, **Creation Date**, or **Title**, with Ascending/Descending order toggle.
- **Dual View Modes:** Seamlessly switch between **Card/Grid View** and **Compact List View**.
- **User Safety & Feedback:** Confirmation dialog before deleting any task, accessible modal forms for adding/editing tasks, input validation, and auto-dismissing toast notifications.

---

## 🏗️ Architecture & Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Single-page application with modular component architecture |
| **Icons & Styling** | Lucide React, Modern CSS3 | Custom design system using CSS variables, fluid typography, and responsive flex/grid layouts |
| **API Client** | Axios | RESTful HTTP communication with proxy and CORS configuration |
| **Backend** | Java 17+, Spring Boot 3.2.5 | Multi-layered enterprise architecture (Controller, Service, Repository, Entity, DTO) |
| **Persistence** | Spring Data JPA / Hibernate | Object-relational mapping with automated schema maintenance |
| **Database** | MySQL 8.0+ / 26+ | Relational persistence with indexed status and priority queries |

---

## 📂 Project Structure

```text
todo-management-system/
├── backend/
│   ├── pom.xml                                      # Maven build descriptor
│   └── src/
│       ├── main/
│       │   ├── java/com/todo/
│       │   │   ├── TodoManagementApplication.java   # Spring Boot entry point
│       │   │   ├── config/
│       │   │   │   └── WebConfig.java               # CORS configuration
│       │   │   ├── controller/
│       │   │   │   └── TaskController.java          # REST API endpoints
│       │   │   ├── dto/
│       │   │   │   ├── ApiResponse.java             # Generic response wrapper
│       │   │   │   ├── TaskRequest.java             # Task input validation DTO
│       │   │   │   ├── TaskResponse.java            # Task view DTO with overdue indicator
│       │   │   │   └── TaskStatsResponse.java       # Metric counters & progress DTO
│       │   │   ├── exception/
│       │   │   │   ├── ErrorResponse.java           # Centralized error model
│       │   │   │   ├── GlobalExceptionHandler.java  # ControllerAdvice error handler
│       │   │   │   └── ResourceNotFoundException.java # 404 Exception
│       │   │   ├── model/
│       │   │   │   ├── Priority.java                # Low, Medium, High enum
│       │   │   │   ├── PriorityConverter.java       # JPA string column converter
│       │   │   │   ├── Task.java                    # JPA Entity mapping to `tasks` table
│       │   │   │   ├── TaskStatus.java              # Pending, Completed enum
│       │   │   │   └── TaskStatusConverter.java     # JPA string column converter
│       │   │   ├── repository/
│       │   │   │   └── TaskRepository.java          # Spring Data JPA repository
│       │   │   └── service/
│       │   │       ├── TaskService.java             # Business logic interface
│       │   │       └── impl/TaskServiceImpl.java    # Filtering, sorting, and CRUD service
│       │   └── resources/
│       │       ├── application.properties           # Database & server configuration
│       │       └── schema.sql                       # MySQL schema creation script
│       └── test/java/com/todo/
│           └── service/TaskServiceImplTest.java     # Comprehensive unit tests
│
├── frontend/
│   ├── package.json                                 # NPM dependencies and scripts
│   ├── vite.config.js                               # Vite config with backend proxy
│   ├── index.html                                   # HTML5 shell with Google Fonts
│   ├── .env.example                                 # Environment variable template
│   ├── .env                                         # Local frontend configuration
│   └── src/
│       ├── main.jsx                                 # React root entry point
│       ├── App.jsx                                  # Main dashboard orchestrator
│       ├── index.css                                # Design system tokens & base styles
│       ├── App.css                                  # Component layouts, cards, modals
│       ├── api/
│       │   └── taskApi.js                           # Axios API service
│       ├── components/
│       │   ├── Navbar.jsx                           # Top brand bar with counters
│       │   ├── DashboardStats.jsx                   # Metric cards & progress bar
│       │   ├── TaskControls.jsx                     # Search, filter pills, sorting
│       │   ├── TaskList.jsx                         # Skeleton loader & task list/grid
│       │   ├── TaskCard.jsx                         # Task card item with badges
│       │   ├── TaskModal.jsx                        # Add/Edit task form modal
│       │   ├── DeleteConfirmModal.jsx               # Safety delete dialog
│       │   ├── Toast.jsx                            # Toast alert notifications
│       │   └── EmptyState.jsx                       # Contextual empty state view
│       └── utils/
│           └── dateUtils.js                         # Date formatting & due status calculation
│
└── README.md                                        # Documentation
```

---

## ⚙️ Prerequisites

Ensure the following tools are installed on your machine:
- **Java Development Kit (JDK):** Version 17 or higher (`java -version`)
- **Apache Maven:** Version 3.8+ (`mvn -v`)
- **Node.js & npm:** Node v18+ and npm v9+ (`node -v`, `npm -v`)
- **MySQL Server:** Version 8.0+ or compatible (`mysql --version`)

---

## 🗄️ Database Setup (MySQL)

1. Start your local MySQL server:
   ```bash
   # On macOS using Homebrew:
   brew services start mysql
   # Or start manually:
   mysql.server start
   ```

2. Create the database `tododb`:
   ```sql
   CREATE DATABASE IF NOT EXISTS tododb;
   ```

3. (Optional) Run the provided `schema.sql` if you prefer manual table creation:
   ```bash
   mysql -u root -p tododb < backend/src/main/resources/schema.sql
   ```
   *Note: Spring Boot Hibernate is set to `spring.jpa.hibernate.ddl-auto=update`, which will also create or update the table structure automatically.*

---

## 🚀 Running the Application

### 1. Start the Spring Boot Backend

Navigate to the `backend/` directory:
```bash
cd backend
```

Configure your MySQL credentials if different from the default (port `3306` or `3307`, user `root`, no password). You can supply environment variables:
```bash
export DB_URL="jdbc:mysql://localhost:3307/tododb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true"
export DB_USERNAME="root"
export DB_PASSWORD=""
export PORT=8080
```

Compile and run the backend:
```bash
# Using Maven Spring Boot plugin:
mvn spring-boot:run

# Or package and execute the JAR:
mvn clean package -DskipTests
java -jar target/todo-management-backend-1.0.0.jar
```

The backend server will start on: **`http://localhost:8080`**

### 2. Start the React Frontend

Open a new terminal window and navigate to `frontend/`:
```bash
cd frontend
```

Install NPM packages (first time only):
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Open your browser at: **`http://localhost:3000`**

---

## 🔌 API Endpoints Reference

All endpoints are prefixed with `/api/tasks`.

| Method | Endpoint | Query Parameters | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | `status`, `priority`, `search`, `sortBy`, `sortDirection` | Retrieve all tasks with optional filters | `200 OK` |
| `GET` | `/api/tasks/stats` | None | Retrieve summary statistics (total, pending, completed, overdue, completionRate) | `200 OK` |
| `GET` | `/api/tasks/{id}` | None | Retrieve single task by its primary key ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/tasks` | Request Body (`TaskRequest`) | Create a new task | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/tasks/{id}` | Request Body (`TaskRequest`) | Update all fields of an existing task | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `PATCH`| `/api/tasks/{id}/complete` | None | Mark task status as `Completed` | `200 OK` / `404 Not Found` |
| `PATCH`| `/api/tasks/{id}/toggle` | None | Toggle task status between `Pending` and `Completed` | `200 OK` / `404 Not Found` |
| `DELETE`| `/api/tasks/{id}` | None | Delete task permanently | `200 OK` / `404 Not Found` |

### Sample JSON Payload for `POST /api/tasks` and `PUT /api/tasks/{id}`
```json
{
  "title": "Prepare Sprint Review Presentation",
  "description": "Outline user feedback, demo features, and next sprint milestones.",
  "dueDate": "2026-10-25",
  "priority": "High",
  "status": "Pending"
}
```

---

## 🧪 Testing

### Backend Unit Tests
Run backend test suite covering `TaskServiceImpl` methods:
```bash
cd backend
mvn test
```

### End-to-End API Verification
```bash
# 1. Fetch statistics
curl -X GET http://localhost:8080/api/tasks/stats

# 2. Create a test task
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","priority":"High","status":"Pending","dueDate":"2026-10-30"}'

# 3. Retrieve all tasks
curl -X GET http://localhost:8080/api/tasks
```

---

## 🛠️ Troubleshooting

1. **MySQL Connection Refused / Access Denied (`ERROR 1045` / `CommunicationsException`):**
   - Verify that your MySQL server is running: `mysqladmin ping` or check port status.
   - If your MySQL runs on port 3306 or requires a password, specify them using environment variables:
     ```bash
     export DB_URL="jdbc:mysql://localhost:3306/tododb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true"
     export DB_USERNAME="root"
     export DB_PASSWORD="your_password"
     ```

2. **Port 8080 or Port 3000 already in use:**
   - Spring Boot port can be customized with: `export PORT=8081`
   - Frontend Vite port can be modified with: `npm run dev -- --port 3001`
   - When changing the backend port, ensure `frontend/.env` points to the new port.

3. **CORS Errors in Browser Console:**
   - CORS is already pre-configured in `WebConfig.java` to accept origins `http://localhost:3000` and `http://localhost:5173`. If running frontend on another origin, update `WebConfig.java` or use the Vite proxy defined in `vite.config.js`.
