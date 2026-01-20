## Task Management API

A role-based Task Management REST API built using Node.js, Express, and JWT authentication, supporting users and admins with secure access control.

## Features
### Authentication
- User registration & login
- JWT access token (short-lived)
- Role-based authorization
- Secure password hashing
### Task Management
- Create, update, delete tasks
- Role-based task visibility
- Status & priority filtering
- Task ownership enforcement
### Admin Capabilities
- View all users
- Update user roles
- Delete users
- View system-wide task data
### Security
- JWT authentication
- bcrypt password hashing
- Rate limiting
- Input validation
- No password leakage in responses

## Tech Stack

* Node.js
* Express.js
* JWT
* bcrypt
* Joi validation
* Rate Limiting middleware

## Project Structure
```src/
 ├── app.js
 ├── db/
 ├── middleware/
 ├── routes/
 ├── utils/
 └── v1/components/
```

## Setup Instructions
1. Clone the repo
```
git clone https://github.com/darshilcodess/task_management_task.git
cd task_management_task
```

2. Install dependencies
```
npm install
```

3. Environment Variables
Create .env file:
PORT=5000
```
MONGO_URI=mongodb://localhost:27017/task_management_assignment
JWT_SECRET=16d33e9ed4f5787dee5f003e
JWT_EXPIRES_IN=1d
```
4. Run Server
```
npm start
```

## Future Improvements

- Refresh token implementation
- Database persistence
- Swagger documentation
- Task statistics endpoint
- Pagination & search optimization