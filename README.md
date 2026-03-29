# Expense Tracker

A modern, responsive, and secure full-stack web application for managing personal expenses. 

This application features a sophisticated dashboard for visualizing spending habits by category, detailed transaction management, and secure user authentication. Built with a Java Spring Boot backend and an Angular frontend styled beautifully with Tailwind CSS.

## 🚀 Features

* **Interactive Dashboard:** View total expenses, recent transactions, and spending broken down by customizable categories.
* **Custom Categories:** Ability to not only select from default categories (Food, Travel, Bills, etc.) but dynamically add and track your own custom spending categories.
* **Expense Management:** Full CRUD (Create, Read, Update, Delete) capabilities to manage your daily transactions.
* **Smart Filtering:** Filter expenses seamlessly by categories to analyze where your money goes.
* **Secure Authentication:** RESTful backend secured with JWT (JSON Web Tokens) and Spring Security.
* **Persistent Storage:** Uses a file-based H2 relational database, ensuring your data survives application restarts without the overhead of external database servers.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Angular 17+
- **Styling:** Tailwind CSS for a sleek, responsive, and modern UI.
- **State & Routing:** Standard Angular forms, HttpClient, and Router.

### Backend
- **Framework:** Java Spring Boot 3
- **Security:** Spring Security & JWT Authentication
- **Database:** H2 Database (File-based storage for easy setup and persistent data)
- **ORM:** Spring Data JPA / Hibernate
- **Build Tool:** Maven

## 💻 Getting Started

### Prerequisites
- Node.js and npm (for frontend)
- Angular CLI
- Java 17+ Development Kit (JDK)
- Maven

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend server will start on `http://localhost:8081`.*

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   ng serve
   ```
   *The frontend application will be available at `http://localhost:4200`.*

## 📸 Usage

1. Open your browser and navigate to `http://localhost:4200`.
2. Register a new account or log in.
3. Start tracking your expenses! Use the Dashboard to get high-level insights or navigate to the "Manage Expenses" section to add categorized transactions.
