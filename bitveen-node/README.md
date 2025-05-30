# Bitveen - Blogging Platform

Bitveen is a full-stack blogging platform that allows users to create, publish, and share articles. The platform features a rich text editor, user authentication, article management, and social interactions like comments and likes.

## Project Structure

This project consists of two main components:

1. **bitveen-node**: Backend API server built with Node.js and Express
2. **bitveen-react**: Frontend application built with React

## Technologies Used

### Backend (bitveen-node)

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **MongoDB**: NoSQL database (MongoDB Atlas)
- **Mongoose**: MongoDB object modeling tool
- **JWT Authentication**: For secure user sessions
- **HTTPS/HTTP**: Dual server setup for secure connections
- **AWS**: Deployment environment
- **PM2**: Process manager for Node.js applications

### Frontend (bitveen-react)

- **React**: JavaScript library for building user interfaces
- **React Router**: For navigation and routing
- **Material UI**: Component library for modern UI design
- **EditorJS**: Block-style editor for article creation
- **Axios**: HTTP client for API requests
- **Firebase**: Used for hosting and deployment

## Key Features

- User authentication (including social login)
- Article creation with rich text editor
- Article publishing and management
- Comments and replies system
- Like/heart functionality for articles
- User profiles and customization
- Article sharing and saving
- Reporting inappropriate content

## Project Architecture

### Backend Architecture

The backend follows a typical MVC (Model-View-Controller) pattern:

- **Models**: Define data structures (User, Article, Comment, etc.)
- **Controllers**: Handle business logic and data processing
- **Routes**: Define API endpoints and request handling
- **Middleware**: Authentication, session management, error handling

### Frontend Architecture

The React frontend is organized into components:

- **SitePages**: Main site pages (Home, Privacy Policy, etc.)
- **WriterPages**: Pages for content creators (New Article, Edit Article, etc.)
- **ReaderPages**: Pages for content consumers (Article View, Comments, etc.)
- **Common**: Shared components and utilities

## Running Locally

### Backend Setup

1. Navigate to the backend directory: `cd bitveen-node`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. The server will run on port 8000 (HTTP) and 8443 (HTTPS)

### Frontend Setup

1. Navigate to the frontend directory: `cd bitveen-react`
2. Install dependencies: `npm install`
3. Update the API configuration in `src/config/conf.js` to use the local backend
4. Start the development server: `npm start`
5. The application will run on port 3000

## Deployment

### AWS Deployment Notes

When the AWS instance restarts, you may need to restart the PM2 processes:

```bash
sudo pm2 status
sudo pm2 restart all
```

### Firebase Deployment (Frontend)

The frontend can be deployed to Firebase using the Firebase CLI:

```bash
npm run build
firebase deploy
```

## API Documentation

The backend provides a RESTful API with the following main endpoints:

- `/api/login`: Authentication endpoints
- `/api/user`: User management
- `/api/article`: Article CRUD operations
- `/api/comment`: Comment management
- `/api/heart`: Like/heart functionality
- `/api/storage`: File storage and management

All authenticated routes require a valid JWT token in the request header.

## Fix Node Server Issues by PORT redirection
## To fix : This site can’t be reached
## Whenever AWS instance restart of Bitveen.com - we need to run below commands:
sudo pm2 status
sudo iptables -t nat -L
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 8443

## Something else