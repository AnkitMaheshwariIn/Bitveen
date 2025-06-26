# Bitveen - Full-Stack Application

Bitveen is a modern full-stack application built with Node.js and React, designed to provide a robust platform for content creation and management.

## 🚀 Tech Stack

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Google OAuth
- **API Integration**: Google APIs
- **File Storage**: AWS SDK
- **Security**: 
  - JWT Authentication
  - CORS
  - Body Parser
  - Mongoose Unique Validator
- **Development Tools**:
  - Nodemon
  - Dotenv
  - Mocha/Chai (Testing)

### Frontend (React)
- **Framework**: React.js
- **UI Library**: Material-UI (MUI)
- **Editor**: Editor.js (Rich Text Editor)
  - Code
  - Delimiter
  - Embed
  - Header
  - Image
  - Inline Code
  - List
  - Marker
  - Paragraph
  - Personality
  - Quote
  - Table
  - Underline
  - Warning
- **State Management**: React Context
- **Routing**: React Router
- **Authentication**: Google OAuth
- **Testing**: Jest, React Testing Library
- **Build Tools**: Webpack, Babel

## 📋 Project Structure

### Backend Structure
```
bitveen-node/
├── BITVEEN/           # Core application files
├── common/           # Shared utilities
├── conf/             # Configuration files
├── controllers/      # API controllers
├── models/           # Database models
├── routes/           # API routes
├── services/         # Business logic services
├── middlewares/      # Express middlewares
├── client/           # Frontend build files
└── server.js         # Main server file
```

### Frontend Structure
```
bitveen-react/
├── public/           # Static files
├── src/             # Source code
│   ├── components/  # React components
│   ├── config/      # Frontend configuration
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── utils/       # Utility functions
│   └── App.js       # Main application component
└── package.json     # Dependencies
```

## 🛠️ Features

### Core Features
- Rich Text Editor with multiple formatting options
- Google Authentication Integration
- Content Management System
- File Upload and Management
- Responsive Design
- Real-time Collaboration (coming soon)

### Technical Features
- RESTful API Architecture
- JWT-based Authentication
- Middleware-based Request Processing
- Error Handling and Logging
- Environment-based Configuration
- Automated Testing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- AWS Account (for file storage)
- Google Cloud Project (for OAuth)

### Backend Setup
1. Clone the repository
2. Navigate to `bitveen-node` directory
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure your environment variables
5. Start the server: `npm start`

### Frontend Setup
1. Navigate to `bitveen-react` directory
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure your environment variables
4. Start the development server: `npm start`

## 🚀 Running the Application

1. Start the backend server (in one terminal): `npm start` (from bitveen-node directory)
2. Start the frontend development server (in another terminal): `npm start` (from bitveen-react directory)
3. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser

## 🛠️ Development

### Environment Variables
The application uses environment variables for configuration. Create a `.env` file in both backend and frontend directories with the following variables:

#### Backend (.env)
```
PORT=3001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/AnkitMaheshwariIn/Bitveen)
- [Live Demo](https://bitveen.web.app/)
- [Figma](https://www.figma.com/file/CEK1TcRo9VXGiOEs5I8PIt/Bitveen?type=design&node-id=661%3A2&mode=design&t=kTO6ffe9tgjAmw4o-1)
