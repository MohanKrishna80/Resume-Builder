# AI Resume Builder

An AI-powered Resume Builder web application that allows users to create, edit, and download professional resumes easily. The platform provides smart suggestions, structured resume sections, and a live preview to help users build ATS-friendly resumes.

## 🚀 Features

* Create and manage multiple resumes
* AI-powered resume content suggestions
* Live resume preview while editing
* Add sections like Education, Experience, Skills, Projects, and Certifications
* Download resume as PDF
* User authentication (Register / Login / Logout)
* Responsive UI for desktop and mobile
* Clean and modern resume templates

## 🛠️ Tech Stack

**Frontend**

* React.js
* Tailwind CSS
* Redux Toolkit
* React Router

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose

**Other Tools**

* JWT Authentication
* Axios
* PDF generation libraries
* AI API integration

## 📂 Project Structure

```
resume-builder
│
├── client
│   ├── components
│   ├── pages
│   ├── redux
│   └── assets
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   └── middleware
│
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/resume-builder.git
```

### 2. Navigate to the project folder

```bash
cd resume-builder
```

### 3. Install dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd server
npm install
```

### 4. Setup environment variables

Create a `.env` file in the **server** folder.

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AI_API_KEY=your_ai_api_key
```

### 5. Run the project

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

## 📸 Screenshots

Add screenshots of:

* Resume editor
* Resume preview
* Dashboard

## 📈 Future Improvements

* Multiple resume templates
* Drag and drop resume sections
* AI resume scoring
* Cover letter generator
* Resume sharing with public link

## 👨‍💻 Author

**Mohan Krishna**

Front-End / MERN Stack Developer

* GitHub: https://github.com/MohanKrishna80


## 📄 License

This project is open source and available under the MIT License.
