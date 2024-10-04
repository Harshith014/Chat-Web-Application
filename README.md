

---

# Chat Web Application

## Overview

This is a full-stack **real-time chat application** built using the **MERN stack (MongoDB, Express, React, Node.js)** and **Socket.IO**. The application provides an interactive chat experience with real-time messaging, media sharing, and multi-language support through a custom-built translation API.

**Live Demo:** (https://chat-app-theta-lyart-86.vercel.app/)

## Features

- **Real-time Messaging:** Instant chat powered by **Socket.IO** for seamless communication between users.
- **Authentication:** Secure login and registration using **JWT** (JSON Web Tokens) and password encryption with **Bcrypt**.
- **File Sharing:** Integrated with **Cloudinary** for efficient image and document storage and sharing.
- **Emoji Support:** Choose from a wide variety of emojis to enhance conversations.
- **Voice Messaging:** Send and receive voice messages within the chat.
- **Message Translation:** Messages can be translated in real-time using a **custom API** built on **@vitalets/google-translate-api**, supporting multiple languages (English, French, Spanish, German, Italian, Portuguese, and Russian).
- **Responsive Design:** Fully responsive user interface, adaptable to both desktop and mobile devices.

## Tech Stack

### Frontend:
- **React.js**: JavaScript library for building interactive user interfaces.
- **Socket.IO Client**: To enable real-time communication with the server.
- **Cloudinary**: For media storage and management.
- **Custom Translation API**: Built using **@vitalets/google-translate-api** for live message translation.

### Backend:
- **Node.js**: JavaScript runtime for the server-side application.
- **Express.js**: Fast, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for handling user data and chat history.
- **Socket.IO**: Server-side library for real-time, bi-directional communication between web clients and servers.
- **JWT & Bcrypt.js**: For secure authentication and password hashing.
- **Cloudinary**: For cloud-based media storage and delivery.
- **Custom Translation API**: Built using **@vitalets/google-translate-api**.

## Installation

### Prerequisites:
- **Node.js**: Ensure Node.js is installed. You can download it from [here](https://nodejs.org/).
- **MongoDB**: A MongoDB instance is required for this project. Install MongoDB locally or use a cloud-based solution like MongoDB Atlas.

### Clone the Repository:

```bash
git clone https://github.com/Harshith014/chat-app.git
cd chat-app
```

### Environment Variables

Both the **frontend** and **backend** require `.env` files to store environment variables such as database URIs, JWT secrets, API keys, etc. Sample `.env` files are provided in both directories. Modify them with your credentials before starting the application.

### Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file and include the following variables:
```bash
MONGO_URI=<your MongoDB URI>
JWT_SECRET=<your JWT secret>
CLOUDINARY_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
```

Start the backend server:

```bash
node server.js
```

### Frontend Setup

Navigate to the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder for any frontend-specific environment variables.

Start the React development server:

```bash
npm run start
```

The application will be available at `http://localhost:3000`.

## Usage

- Open the application in your browser and register or log in using valid credentials.
- Start a chat with any registered user, send text messages, share files, or use the emoji picker.
- Send and listen to voice messages, and translate messages in real-time with support for English, French, Spanish, German, Italian, Portuguese, and Russian.

```

## Key Dependencies

### Backend:
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Socket.IO**
- **JWT**
- **Bcrypt**
- **Cloudinary**
- **@vitalets/google-translate-api**

### Frontend:
- **React.js**
- **Socket.IO Client**
- **Axios**
- **Cloudinary React SDK**



---
