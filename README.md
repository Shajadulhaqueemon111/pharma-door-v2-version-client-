🔬PharmaDoor - Pharmacy Management Web Application

A role-based pharmacy management system where Admins and Pharmacists collaborate to manage medicines and prescriptions securely and efficiently.

🚀 Tech Stack:

Frontend: Next.js, React,TypeScript, Tailwind CSS
Backend/API: TypeScript, Node.js, Express
Database: MongoDB + Mongoose
Authentication: JWT-based, role-protected (User & Admin)
Deployment: Vercel
🧑‍⚕️ Pharmacist Registration Flow Pharmacists can register themselves, but cannot log into the dashboard until approved by an Admin.

📦 Medicine Management Pharmacists can sell medicines, manage inventory, and update availability (after getting access).

📜 Admin Panel Admins can: >Approve or reject pharmacist accounts >Monitor sales and medicine stock >Manage users and roles

📊 Dashboard Access Only approved pharmacists can access their dashboards to view and manage medicine-related tasks.

🛡️ Protected Routes Backend is protected with JWT tokens and custom middleware to ensure only authorized users can perform sensitive actions.
