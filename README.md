# Store Rating System 

## Tech Stack

* **Frontend:** React.js (Vite), CSS/SCSS
* **Backend:** Node.js, Express.js
* **Database:** MySQL (Relational DB)
* **Authentication:** JWT (JSON Web Tokens)

---

## Installation & Setup Guide

Follow these steps to set up the project locally.

### Prerequisites
* **Node.js** 
* **MySQL** 

### Step 1: Clone the Repository
```bash
git clone [https://github.com/tushars-code/STORE-RATING-APP.git]
```
### Step 2: Database Configuration

1.  Open your **MySQL terminal** or **MySQL Workbench**.
2.  Create the database by running the following command:
    ```sql
    CREATE DATABASE store_rating_db;
    ```
3.  **Import the Schema:**
    * Locate the `database.sql` file in the project's root directory.
    * Run the script to set up tables, relationships, and data integrity rules.
   
### Step 3: Backend Setup

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` folder and populate it with the following configuration:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASS=your_mysql_password
    DB_NAME=store_rating_db
    JWT_SECRET=your_secret_key
    ```
    > **Note:** Ensure you replace `your_mysql_user` and `your_mysql_password` with your actual local MySQL credentials.

4.  **Start the server:**
    ```bash
    node server.js
    ```
    *The backend should now be listening for requests at `http://localhost:5000`.*

### Step 4: Frontend Setup

1.  **Navigate to the frontend folder:**
    ```bash
    cd client-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    *The application will typically start at `http://localhost:5173`. Open this URL in your browser to view the app.*

---

### 📂 Project Structure Overview
To help you navigate the codebase:

```text
STORE-RATING-APP/
├── backend/            # Express.js Server & API Logic
│   ├── controllers/    # Business logic for Users, Stores, and Ratings
│   ├── routes/         # API Endpoint 
│   └── middleware/     # Role-based checks

├── client-frontend/    # React (Vite) Application
│   ├── src/components/ # UI components
│   └── src/pages/      # Role-specific Dashboards (Admin, Owner, User)
└── database.sql        # MySQL Database Schema 
```
## 🧪 How to Test (Step-by-Step)

Since the assignment logic restricts the **Sign-Up** page to Normal Users only, follow these steps to initialize and verify the full system:

### 1. Manually Create the Initial Admin
Run the following query in your MySQL terminal to create the system's first Administrator. This is required to access the management features:

```sql
INSERT INTO users (name, email, password, address, role) 
VALUES ('System Administrator Account', 'admin@test.com', 'Password123!', 'Head Office', 'ADMIN');
```
### 2. Admin Setup (Add Owners & Stores)
Once logged in as a **System Administrator**, you can populate the system:
* **Add Store Owners:** * Navigate to the **Add New User** section.
    * Fill in the details and select **Store Owner** from the role dropdown.
* **Add Stores:** * Use the **Add New Store** form.
    * Assign the store to a specific Store Owner by selecting their **User ID** or **Email** from the provided list.

### 3. User Interaction (Sign Up & Rate)
Test the consumer experience by following these steps:
* **Registration:** Go to the **Sign Up** page and create a new **Normal User** account.
* **Consumer Portal:** Log in to access the store directory.
* **Search & Rate:** * Search for stores by **Name** or **Address**.
    * Submit a rating (1-5 stars).

### 4. Owner Verification
Log in using a **Store Owner** account created in Step 2 to verify data reporting:
* **Analytics Dashboard:** View the **Average Rating** specifically for your assigned store.
* **Customer Feedback:** Access a detailed table showing the specific customers who rated the store and their individual feedback.

---
### UI Output
<img width="1919" height="977" alt="Screenshot 2026-02-05 210125" src="https://github.com/user-attachments/assets/62e21280-b546-4536-ad0d-69d76c4e9345" />
<img width="1902" height="1067" alt="Screenshot 2026-02-05 210100" src="https://github.com/user-attachments/assets/d00acbf1-63d9-4d6c-876a-6b926e35b5dd" />
<img width="1724" height="861" alt="Screenshot 2026-02-05 210045" src="https://github.com/user-attachments/assets/e536712d-c992-43c2-96ef-538ca0cd4bfd" />
<img width="1906" height="1095" alt="Screenshot 2026-02-05 210018" src="https://github.com/user-attachments/assets/861211e9-e7dd-435f-8fa1-ac50042e745d" />
<img width="1917" height="1021" alt="Screenshot 2026-02-05 210029" src="https://github.com/user-attachments/assets/31a1a13d-4ef8-4ce7-999d-3965645abffc" />
<img width="1919" height="994" alt="Screenshot 2026-02-05 210114" src="https://github.com/user-attachments/assets/72ff6415-5273-4fc2-9d5b-1514f5bb921c" />







