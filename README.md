# Group Management System

A full-stack web application for managing customer groups with CRUD operations, built as a Capstone project.

## Tech Stack

| Layer      | Technology        |
| ---------- | ----------------- |
| Frontend   | React JS 18       |
| Backend    | Spring Boot 3.2.4 |
| Database   | MySQL             |
| Build Tool | Maven             |

## Project Structure

```
Group Management System/
├── backend/                        # Spring Boot REST API
│   ├── src/main/java/com/capstone/groupmanagement/
│   │   ├── config/                 # CORS configuration
│   │   ├── controller/             # REST controllers
│   │   ├── dto/                    # Data Transfer Objects
│   │   ├── entity/                 # JPA entities
│   │   ├── exception/              # Custom exceptions & global handler
│   │   ├── repository/             # Spring Data JPA repositories
│   │   └── service/                # Business logic
│   └── src/main/resources/
│       └── application.properties  # App configuration
├── frontend/                       # React JS application
│   ├── public/
│   └── src/
│       ├── components/             # Reusable components (Navbar, Modal)
│       ├── pages/                  # Page components (Dashboard, AddGroup, EditGroup)
│       └── services/               # API service layer
└── database/
    └── schema.sql                  # MySQL schema & sample data
```

## Features

- **Dashboard**: View all groups with search, status indicators, and stats
- **Add Group**: Create new groups with unique name validation
- **Edit Group**: Update group names with duplicate check
- **Soft Delete**: Deactivate groups (sets `is_active` to `false`) instead of hard delete
- **Toggle Status**: Activate/deactivate groups via toggle button
- **Validation**: Empty field, duplicate name, and max-length validation with toast messages
- **Auto-redirect**: After add/update/delete, user is redirected back to dashboard

## Database Schema

| Field      | Type         | Description                          |
| ---------- | ------------ | ------------------------------------ |
| group_id   | INT (PK)     | Auto-generated unique ID             |
| group_name | VARCHAR(255) | Unique group name                    |
| is_active  | BOOLEAN      | `true` = active, `false` = inactive  |
| created_at | DATETIME     | Timestamp when group was created     |
| updated_at | DATETIME     | Timestamp when group was last updated|

## API Endpoints

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/api/groups`                     | Get all groups           |
| GET    | `/api/groups/{id}`                | Get group by ID          |
| POST   | `/api/groups`                     | Create a new group       |
| PUT    | `/api/groups/{id}`                | Update group name        |
| DELETE | `/api/groups/{id}`                | Soft delete (deactivate) |
| PATCH  | `/api/groups/{id}/toggle-status`  | Toggle active/inactive   |

## Prerequisites

- **Java 17** or higher
- **Node.js 16+** and npm
- **MySQL 8.0+**
- **Maven 3.8+**

## Setup & Run

### 1. Database Setup

```sql
-- Run the schema script in MySQL
SOURCE database/schema.sql;
```

Or create the database manually — the app will auto-create tables via Hibernate:

```sql
CREATE DATABASE group_management_db;
```

### 2. Backend Setup

```bash
cd backend

# Update database credentials in src/main/resources/application.properties
# spring.datasource.username=root
# spring.datasource.password=root

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on **http://localhost:3000**

## Configuration

### Database Credentials

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/group_management_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### CORS

The backend is configured to allow requests from `http://localhost:3000`. To change this, update:
- `backend/src/main/java/com/capstone/groupmanagement/config/CorsConfig.java`
- `backend/src/main/java/com/capstone/groupmanagement/controller/GroupController.java`
# Group-Management-System
