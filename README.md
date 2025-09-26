# Sweet Shop Management System

A modern web application for managing a sweet shop, built with **MERN stack** (MongoDB, Express.js, React.js, Node.js). AI was used to help generate the basic skeleton of the backend and frontend, while the core logic and functionality were implemented independently.  

---

## Features

### User Features
- **Authentication:** Users can register, log in, and log out securely using **JWT-based authentication**.
- **Dashboard:** User-specific dashboard showing available sweets (admin or user).
- **Search & Filter:** Users can search sweets by **name, category, or price**.
- **Purchase:** Users can purchase sweets by specifying quantity.  

### Admin Features
- **Dashboard:** Admin-specific dashboard for managing the shop.
- **CRUD Operations:** Admins can **add, delete, update, and restock sweets**.
- **Inventory Management:** Track sweet quantities and ensure stock availability.
- **All User Features:** Admins can also search and purchase sweets like normal users.

---
## AI Usage with ChatGPT

During development, **ChatGPT (AI)** was used as a tool to accelerate the initial setup and design of the Sweet Shop Management System. It helped in the following ways:

1. **Backend Skeleton Generation**
   - ChatGPT provided the **initial structure** for the backend, including:
     - Setting up Express routes for CRUD operations on sweets.
     - Creating Mongoose schemas for the sweets and users.
     - Structuring controller files with placeholder functions.
   - This allowed me to focus on implementing the **actual logic** such as purchase handling, quantity validation, and authentication rather than boilerplate setup.

2. **Frontend Skeleton Design**
   - ChatGPT assisted in generating the **basic React component structure**, including:
     - Dashboard layouts for both user and admin.
     - SweetCard component to display sweets.
     - Routing with React Router.
     - Initial popup design for actions like purchase or restock.
   - AI suggested **component hierarchy and styling** with Tailwind CSS, giving a clean starting point for the UI.

3. **Code Examples & Guidance**
   - ChatGPT provided examples of:
     - Handling form inputs and popups.
     - Making API calls with axios.
     - Conditional rendering based on user roles (admin vs user).
   - These examples were **adapted and customized** by me to implement project-specific logic, like securely handling JWT, validating purchase quantities, and updating the database.

4. **Testing Assistance**
   - ChatGPT suggested **test structures and approaches** using Jest:
     - How to test React components (unit tests for SweetCard, popups).
     - How to test backend routes using Supertest.
     - How to implement **Red-Green-Refactor cycle** for TDD.
   - I wrote all the actual test cases and logic myself, ensuring the tests fit my application.

5. **Role of AI**
   - ChatGPT acted as a **development assistant**, saving time on boilerplate code, best practices, and design patterns.
   - **All functional logic, authentication, purchase/restock calculations, and integration with the database were implemented manually.**
   - AI helped with **ideas, structure, and examples**, but the system’s business logic is my own work.

**In summary:** AI with ChatGPT was used as a scaffolding and guidance tool to speed up development and ensure proper structure, but every functional feature, database interaction, and security measure was independently designed and implemented.  


---

## Authentication

- **JWT-based authentication** is used for both users and admins.
- Tokens are securely stored in cookies with proper handling.
- Different dashboards are rendered based on user role (`user` vs `admin`).

---



## Technology Stack

- **Frontend:** React.js, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, Cookies
- **Testing:** Jest

---
##Testing (Backend)

1.RED-I built routes but didn't implemented controllers and got failed output
   failed user route :  https://github.com/user-attachments/assets/6ed287d5-5105-437a-83c7-8219970ae55b

   failed sweet route : https://github.com/user-attachments/assets/e2b1d3ee-2bdc-4236-8dbf-8db926cea9c3

2.GREEN-I implemented controllers to get all test passes
   https://github.com/user-attachments/assets/00e4dc61-1ccb-40d6-ac76-5cfe7572d2b0
   
3 REFACTOR: improved and refined codebase for better readability and maintainability

