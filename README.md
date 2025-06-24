# Task Manager App

## Project Overview

This is a simple task manager application that allows users to register, log in, and manage their tasks. It consists of a React frontend and a Node.js/Express backend, all containerized with Docker for easy setup and deployment.

## Stack

*   **Frontend:** React, Vite
*   **Backend:** Node.js, Express, MongoDB
*   **Containerization:** Docker, Docker Compose

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd web-dev-assignment
    ```
3.  **Create environment files:**
    Create `.env` files in both `backend` and `frontend` directories.

4.  **Run the application using Docker Compose:**
    ```bash
    docker-compose up --build
    ```

## API Documentation

| Method | Endpoint             | Purpose                | Protected |
|--------|----------------------|------------------------|-----------|
| POST   | /api/users/register  | Register a new user    | No        |
| POST   | /api/users/login     | Log in a user          | No        |
| GET    | /api/tasks           | Get all tasks for a user | Yes       |
| POST   | /api/tasks           | Create a new task      | Yes       |
| PUT    | /api/tasks/:id       | Update a task          | Yes       |
| DELETE | /api/tasks/:id       | Delete a task          | Yes       |

## Environment Variables

Create a `.env` file in the `backend` and `frontend` directories with the following variables:

**Backend**

```
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
```

**Frontend**

```
VITE_BACKEND_URL=<your_backend_url>
```
